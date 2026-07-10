import path from "path";
import apiError from "./api.error.util.js";
import fs from 'fs'

export const sanitizeFileName = (name) => {
  const sanitized = name.normalize("NFKD").replace(/\s+/g, "_").replace(/[^\w.-]/g, "_").replace(/_{2,}/g, "_").toLowerCase();
  return sanitized;
};

export const getFileName = (originalName) => {
  if (!originalName) throw new apiError(400, "originalName is required");

  const ext = path.extname(originalName);
  const baseName = path.basename(originalName, ext);
  const safeName = sanitizeFileName(baseName);
  const uniqueId = Date.now();

  return `${safeName}-${uniqueId}${ext.toLowerCase()}`;
};

export const parseUploadedFileName = (file) => {
  const name = file.originalname;

  const firstUnderscore = name.indexOf("_");
  const secondUnderscore = name.indexOf("_", firstUnderscore + 1);
  const thirdUnderscore = name.indexOf("_", secondUnderscore + 1);
  const fourthUnderscore = name.indexOf("_", thirdUnderscore + 1);

  if (firstUnderscore === -1 || secondUnderscore === -1 || thirdUnderscore === -1 || fourthUnderscore === -1) {
    fs.unlinkSync(file.path || "");
    throw new apiError(400, `Invalid file name format: "${name}"`);
  }

  const userId = name.slice(0, firstUnderscore);
  const section = name.slice(firstUnderscore + 1, secondUnderscore);
  const type = name.slice(secondUnderscore + 1, thirdUnderscore);
  const identifier = name.slice(thirdUnderscore + 1, fourthUnderscore);
  const originalFileName = file.originalname.slice(fourthUnderscore + 1);

  if (!userId || !section || !type || !identifier || !originalFileName) {
    fs.unlinkSync(file.path || "");
    throw new apiError(400, `Invalid file name format: "${name}"`);
  }

  if (type !== "static" && type !== "dynamic") {
    fs.unlinkSync(file.path || "");
    throw new apiError(400, `Invalid field type in file name: "${type}"`);
  }

  const isDynamic = type === "dynamic";

  return {
    userId,
    section,
    isDynamic,
    fieldId: isDynamic ? identifier : null,
    fieldName: !isDynamic ? identifier : null,
    originalFileName,
  };
};