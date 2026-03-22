class ChangeEmbeddingLimitInTasks < ActiveRecord::Migration[8.1]
  def change
    change_column :gen_tasks, :embedding, :vector, limit: 3072
  end
end
