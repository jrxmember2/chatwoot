import BuildTicketTranscriptService from "./BuildTicketTranscriptService";
import ChatGPTRequestService from "./ChatGPTRequestService";

interface Request {
  ticketId: number;
  extraContext?: string;
}

const SuggestReplyService = async ({
  ticketId,
  extraContext
}: Request): Promise<string> => {
  const { ticket, transcript } = await BuildTicketTranscriptService(ticketId);

  const instructions = `
${"Você é um assistente de atendimento."}
${"Gere uma sugestao curta, educada e objetiva em portugues do Brasil."}
${"Use o contexto da conversa e nao invente informacoes."}
${"Responda apenas com o texto sugerido, sem explicacoes extras."}
${extraContext ? `\nContexto adicional do atendente: ${extraContext}` : ""}
`.trim();

  return ChatGPTRequestService({
    instructions,
    input: transcript,
    queueId: ticket.queueId
  });
};

export default SuggestReplyService;
