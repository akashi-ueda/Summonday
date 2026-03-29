# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_03_22_072641) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"
  enable_extension "vector"

  create_table "com_users", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "email"
    t.string "name"
    t.string "password_digest"
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_com_users_on_email", unique: true
  end

  create_table "gen_goals", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.integer "current_xp", default: 0
    t.boolean "deleted", default: false, null: false
    t.integer "difficulty"
    t.vector "embedding", limit: 3072
    t.boolean "is_main", default: false, null: false
    t.integer "status", default: 0
    t.integer "target_xp"
    t.string "title"
    t.datetime "updated_at", null: false
    t.integer "user_id"
  end

  create_table "gen_tasks", force: :cascade do |t|
    t.string "category"
    t.datetime "created_at", null: false
    t.vector "embedding", limit: 3072
    t.text "partner_comment"
    t.string "title"
    t.datetime "updated_at", null: false
    t.integer "user_id"
    t.integer "xp"
  end
end
