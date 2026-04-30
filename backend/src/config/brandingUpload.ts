import fs from "fs";
import path from "path";
import multer from "multer";
import uploadConfig from "./upload";
import AppError from "../errors/AppError";

const brandingFolder = path.resolve(uploadConfig.directory, "branding");

const allowedMimeTypes = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/x-icon",
  "image/vnd.microsoft.icon"
];

const sanitizeFileName = (fileName: string): string =>
  fileName.replace(/[^a-zA-Z0-9._-]/g, "_");

export default {
  directory: brandingFolder,

  fileFilter: (
    req: Express.Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ): void => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      cb(new AppError("ERR_INVALID_BRANDING_MEDIA_TYPE", 400));
      return;
    }

    cb(null, true);
  },

  storage: multer.diskStorage({
    destination(req, file, cb) {
      fs.mkdirSync(brandingFolder, { recursive: true });
      return cb(null, brandingFolder);
    },
    filename(req, file, cb) {
      const safeOriginalName = sanitizeFileName(file.originalname);
      const fileName = `${new Date().getTime()}-${safeOriginalName}`;

      return cb(null, fileName);
    }
  })
};
