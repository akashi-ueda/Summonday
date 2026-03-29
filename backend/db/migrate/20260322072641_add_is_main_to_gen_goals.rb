class AddIsMainToGenGoals < ActiveRecord::Migration[8.1]
  def change
    add_column :gen_goals, :is_main, :boolean, default: false, null: false
  end
end
