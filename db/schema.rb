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

ActiveRecord::Schema[7.0].define(version: 2024_01_04_013918) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "bookmarks", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "memo_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["memo_id"], name: "index_bookmarks_on_memo_id"
    t.index ["user_id", "memo_id"], name: "index_bookmarks_on_user_id_and_memo_id", unique: true
    t.index ["user_id"], name: "index_bookmarks_on_user_id"
  end

  create_table "embeds", force: :cascade do |t|
    t.string "subtitle"
    t.integer "embed_type", default: 0, null: false
    t.string "identifier"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

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

  create_table "images", force: :cascade do |t|
    t.string "subtitle"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "picture_width", default: 500
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
    t.integer "state", default: 0
    t.string "type"
    t.bigint "user_id", null: false
    t.bigint "folder_id", null: false
    t.bigint "fighter_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "opponent_id"
    t.index ["fighter_id"], name: "index_memos_on_fighter_id"
    t.index ["folder_id"], name: "index_memos_on_folder_id"
    t.index ["opponent_id"], name: "index_memos_on_opponent_id"
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
    t.integer "role", default: 0, null: false
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "bookmarks", "memos"
  add_foreign_key "bookmarks", "users"
  add_foreign_key "folders", "fighters"
  add_foreign_key "folders", "users"
  add_foreign_key "memo_blocks", "memos"
  add_foreign_key "memos", "fighters"
  add_foreign_key "memos", "fighters", column: "opponent_id"
  add_foreign_key "memos", "folders"
  add_foreign_key "memos", "users"
end
