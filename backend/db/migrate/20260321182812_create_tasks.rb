class CreateTasks < ActiveRecord::Migration[8.1]
  def change
    create_table :gen_tasks do |t|
      t.string :title
      t.string :category
      t.integer :xp
      t.text :partner_comment
      t.integer :user_id
      t.vector :embedding, limit: 3072

      t.timestamps
    end
  end
end
