class Api::V1::TasksController < ApplicationController
  def create
    return render json: { error: "제목이 필요합니다." }, status: :bad_request if params[:title].blank?

    analyzer = AiTaskAnalyzer.new(params[:title])
    
    begin
      # 항상 AI 분석 수행
      analysis = analyzer.analyze_task
      embedding = analyzer.generate_embedding
      
      gained_xp = analysis[:xp]

      task = Task.new(
        title: analysis[:title],
        category: analysis[:category],
        xp: gained_xp,
        partner_comment: analysis[:partner_comment],
        embedding: embedding,
        user_id: params[:user_id] # 사용자 아이디 추가
      )
      
      unless task.save
        return render json: { errors: task.errors }, status: :unprocessable_entity
      end

      # 연관된 진행 중인 목표(Goal) 찾기 및 XP 합산
      affected_goals = []
      # 진행 중인 목표(status: active) 중 삭제되지 않고 임베딩 거리가 0.38 미만인 것들을 찾기
      Goal.active.not_deleted.where(user_id: params[:user_id]).nearest_neighbors(:embedding, embedding, distance: "cosine").limit(3).each do |goal|
        if goal.neighbor_distance < 0.38
          goal.current_xp += gained_xp
          goal.status = :completed if goal.current_xp >= goal.target_xp
          goal.save
          
          affected_goals << { 
            id: goal.id, 
            title: goal.title, 
            xp_gained: gained_xp,
            current_xp: goal.current_xp, 
            target_xp: goal.target_xp, 
            completed: goal.completed? 
          }
        end
      end
      
      response_data = {
        message: "새로운 습관이 추가되었습니다.",
        task: task,
        affected_goals: affected_goals
      }
      
      render json: response_data, status: :created
    rescue AiTaskAnalyzer::QuotaExceededError => e
      render json: { error: e.message }, status: :too_many_requests
    rescue AiTaskAnalyzer::ConnectionError => e
      render json: { error: e.message }, status: :gateway_timeout
    rescue AiTaskAnalyzer::ParserError, AiTaskAnalyzer::ApiError => e
      render json: { error: e.message }, status: :bad_gateway
    rescue StandardError => e
      render json: { error: "예기치 못한 오류가 발생했습니다: #{e.message}" }, status: :internal_server_error
    end
  end

  def similar
    task = Task.find(params[:id])
    similar_tasks = task.nearest_neighbors(:embedding, distance: "euclidean").limit(3)
    
    render json: similar_tasks
  end
end