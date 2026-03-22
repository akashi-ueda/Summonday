class Api::V1::GoalsController < ApplicationController
  def index
    goals = Goal.where(user_id: params[:user_id]).order(created_at: :desc)
    render json: goals
  end

  def create
    if params[:title].blank?
      return render json: { error: "목표 제목이 필요합니다." }, status: :bad_request
    end

    begin
      analyzer = AiTaskAnalyzer.new(params[:title])
      
      # 1. AI를 통한 난이도 분석
      analysis = analyzer.analyze_goal
      
      # 2. 임베딩(벡터) 생성
      embedding = analyzer.generate_embedding

      goal = Goal.new(
        title: params[:title],
        difficulty: analysis[:difficulty],
        embedding: embedding,
        user_id: params[:user_id] # 사용자 아이디 추가
      )

      if goal.save
        render json: goal, status: :created
      else
        render json: { errors: goal.errors }, status: :unprocessable_entity
      end
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

  def abandon
    goal = Goal.find(params[:id])
    if goal.update(deleted: true)
      render json: { message: "목표를 포기했습니다.", goal: goal }, status: :ok
    else
      render json: { error: "상태 변경에 실패했습니다." }, status: :unprocessable_entity
    end
  end

  def restore
    goal = Goal.find(params[:id])
    if goal.update(deleted: false)
      render json: { message: "목표를 복구했습니다.", goal: goal }, status: :ok
    else
      render json: { error: "상태 변경에 실패했습니다." }, status: :unprocessable_entity
    end
  end
end
