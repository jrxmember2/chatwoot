import express from "express";
import isAuth from "../middleware/isAuth";

import * as WhatsAppController from "../controllers/WhatsAppController";
import * as WhatsAppHistoryController from "../controllers/WhatsAppHistoryController";

const whatsappRoutes = express.Router();

whatsappRoutes.get("/whatsapp/", isAuth, WhatsAppController.index);

whatsappRoutes.post("/whatsapp/", isAuth, WhatsAppController.store);

whatsappRoutes.get("/whatsapp/:whatsappId", isAuth, WhatsAppController.show);

whatsappRoutes.put("/whatsapp/:whatsappId", isAuth, WhatsAppController.update);

whatsappRoutes.post(
  "/whatsapp/:whatsappId/import-old-messages",
  isAuth,
  WhatsAppHistoryController.start
);

whatsappRoutes.get(
  "/whatsapp/:whatsappId/import-old-messages/status",
  isAuth,
  WhatsAppHistoryController.status
);

whatsappRoutes.delete(
  "/whatsapp/:whatsappId",
  isAuth,
  WhatsAppController.remove
);

export default whatsappRoutes;
