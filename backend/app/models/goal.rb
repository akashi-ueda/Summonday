class Goal < ApplicationRecord
  self.table_name = :gen_goals
  has_neighbors :embedding

  enum :difficulty, { easy: 0, medium: 1, hard: 2 }
  enum :status, { active: 0, completed: 1 }

  scope :not_deleted, -> { where(deleted: false) }

  before_create :set_target_xp

  private

  def set_target_xp
    self.target_xp ||= case difficulty
                       when "easy" then 1000
                       when "medium" then 5000
                       when "hard" then 10000
                       else 1000
                       end
  end
end
