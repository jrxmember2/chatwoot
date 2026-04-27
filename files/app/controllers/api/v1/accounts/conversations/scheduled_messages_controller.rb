class Api::V1::Accounts::Conversations::ScheduledMessagesController < Api::V1::Accounts::Conversations::BaseController
  def index
    scheduled_messages = ScheduledMessage.where(conversation: @conversation).pending.order(:scheduled_at)
    render json: { payload: scheduled_messages.as_json(only: %i[id content scheduled_at status created_at]) }
  end

  def create
    validate_schedule_payload!

    scheduled_message = ScheduledMessage.create!(
      account: Current.account,
      inbox: @conversation.inbox,
      conversation: @conversation,
      sender: Current.user,
      content: permitted_message_params[:content],
      scheduled_at: parsed_scheduled_at,
      message_params: message_payload
    )

    scheduled_message.enqueue_delivery!

    render json: { payload: scheduled_message.as_json(only: %i[id content scheduled_at status created_at]) }, status: :created
  rescue StandardError => e
    render_could_not_create_error(e.message)
  end

  def destroy
    scheduled_message = ScheduledMessage.where(conversation: @conversation).pending.find(params[:id])
    scheduled_message.cancelled!
    head :ok
  end

  private

  def validate_schedule_payload!
    raise StandardError, 'Não foi possível identificar o usuário atual.' if Current.user.blank?
    raise StandardError, 'Informe a data e hora do agendamento.' if parsed_scheduled_at.blank?
    raise StandardError, 'A data e hora do agendamento deve ser futura.' unless parsed_scheduled_at.future?
    raise StandardError, 'Informe o conteúdo da mensagem.' if permitted_message_params[:content].blank?
    raise StandardError, 'O agendamento aceita apenas mensagens de texto por enquanto.' if params[:attachments].present?
  end

  def parsed_scheduled_at
    @parsed_scheduled_at ||= Time.zone.parse(params[:scheduled_at].to_s)
  rescue ArgumentError, TypeError
    nil
  end

  def message_payload
    permitted_message_params.to_h.compact
  end

  def permitted_message_params
    params.permit(:content, :private, :content_type, :cc_emails, :bcc_emails, :to_emails, :scheduled_at, content_attributes: {}, template_params: {})
          .except(:scheduled_at)
  end
end
