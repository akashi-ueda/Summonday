class Api::V1::AuthController < ApplicationController
  def login
    user = User.find_by(email: params[:email])

    if user&.authenticate(params[:password])
      # 간단한 토큰 발급이나 세션 유지 대신, 현재는 유저 정보(id 등)만 응답합니다.
      # 향후 JWT 방식 등으로 확장할 수 있습니다.
      render json: { 
        message: "로그인 성공", 
        user: { id: user.id, email: user.email, name: user.name }
      }, status: :ok
    else
      render json: { error: "이메일 또는 비밀번호가 올바르지 않습니다." }, status: :unauthorized
    end
  end
end
