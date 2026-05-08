import { Router } from "express";
import isAuth from "../middleware/isAuth";
import * as EvolutionController from "../controllers/EvolutionController";
import * as EvolutionWebhookController from "../controllers/EvolutionWebhookController";

const evolutionRoutes = Router();

evolutionRoutes.post(
  "/evolution/webhook/:whatsappId/:token",
  EvolutionWebhookController.receive
);

evolutionRoutes.post(
  "/evolution/webhook/:whatsappId/:token/:event",
  EvolutionWebhookController.receive
);

evolutionRoutes.post(
  "/evolution/webhook/:whatsappId/:token/messages-upsert",
  EvolutionWebhookController.messagesUpsert
);

evolutionRoutes.post(
  "/evolution/webhook/:whatsappId/:token/connection-update",
  EvolutionWebhookController.connectionUpdate
);

evolutionRoutes.post("/evolution/test", isAuth, EvolutionController.test);

export default evolutionRoutes;
