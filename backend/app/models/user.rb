class User < ApplicationRecord
  self.table_name = :com_users
  has_secure_password
end
