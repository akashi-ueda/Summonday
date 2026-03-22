class Api::V1::TasksController < ApplicationController
  def create
    return render json: { error: "제목이 필요합니다." }, status: :bad_request if params[:title].blank?

    analyzer = AiTaskAnalyzer.new(params[:title])
    
    begin
      # 항상 AI 분석 수행
      analysis = analyzer.analyze_task
      embedding = analyzer.generate_embedding
      
      # 진행 중인 목표(status: active) 중 삭제되지 않고 임베딩 거리가 0.38 미만인 것들을 먼저 찾기
      related_goals = Goal.active.not_deleted.where(user_id: params[:user_id]).nearest_neighbors(:embedding, embedding, distance: "cosine")
      
      # 0.38 이내의 목표가 하나도 없다면 습관으로 인정하지 않음
      if related_goals.none? || related_goals.first.neighbor_distance >= 0.38
        return render json: { 
          error: "현재 설정하신 어떤 목표와도 일치하지 않는 행동입니다. 목표와 관련된 습관을 기록해 보세요!", 
          distance: related_goals.first&.neighbor_distance 
        }, status: :unprocessable_entity
      end

      gained_xp = analysis[:xp]

      task = Task.new(
        title: analysis[:title],
        category: analysis[:category],
        xp: gained_xp,
        partner_comment: analysis[:partner_comment],
        embedding: embedding,
        user_id: params[:user_id]
      )
      
      unless task.save
        return render json: { errors: task.errors }, status: :unprocessable_entity
      end

      # 연관된 목표 리스트 구성
      affected_goals = []
      related_goals.each do |goal|
        next if goal.neighbor_distance >= 0.38
        
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
      
      render json: {
        message: "새로운 습관이 추가되었습니다.",
        task: task,
        affected_goals: affected_goals
      }, status: :created
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