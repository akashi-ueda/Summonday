require 'net/http'
require 'uri'
require 'json'

class AiTaskAnalyzer
  class QuotaExceededError < StandardError; end
  class ApiError < StandardError; end
  class ConnectionError < StandardError; end
  class ParserError < StandardError; end


  def api_key
    ENV['GEMINI_API_KEY']&.gsub(/["']/, '')
  end

  def generate_url
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=#{api_key}"
  end

  def embed_url
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=#{api_key}"
  end

  def initialize(task_title)
    @task_title = task_title
  end

  # 1. タスク分析（generateContent APIを呼び出す）
  def analyze_task
    uri = URI(generate_url)
    
    # Gemini APIのJSONモードおよびシステム指示の仕様
    payload = {
      systemInstruction: {
        parts: [{ text: "あなたはユーザーのスケジュールを分析するゲームパートナーです。次のフォーマットのJSONのみ返してください: { \"representative_title\": \"string(活動の短く包括的な名前)\", \"category\": \"string\", \"xp\": number(10〜100の間), \"partner_comment\": \"string\" }. \n⚠️ カテゴリは必ず次のいずれかを選択してください: [運動, 勉強, 自己啓発, 仕事, 日常, 趣味]" }]
      },
      contents: [
        { parts: [{ text: "今日のやること: #{@task_title}" }] }
      ],
      generationConfig: {
        responseMimeType: "application/json"
      }
    }

    response = Net::HTTP.post(uri, payload.to_json, "Content-Type" => "application/json")
    
    if response.code == '429'
      raise QuotaExceededError, "Gemini APIのクォータを超過しました。しばらくしてから再度お試しください。"
    elsif response.code != '200'
      raise ApiError, "Gemini APIエラー: #{response.body}"
    end

    result = JSON.parse(response.body)
    json_text = result.dig("candidates", 0, "content", "parts", 0, "text")
    raise ApiError, "APIレスポンスの形式が正しくありません。" unless json_text
    
    analysis_data = JSON.parse(json_text)
    {
      title: analysis_data['representative_title'] || @task_title,
      category: analysis_data['category'],
      xp: analysis_data['xp'],
      partner_comment: analysis_data['partner_comment']
    }
  rescue Net::OpenTimeout, Net::ReadTimeout, Errno::ECONNREFUSED, SocketError => e
    raise ConnectionError, "ネットワーク接続エラー: #{e.message}"
  rescue JSON::ParserError => e
    raise ParserError, "データ解析エラー: #{e.message}"
  end

  # 1-1. 目標作成時の難易度分析（generateContent APIを呼び出す）
  def analyze_goal
    uri = URI(generate_url)
    
    payload = {
      systemInstruction: {
        parts: [{ text: "あなたはユーザーの目標を分析して難易度を評価するAIです。与えられた目標を達成するために必要な難易度を判別して、次のJSONフォーマットで返してください: { \"difficulty\": \"string(easy, medium, hard のいずれか)\" }" }]
      },
      contents: [
        { parts: [{ text: "目標: #{@task_title}" }] }
      ],
      generationConfig: {
        responseMimeType: "application/json"
      }
    }

    response = Net::HTTP.post(uri, payload.to_json, "Content-Type" => "application/json")
    
    if response.code == '429'
      raise QuotaExceededError, "Gemini APIのクォータを超過しました。しばらくしてから再度お試しください。"
    elsif response.code != '200'
      raise ApiError, "Gemini APIエラー: #{response.body}"
    end

    result = JSON.parse(response.body)
    json_text = result.dig("candidates", 0, "content", "parts", 0, "text")
    raise ApiError, "APIレスポンスの形式が正しくありません。" unless json_text
    
    analysis_data = JSON.parse(json_text)
    {
      difficulty: analysis_data['difficulty']
    }
  rescue Net::OpenTimeout, Net::ReadTimeout, Errno::ECONNREFUSED, SocketError => e
    raise ConnectionError, "ネットワーク接続エラー: #{e.message}"
  rescue JSON::ParserError => e
    raise ParserError, "データ解析エラー: #{e.message}"
  end

  # 2. タスクのベクトル化（embedContent APIを呼び出す）
  def generate_embedding
    uri = URI(embed_url)
    
    payload = {
      model: "models/gemini-embedding-001",
      content: {
        parts: [{ text: @task_title }]
      }
    }

    response = Net::HTTP.post(uri, payload.to_json, "Content-Type" => "application/json")
    
    if response.code == '429'
      raise QuotaExceededError, "Gemini埋め込みAPIのクォータを超過しました。"
    elsif response.code != '200'
      raise ApiError, "Gemini埋め込みAPIエラー: #{response.body}"
    end

    result = JSON.parse(response.body)
    values = result.dig("embedding", "values")
    Rails.logger.info "Embedding Size: #{values&.size}"
    values
  rescue Net::OpenTimeout, Net::ReadTimeout, Errno::ECONNREFUSED, SocketError => e
    raise ConnectionError, "ネットワーク接続エラー: #{e.message}"
  end

  private

end