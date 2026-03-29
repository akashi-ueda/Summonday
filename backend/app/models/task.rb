class Task < ApplicationRecord
  self.table_name = :gen_tasks
  has_neighbors :embedding
end
