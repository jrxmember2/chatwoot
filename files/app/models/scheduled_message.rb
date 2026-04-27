class ScheduledMessage < ApplicationRecord
  belongs_to :account
  belongs_to :inbox
  belongs_to :conversation
  belongs_to :sender, class_name: 'User'
  belongs_to :sent_message, class_name: 'Message', optional: true

  enum status: { pending: 0, sending: 1, sent: 2, failed: 3, cancelled: 4 }

  validates :scheduled_at, presence: true
  validates :message_params, presence: true
  validate :scheduled_at_must_be_future, on: :create

  scope :due, -> { pending.where('scheduled_at <= ?', Time.current) }

  def enqueue_delivery!
    ScheduledMessages::SendJob.set(wait_until: scheduled_at).perform_later(id)
  end

  private

  def scheduled_at_must_be_future
    return if scheduled_at.blank?
    return if scheduled_at.future?

    errors.add(:scheduled_at, 'deve ser uma data e hora futura')
  end
end
