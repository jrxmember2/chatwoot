import { Router } from "express";
import multer from "multer";
import isAuth from "../middleware/isAuth";
import campaignUpload from "../config/campaignUpload";
import * as CampaignController from "../controllers/CampaignController";

const campaignRoutes = Router();
const upload = multer(campaignUpload);

campaignRoutes.get("/campaigns", isAuth, CampaignController.index);
campaignRoutes.get("/campaigns/limits", isAuth, CampaignController.limits);
campaignRoutes.get("/campaigns/:campaignId", isAuth, CampaignController.show);
campaignRoutes.post(
  "/campaigns",
  isAuth,
  upload.single("file"),
  CampaignController.store
);
campaignRoutes.delete(
  "/campaigns/:campaignId",
  isAuth,
  CampaignController.remove
);

export default campaignRoutes;
