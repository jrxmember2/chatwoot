import { Op } from "sequelize";
import Contact from "../../models/Contact";
import Ticket from "../../models/Ticket";

interface Request {
  contact: Contact;
  whatsappId: number;
  messageDate: Date;
}

const FindOrCreateHistoryTicketService = async ({
  contact,
  whatsappId,
  messageDate
}: Request): Promise<Ticket> => {
  let ticket = await Ticket.findOne({
    where: {
      status: {
        [Op.or]: ["open", "pending"]
      },
      contactId: contact.id,
      whatsappId,
      createdAt: {
        [Op.lte]: messageDate
      }
    },
    order: [["updatedAt", "DESC"]]
  });

  if (!ticket) {
    ticket = await Ticket.findOne({
      where: {
        contactId: contact.id,
        whatsappId,
        createdAt: {
          [Op.lte]: messageDate
        }
      },
      order: [["updatedAt", "DESC"]]
    });
  }

  if (!ticket) {
    ticket = await Ticket.create({
      contactId: contact.id,
      status: "closed",
      unreadMessages: 0,
      whatsappId,
      lastMessage: "",
      createdAt: messageDate,
      updatedAt: messageDate
    });
  }

  return ticket;
};

export default FindOrCreateHistoryTicketService;
