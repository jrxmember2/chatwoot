import fs from "fs";
import path from "path";
import multer from "multer";
import uploadConfig from "./upload";

const scheduledMessagesFolder = path.resolve(
  uploadConfig.directory,
  "scheduled-messages"
);

const sanitizeFileName = (fileName: string): string =>
  fileName.replace(/[^a-zA-Z0-9._-]/g, "_");

export default {
  directory: scheduledMessagesFolder,

  storage: multer.diskStorage({
    destination(req, file, cb) {
      fs.mkdirSync(scheduledMessagesFolder, { recursive: true });
      return cb(null, scheduledMessagesFolder);
    },
    filename(req, file, cb) {
      const safeOriginalName = sanitizeFileName(file.originalname);
      const fileName = `${new Date().getTime()}-${safeOriginalName}`;

      return cb(null, fileName);
    }
  })
};
