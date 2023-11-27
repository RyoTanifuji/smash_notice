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

ActiveRecord::Schema[7.0].define(version: 2023_11_27_080743) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "fighters", force: :cascade do |t|
    t.string "number"
    t.string "name"
  end

  create_table "folders", force: :cascade do |t|
    t.string "name", null: false
    t.string "type"
    t.bigint "user_id", null: false
    t.bigint "fighter_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["fighter_id"], name: "index_folders_on_fighter_id"
    t.index ["user_id"], name: "index_folders_on_user_id"
  end

  create_table "memo_blocks", force: :cascade do |t|
    t.bigint "memo_id"
    t.string "blockable_type"
    t.bigint "blockable_id"
    t.integer "level", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["blockable_type", "blockable_id"], name: "index_memo_blocks_on_blockable"
    t.index ["level"], name: "index_memo_blocks_on_level"
    t.index ["memo_id"], name: "index_memo_blocks_on_memo_id"
  end

  create_table "memos", force: :cascade do |t|
    t.string "title", null: false
    t.integer "state", default: 1
    t.string "type"
    t.bigint "user_id", null: false
    t.bigint "folder_id", null: false
    t.bigint "fighter_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["fighter_id"], name: "index_memos_on_fighter_id"
    t.index ["folder_id"], name: "index_memos_on_folder_id"
    t.index ["user_id"], name: "index_memos_on_user_id"
  end

  create_table "sentences", force: :cascade do |t|
    t.string "subtitle"
    t.text "body"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", force: :cascade do |t|
    t.string "name", null: false
    t.string "email", null: false
    t.string "crypted_password"
    t.string "salt"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  add_foreign_key "folders", "fighters"
  add_foreign_key "folders", "users"
  add_foreign_key "memo_blocks", "memos"
  add_foreign_key "memos", "fighters"
  add_foreign_key "memos", "folders"
  add_foreign_key "memos", "users"
end
