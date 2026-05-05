import { Request, Response } from "express";
import SuggestReplyService from "../services/ChatGPTServices/SuggestReplyService";
import SummarizeTicketService from "../services/ChatGPTServices/SummarizeTicketService";

export const suggestReply = async (
  req: Request,
  res: Response
): Promise<Response> => {
    const ticketId = Number(req.body.ticketId);
    const extraContext =
      typeof req.body.extraContext === "string" ? req.body.extraContext : "";

    const suggestion = await SuggestReplyService({
      ticketId,
      extraContext
    });

    return res.status(200).json({ suggestion });
};

export const summarizeTicket = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const ticketId = Number(req.body.ticketId);
  const summary = await SummarizeTicketService({ ticketId });

  return res.status(200).json({ summary });
};
