class User < ActiveRecord::Base
  # Include default devise modules.
  devise :database_authenticatable, :registerable,
          :recoverable, :rememberable, :trackable, :validatable,
          :omniauthable
  include DeviseTokenAuth::Concerns::User

  has_many :comments

  validate :password_complexity
  def password_complexity
    if password.present?
       if !password.match(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(.{6,128})$/)
         errors.add :password, " complexity requirement not met"
       end
    end
  end
end
