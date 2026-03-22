class AddDeletedToGenGoals < ActiveRecord::Migration[8.1]
  def change
    add_column :gen_goals, :deleted, :boolean, default: false, null: false
  end
end
