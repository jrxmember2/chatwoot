import { Router } from "express";
import multer from "multer";
import isAuth from "../middleware/isAuth";
import scheduledMessageUpload from "../config/scheduledMessageUpload";
import * as ScheduledMessageController from "../controllers/ScheduledMessageController";

const scheduledMessageRoutes = Router();
const upload = multer(scheduledMessageUpload);

scheduledMessageRoutes.post(
  "/scheduled-messages",
  isAuth,
  upload.single("file"),
  ScheduledMessageController.store
);

scheduledMessageRoutes.get(
  "/scheduled-messages",
  isAuth,
  ScheduledMessageController.index
);

scheduledMessageRoutes.delete(
  "/scheduled-messages/:id",
  isAuth,
  ScheduledMessageController.remove
);

export default scheduledMessageRoutes;
