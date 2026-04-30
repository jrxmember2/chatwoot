import fs from "fs";
import path from "path";
import { Request, Response } from "express";
import AppError from "../errors/AppError";
import BrandingSetting from "../models/BrandingSetting";
import brandingUpload from "../config/brandingUpload";
import uploadConfig from "../config/upload";

const defaultBrandingValues = {
  systemName: "WhaTicket",
  pageTitle: "WhaTicket",
  primaryColor: "#2576d2",
  secondaryColor: "#f50057",
  loginFooterText: null,
  showLoginLogo: true,
  showInternalLogo: true
};

const allowedFields = {
  loginLogo: "loginLogoUrl",
  internalLogo: "internalLogoUrl",
  favicon: "faviconUrl"
} as const;

type BrandingAssetField = typeof allowedFields[keyof typeof allowedFields];

const isValidHexColor = (value: string): boolean =>
  /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value);

const normalizeOptionalText = (value: unknown): string | null => {
  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();
  return trimmedValue ? trimmedValue : null;
};

const normalizeMandatoryText = (
  value: unknown,
  fallbackValue: string
): string => {
  if (typeof value !== "string") {
    return fallbackValue;
  }

  const trimmedValue = value.trim();
  return trimmedValue || fallbackValue;
};

const ensureAdmin = (req: Request): void => {
  if (!req.user || req.user.profile !== "admin") {
    throw new AppError("ERR_NO_PERMISSION", 403);
  }
};

const getOrCreateBrandingSetting = async (): Promise<BrandingSetting> => {
  let brandingSetting = await BrandingSetting.findOne({
    order: [["id", "ASC"]]
  });

  if (!brandingSetting) {
    brandingSetting = await BrandingSetting.create(defaultBrandingValues);
  }

  return brandingSetting;
};

const removeStoredBrandingFile = (relativePath: string | null): void => {
  if (!relativePath) {
    return;
  }

  const absoluteFilePath = path.resolve(uploadConfig.directory, relativePath);
  const brandingRootPath = `${brandingUpload.directory}${path.sep}`;

  if (
    absoluteFilePath.startsWith(brandingRootPath) &&
    fs.existsSync(absoluteFilePath)
  ) {
    fs.unlinkSync(absoluteFilePath);
  }
};

export const show = async (req: Request, res: Response): Promise<Response> => {
  const brandingSetting = await getOrCreateBrandingSetting();

  return res.status(200).json(brandingSetting);
};

export const update = async (
  req: Request,
  res: Response
): Promise<Response> => {
  ensureAdmin(req);

  const brandingSetting = await getOrCreateBrandingSetting();
  const updatePayload: Partial<BrandingSetting> = {};

  if (req.body.systemName !== undefined) {
    updatePayload.systemName = normalizeMandatoryText(
      req.body.systemName,
      defaultBrandingValues.systemName
    );
  }

  if (req.body.pageTitle !== undefined) {
    updatePayload.pageTitle = normalizeMandatoryText(
      req.body.pageTitle,
      defaultBrandingValues.pageTitle
    );
  }

  if (req.body.primaryColor !== undefined) {
    if (!isValidHexColor(req.body.primaryColor)) {
      throw new AppError("ERR_BRANDING_INVALID_COLOR", 400);
    }

    updatePayload.primaryColor = req.body.primaryColor;
  }

  if (req.body.secondaryColor !== undefined) {
    if (!isValidHexColor(req.body.secondaryColor)) {
      throw new AppError("ERR_BRANDING_INVALID_COLOR", 400);
    }

    updatePayload.secondaryColor = req.body.secondaryColor;
  }

  if (req.body.loginFooterText !== undefined) {
    updatePayload.loginFooterText = normalizeOptionalText(
      req.body.loginFooterText
    );
  }

  if (req.body.showLoginLogo !== undefined) {
    updatePayload.showLoginLogo =
      req.body.showLoginLogo === true || req.body.showLoginLogo === "true";
  }

  if (req.body.showInternalLogo !== undefined) {
    updatePayload.showInternalLogo =
      req.body.showInternalLogo === true || req.body.showInternalLogo === "true";
  }

  await brandingSetting.update(updatePayload);

  return res.status(200).json(brandingSetting);
};

export const upload = async (
  req: Request,
  res: Response
): Promise<Response> => {
  ensureAdmin(req);

  const files = req.files as
    | {
        [key: string]: Express.Multer.File[];
      }
    | undefined;

  if (!files || Object.keys(files).length === 0) {
    throw new AppError("ERR_NO_BRANDING_FILE_SENT", 400);
  }

  const brandingSetting = await getOrCreateBrandingSetting();
  const updatePayload: Partial<Record<BrandingAssetField, string>> = {};

  (Object.keys(allowedFields) as Array<keyof typeof allowedFields>).forEach(
    fieldName => {
      const fieldFiles = files[fieldName];

      if (!fieldFiles || fieldFiles.length === 0) {
        return;
      }

      const file = fieldFiles[0];
      const dataField = allowedFields[fieldName];
      const previousFile = brandingSetting.getDataValue(dataField) as
        | string
        | null;

      removeStoredBrandingFile(previousFile);

      updatePayload[dataField] = path.posix.join("branding", file.filename);
    }
  );

  await brandingSetting.update(updatePayload);

  return res.status(200).json(brandingSetting);
};
