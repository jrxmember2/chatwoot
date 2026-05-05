import fs from "fs";
import path from "path";
import multer from "multer";
import uploadConfig from "./upload";
import AppError from "../errors/AppError";

const campaignFolder = path.resolve(uploadConfig.directory, "campaigns");

const allowedMimeTypes = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "audio/mpeg",
  "audio/mp3",
  "audio/ogg",
  "audio/wav",
  "audio/webm",
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "text/plain"
];

const sanitizeFileName = (fileName: string): string =>
  fileName.replace(/[^a-zA-Z0-9._-]/g, "_");

export default {
  directory: campaignFolder,

  fileFilter: (
    req: Express.Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ): void => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      cb(new AppError("ERR_INVALID_CAMPAIGN_MEDIA_TYPE", 400));
      return;
    }

    cb(null, true);
  },

  storage: multer.diskStorage({
    destination(req, file, cb) {
      fs.mkdirSync(campaignFolder, { recursive: true });
      return cb(null, campaignFolder);
    },
    filename(req, file, cb) {
      const safeOriginalName = sanitizeFileName(file.originalname);
      const fileName = `${new Date().getTime()}-${safeOriginalName}`;

      return cb(null, fileName);
    }
  })
};
