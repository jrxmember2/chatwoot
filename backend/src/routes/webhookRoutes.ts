import { Router } from "express";
import isAuth from "../middleware/isAuth";
import * as WebhookController from "../controllers/WebhookController";

const webhookRoutes = Router();

webhookRoutes.get("/webhooks", isAuth, WebhookController.index);
webhookRoutes.post("/webhooks", isAuth, WebhookController.store);
webhookRoutes.put("/webhooks/:webhookId", isAuth, WebhookController.update);
webhookRoutes.delete(
  "/webhooks/:webhookId",
  isAuth,
  WebhookController.remove
);
webhookRoutes.post("/webhooks/:webhookId/test", isAuth, WebhookController.test);
webhookRoutes.get("/webhooks/:webhookId/logs", isAuth, WebhookController.logs);

export default webhookRoutes;
