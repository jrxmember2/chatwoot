import { Router } from "express";
import isAuth from "../middleware/isAuth";
import * as ChatGPTController from "../controllers/ChatGPTController";

const chatgptRoutes = Router();

chatgptRoutes.post(
  "/chatgpt/suggest-reply",
  isAuth,
  ChatGPTController.suggestReply
);
chatgptRoutes.post(
  "/chatgpt/summarize-ticket",
  isAuth,
  ChatGPTController.summarizeTicket
);

export default chatgptRoutes;
