import path from "path";
import { Request, Response } from "express";
import AppError from "../errors/AppError";
import ScheduledMessage from "../models/ScheduledMessage";
import Contact from "../models/Contact";
import Ticket from "../models/Ticket";
import User from "../models/User";
import Whatsapp from "../models/Whatsapp";

type IndexQuery = {
  ticketId?: string;
};

const parseBoolean = (value: string | boolean | undefined): boolean =>
  value === true || value === "true";

export const store = async (req: Request, res: Response): Promise<Response> => {
  const ticketId = Number(req.body.ticketId);
  const fallbackContactId = Number(req.body.contactId);
  const selectedWhatsappId = Number(req.body.whatsappId);
  const body = req.body.body?.trim();
  const scheduledAtValue = req.body.scheduledAt;
  const signMessage = parseBoolean(req.body.signMessage);
  const file = req.file as Express.Multer.File | undefined;
  const userId = Number(req.user.id);

  if (!body && !file) {
    throw new AppError("ERR_SCHEDULED_MESSAGE_EMPTY", 400);
  }

  if (!scheduledAtValue) {
    throw new AppError("ERR_SCHEDULED_MESSAGE_DATE_REQUIRED", 400);
  }

  const scheduledAt = new Date(scheduledAtValue);

  if (Number.isNaN(ticketId)) {
    throw new AppError("ERR_SCHEDULED_MESSAGE_INVALID_TICKET_RELATION", 400);
  }

  if (Number.isNaN(scheduledAt.getTime())) {
    throw new AppError("ERR_SCHEDULED_MESSAGE_INVALID_DATE", 400);
  }

  if (scheduledAt.getTime() <= Date.now()) {
    throw new AppError("ERR_SCHEDULED_MESSAGE_PAST_DATE", 400);
  }

  const ticket = await Ticket.findByPk(ticketId);

  if (!ticket) {
    throw new AppError("ERR_NO_TICKET_FOUND", 404);
  }

  const contactId = ticket.contactId || fallbackContactId;
  const whatsappId =
    (!Number.isNaN(selectedWhatsappId) && selectedWhatsappId) ||
    ticket.whatsappId;

  if (!contactId) {
    throw new AppError("ERR_SCHEDULED_MESSAGE_INVALID_TICKET_RELATION", 400);
  }

  if (!whatsappId) {
    throw new AppError("ERR_TICKET_NO_WHATSAPP", 400);
  }

  const whatsapp = await Whatsapp.findByPk(whatsappId);

  if (!whatsapp) {
    throw new AppError("ERR_NO_WAPP_FOUND", 404);
  }

  const scheduledMessage = await ScheduledMessage.create({
    ticketId,
    contactId,
    whatsappId,
    userId,
    body: body || null,
    mediaUrl: file ? path.posix.join("scheduled-messages", file.filename) : null,
    mediaName: file?.originalname || null,
    mediaType: file?.mimetype || null,
    scheduledAt,
    signMessage
  });

  const createdScheduledMessage = await ScheduledMessage.findByPk(scheduledMessage.id, {
    include: [
      {
        model: Contact,
        as: "contact",
        attributes: ["id", "name", "number"]
      },
      {
        model: User,
        as: "user",
        attributes: ["id", "name"]
      },
      {
        model: Ticket,
        as: "ticket",
        attributes: ["id", "contactId", "whatsappId"]
      }
    ]
  });

  return res.status(201).json(createdScheduledMessage);
};

export const index = async (req: Request, res: Response): Promise<Response> => {
  const { ticketId } = req.query as IndexQuery;
  const parsedTicketId = Number(ticketId);
  const include = [
    {
      model: Contact,
      as: "contact",
      attributes: ["id", "name", "number"]
    },
    {
      model: User,
      as: "user",
      attributes: ["id", "name"]
    },
    {
      model: Ticket,
      as: "ticket",
      attributes: ["id", "contactId", "whatsappId"]
    }
  ];

  const order: Array<[string, string]> = [
    ["scheduledAt", "ASC"],
    ["id", "DESC"]
  ];

  const scheduledMessages =
    ticketId && !Number.isNaN(parsedTicketId)
      ? await ScheduledMessage.findAll({
          where: { ticketId: parsedTicketId },
          include,
          order
        })
      : await ScheduledMessage.findAll({
          include,
          order
        });

  return res.status(200).json(scheduledMessages);
};

export const remove = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;

  const scheduledMessage = await ScheduledMessage.findByPk(id);

  if (!scheduledMessage) {
    throw new AppError("ERR_NO_SCHEDULED_MESSAGE_FOUND", 404);
  }

  if (scheduledMessage.status !== "pending") {
    throw new AppError("ERR_SCHEDULED_MESSAGE_CANCEL_NOT_ALLOWED", 400);
  }

  await scheduledMessage.update({
    status: "canceled",
    error: null
  });

  return res.status(200).json(scheduledMessage);
};
