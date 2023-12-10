class Image < ApplicationRecord
  has_one :memo_block, as: :blockable, dependent: :destroy
  has_one :memo, through: :memo_block

  validates :subtitle, length: { maximum: 20 }
  validates :picture_width, numericality: { only_integer: true, greater_than_or_equal_to: 200, less_than_or_equal_to: 800 }

  has_one_attached :picture
  attr_accessor :file

  def parse_base64(file)
    if file.present?
      prefix = file[/(image|application)(\/.*)(?=\;)/]
      type = prefix.sub(/(image|application)(\/)/, "")
      data = Base64.decode64(file.sub(/data:#{prefix};base64,/, ""))
      filename = "#{Time.zone.now.strftime('%Y%m%d%H%M%S%L')}.#{type}"
      File.open("#{Rails.root}/tmp/#{filename}", 'wb') do |f|
        f.write(data)
      end
      picture.detach if picture.attached?
      picture.attach(io: File.open("#{Rails.root}/tmp/#{filename}"), filename: filename)
      FileUtils.rm("#{Rails.root}/tmp/#{filename}")
    end
  end

  def picture_url
    picture.attached? ? Rails.application.routes.url_helpers.rails_blob_path(picture, only_path: true) : nil
  end
end
