import { Router } from "express";
import multer from "multer";
import brandingUpload from "../config/brandingUpload";
import isAuth from "../middleware/isAuth";
import * as BrandingController from "../controllers/BrandingController";

const brandingRoutes = Router();
const upload = multer(brandingUpload);

brandingRoutes.get("/branding", BrandingController.show);
brandingRoutes.put("/branding", isAuth, BrandingController.update);
brandingRoutes.post(
  "/branding/upload",
  isAuth,
  upload.fields([
    { name: "loginLogo", maxCount: 1 },
    { name: "internalLogo", maxCount: 1 },
    { name: "favicon", maxCount: 1 }
  ]),
  BrandingController.upload
);

export default brandingRoutes;
