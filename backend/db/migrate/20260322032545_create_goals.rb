class CreateGoals < ActiveRecord::Migration[8.1]
  def change
    create_table :gen_goals do |t|
      t.string :title
      t.integer :difficulty
      t.integer :current_xp, default: 0
      t.integer :target_xp
      t.integer :status, default: 0
      t.integer :user_id
      t.vector :embedding, limit: 3072

      t.timestamps
    end
  end
end
