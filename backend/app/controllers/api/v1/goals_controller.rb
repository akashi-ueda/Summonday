class Api::V1::GoalsController < ApplicationController
  def index
    goals = Goal.where(user_id: params[:user_id]).order(created_at: :desc)
    render json: goals
  end

  def create
    if params[:title].blank?
      return render json: { error: "目標のタイトルが必要です。" }, status: :bad_request
    end

    begin
      analyzer = AiTaskAnalyzer.new(params[:title])
      
      # 1. AIによる難易度分析
      analysis = analyzer.analyze_goal
      
      # 2. 埋め込み（ベクトル）の生成
      embedding = analyzer.generate_embedding

      goal = Goal.new(
        title: params[:title],
        difficulty: analysis[:difficulty],
        embedding: embedding,
        user_id: params[:user_id] # ユーザーIDを追加
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
      render json: { error: "予期しないエラーが発生しました: #{e.message}" }, status: :internal_server_error
    end
  end

  def abandon
    goal = Goal.find(params[:id])
    if goal.update(deleted: true)
      render json: { message: "目標を断念しました。", goal: goal }, status: :ok
    else
      render json: { error: "状態の変更に失敗しました。" }, status: :unprocessable_entity
    end
  end

  def restore
    goal = Goal.find(params[:id])
    if goal.update(deleted: false)
      render json: { message: "目標を復元しました。", goal: goal }, status: :ok
    else
      render json: { error: "状態の変更に失敗しました。" }, status: :unprocessable_entity
    end
  end
  def set_main
    goal = Goal.find(params[:id])
    # 当該ユーザーの既存のメイン目標をすべて解除してから新たに設定
    Goal.where(user_id: goal.user_id).update_all(is_main: false)
    if goal.update(is_main: true)
      render json: { message: "メイン目標に設定しました。", goal: goal }, status: :ok
    else
      render json: { error: "メイン目標の設定に失敗しました。" }, status: :unprocessable_entity
    end
  end
end
