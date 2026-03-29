class Api::V1::TasksController < ApplicationController
  def create
    return render json: { error: "タイトルが必要です。" }, status: :bad_request if params[:title].blank?

    analyzer = AiTaskAnalyzer.new(params[:title])
    
    begin
      # 常にAI分析を実行
      analysis = analyzer.analyze_task
      embedding = analyzer.generate_embedding
      
      # 進行中の目標（status: active）のうち、削除されておらず埋め込み距離が0.28未満のものをまず探す
      related_goals = Goal.active.not_deleted.where(user_id: params[:user_id]).nearest_neighbors(:embedding, embedding, distance: "cosine")
      
      # 0.28以内の目標が一つもなければ習慣として認めない
      if related_goals.none? || related_goals.first.neighbor_distance >= 0.28
        return render json: { 
          error: "目標に関連のない行動です。もっと具体的に入力するか、目標と結びつく習慣を記録してください！", 
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

      # 関連する目標リストを構成
      affected_goals = []
      related_goals.each do |goal|
        next if goal.neighbor_distance >= 0.28
        
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
        message: "新しい習慣が追加されました。",
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
      render json: { error: "予期しないエラーが発生しました: #{e.message}" }, status: :internal_server_error
    end
  end

  def similar
    task = Task.find(params[:id])
    similar_tasks = task.nearest_neighbors(:embedding, distance: "euclidean").limit(3)
    
    render json: similar_tasks
  end
end