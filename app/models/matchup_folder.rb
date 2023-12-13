class MatchupFolder < Folder
  has_one :template_memo, foreign_key: "folder_id"
end
