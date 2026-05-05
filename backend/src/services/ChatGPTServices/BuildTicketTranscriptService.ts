import Message from "../../models/Message";
import ShowTicketService from "../TicketServices/ShowTicketService";

const BuildTicketTranscriptService = async (
  ticketId: number
): Promise<{
  transcript: string;
  ticket: Awaited<ReturnType<typeof ShowTicketService>>;
}> => {
  const ticket = await ShowTicketService(ticketId);
  const messages = await Message.findAll({
    where: { ticketId },
    order: [["createdAt", "ASC"]],
    include: ["contact"]
  });

  const transcript = messages
    .map(message => {
      const speaker = message.fromMe
        ? ticket.user?.name || "Atendente"
        : message.contact?.name || ticket.contact?.name || "Contato";

      return `${speaker}: ${message.body || "[mensagem sem texto]"}`;
    })
    .join("\n");

  return {
    transcript,
    ticket
  };
};

export default BuildTicketTranscriptService;
