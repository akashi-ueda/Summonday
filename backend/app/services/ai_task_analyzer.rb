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

  # 1. 태스크 분석 (generateContent API 호출)
  def analyze_task
    uri = URI(generate_url)
    
    # Gemini API의 JSON Mode 및 System Instruction 규격
    payload = {
      systemInstruction: {
        parts: [{ text: "너는 사용자의 일정을 분석해주는 게임 파트너야. 다음 포맷의 JSON만 반환해: { \"representative_title\": \"string(활동의 짧고 포괄적인 이름)\", \"category\": \"string\", \"xp\": number(10~100사이), \"partner_comment\": \"string\" }. \n⚠️ 카테고리는 반드시 다음 중 하나만 선택해: [운동, 공부, 자기계발, 업무, 일상, 취미]" }]
      },
      contents: [
        { parts: [{ text: "오늘 할 일: #{@task_title}" }] }
      ],
      generationConfig: {
        responseMimeType: "application/json"
      }
    }

    response = Net::HTTP.post(uri, payload.to_json, "Content-Type" => "application/json")
    
    if response.code == '429'
      raise QuotaExceededError, "Gemini API 할당량이 초과되었습니다. 잠시 후 다시 시도해 주세요."
    elsif response.code != '200'
      raise ApiError, "Gemini API 오류: #{response.body}"
    end

    result = JSON.parse(response.body)
    json_text = result.dig("candidates", 0, "content", "parts", 0, "text")
    raise ApiError, "API 응답 형식이 올바르지 않습니다." unless json_text
    
    analysis_data = JSON.parse(json_text)
    {
      title: analysis_data['representative_title'] || @task_title,
      category: analysis_data['category'],
      xp: analysis_data['xp'],
      partner_comment: analysis_data['partner_comment']
    }
  rescue Net::OpenTimeout, Net::ReadTimeout, Errno::ECONNREFUSED, SocketError => e
    raise ConnectionError, "네트워크 연결 오류: #{e.message}"
  rescue JSON::ParserError => e
    raise ParserError, "데이터 해석 오류: #{e.message}"
  end

  # 1-1. 목표 생성 시 난이도 분석 (generateContent API 호출)
  def analyze_goal
    uri = URI(generate_url)
    
    payload = {
      systemInstruction: {
        parts: [{ text: "너는 사용자의 목표를 분석하여 난이도를 평가하는 AI야. 주어진 목표를 달성하는 데 필요한 난이도를 판별하여 다음 JSON 포맷으로 반환해: { \"difficulty\": \"string(easy, medium, hard 중 하나)\" }" }]
      },
      contents: [
        { parts: [{ text: "목표: #{@task_title}" }] }
      ],
      generationConfig: {
        responseMimeType: "application/json"
      }
    }

    response = Net::HTTP.post(uri, payload.to_json, "Content-Type" => "application/json")
    
    if response.code == '429'
      raise QuotaExceededError, "Gemini API 할당량이 초과되었습니다. 잠시 후 다시 시도해 주세요."
    elsif response.code != '200'
      raise ApiError, "Gemini API 오류: #{response.body}"
    end

    result = JSON.parse(response.body)
    json_text = result.dig("candidates", 0, "content", "parts", 0, "text")
    raise ApiError, "API 응답 형식이 올바르지 않습니다." unless json_text
    
    analysis_data = JSON.parse(json_text)
    {
      difficulty: analysis_data['difficulty']
    }
  rescue Net::OpenTimeout, Net::ReadTimeout, Errno::ECONNREFUSED, SocketError => e
    raise ConnectionError, "네트워크 연결 오류: #{e.message}"
  rescue JSON::ParserError => e
    raise ParserError, "데이터 해석 오류: #{e.message}"
  end

  # 2. 태스크 벡터화 (embedContent API 호출)
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
      raise QuotaExceededError, "Gemini 임베딩 API 할당량이 초과되었습니다."
    elsif response.code != '200'
      raise ApiError, "Gemini 임베딩 API 오류: #{response.body}"
    end

    result = JSON.parse(response.body)
    values = result.dig("embedding", "values")
    Rails.logger.info "Embedding Size: #{values&.size}"
    values
  rescue Net::OpenTimeout, Net::ReadTimeout, Errno::ECONNREFUSED, SocketError => e
    raise ConnectionError, "네트워크 연결 오류: #{e.message}"
  end

  private

end