class RenameUsersToComUsers < ActiveRecord::Migration[8.1]
  def change
    rename_table :users, :com_users
  end
end
