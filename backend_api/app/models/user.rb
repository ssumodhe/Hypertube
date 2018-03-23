class User < ActiveRecord::Base

  include DeviseTokenAuth::Concerns::User
  attr_accessor :image_base
  before_validation :parse_image
  validate :password_complexity

  devise :database_authenticatable, :registerable,
          :recoverable, :rememberable, :trackable, :validatable,
          :omniauthable

  has_attached_file :picture, styles: { medium: "300x300>", thumb: "100x100>" }, default_url: "/images/:style/missing.png"
  validates_attachment :picture, presence: true
  do_not_validate_attachment_file_type :picture
  has_many :comments

  
  def password_complexity
    if password.present?
       if !password.match(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(.{6,128})$/)
         errors.add :password, " complexity requirement not met"
       end
    end
  end

  private
  def parse_image
    if image_base
      image = Paperclip.io_adapters.for(image_base)
      image.original_filename = "file.jpg"
      self.picture = image
    end
  end
end
