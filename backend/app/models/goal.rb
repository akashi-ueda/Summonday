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
                       when "easy" then 300
                       when "medium" then 500
                       when "hard" then 1000
                       else 300
                       end
  end
end
