import BuildTicketTranscriptService from "./BuildTicketTranscriptService";
import ChatGPTRequestService from "./ChatGPTRequestService";

interface Request {
  ticketId: number;
}

const SummarizeTicketService = async ({
  ticketId
}: Request): Promise<string> => {
  const { ticket, transcript } = await BuildTicketTranscriptService(ticketId);

  const instructions = `
${"Resuma a conversa em portugues do Brasil."}
${"Destaque motivo do contato, contexto principal, pendencias e proximo passo."}
${"Use formato curto em topicos."}
`.trim();

  return ChatGPTRequestService({
    instructions,
    input: transcript,
    queueId: ticket.queueId
  });
};

export default SummarizeTicketService;
