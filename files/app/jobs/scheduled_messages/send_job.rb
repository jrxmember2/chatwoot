module ScheduledMessages
  class SendJob < ApplicationJob
    queue_as :high

    def perform(scheduled_message_id)
      scheduled_message = ScheduledMessage.find(scheduled_message_id)
      return unless scheduled_message.pending?

      if scheduled_message.scheduled_at.future?
        scheduled_message.enqueue_delivery!
        return
      end

      scheduled_message.sending!
      set_current_context(scheduled_message)

      message = Messages::MessageBuilder.new(
        scheduled_message.sender,
        scheduled_message.conversation,
        ActionController::Parameters.new(scheduled_message.message_params)
      ).perform

      scheduled_message.update!(
        status: :sent,
        sent_message: message,
        sent_at: Time.current,
        error_message: nil
      )
    rescue StandardError => e
      scheduled_message&.update!(status: :failed, error_message: e.message)
      raise e
    ensure
      Current.reset if defined?(Current)
    end

    private

    def set_current_context(scheduled_message)
      return unless defined?(Current)

      Current.account = scheduled_message.account if Current.respond_to?(:account=)
      Current.user = scheduled_message.sender if Current.respond_to?(:user=)
      Current.executed_by = scheduled_message.sender if Current.respond_to?(:executed_by=)
    end
  end
end
