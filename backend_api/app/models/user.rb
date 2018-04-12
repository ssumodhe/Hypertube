class User < ActiveRecord::Base
  attr_accessor :image_base
  before_validation :parse_image
  before_save -> { skip_confirmation! }
  validate :password_complexity

  devise :database_authenticatable, :registerable,
          :recoverable, :rememberable, :trackable, :validatable,
          :omniauthable
  include DeviseTokenAuth::Concerns::User

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

  # def self.from_omniauth(auth)
  #   where(provider: auth.provider, uid: auth.uid).first_or_create do |user|
  #     user.provider = auth.provider 
  #     user.uid      = auth.uid
  #     user.username     = auth.info.name
  #     user.save
  #   end
  # end

  # def create_token(client_id: nil, token: nil, expiry: nil, **token_extras)
  #   client_id ||= SecureRandom.urlsafe_base64(nil, false)
  #   token     ||= SecureRandom.urlsafe_base64(nil, false)
  #   expiry    ||= (Time.zone.now + token_lifespan).to_i

  #   self.tokens[client_id] = {
  #     token: BCrypt::Password.create(token),
  #     expiry: expiry
  #   }.merge!(token_extras)

  #   clean_old_tokens

  #   [client_id, token, expiry]
  # end

  private
  def parse_image
    if image_base
      image = Paperclip.io_adapters.for(image_base)
      image.original_filename = "file.jpg"
      picture_file_name = 'avatar'
      self.picture = image
    end
  end

  
end
