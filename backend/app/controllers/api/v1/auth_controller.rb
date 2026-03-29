class Api::V1::AuthController < ApplicationController
  def login
    user = User.find_by(email: params[:email])

    if user&.authenticate(params[:password])
      # 簡単なトークン発行やセッション維持の代わりに、現在はユーザー情報（IDなど）のみを返します。
      # 将来的にJWT方式などに拡張できます。
      render json: { 
        message: "ログイン成功", 
        user: { id: user.id, email: user.email, name: user.name }
      }, status: :ok
    else
      render json: { error: "メールアドレスまたはパスワードが正しくありません。" }, status: :unauthorized
    end
  end
end
