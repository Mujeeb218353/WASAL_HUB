import { minioClient } from "../configs/minio.config.js";
import { getFileName, parseUploadedFileName } from "../utils/file.name.util.js";
import asyncHandler from "../utils/async.handler.util.js";
import apiResponse from "../utils/api.response.util.js";
import apiError from "../utils/api.error.util.js";
import { MINIO_BUCKET } from "../constant.js";
import fs from "fs";
import { get } from "http";

export const uploadFile = asyncHandler(async (req, res) => {
  const file = req.file;
  const { user } = req;

  if (!file) {
    throw new apiError(400, "No file uploaded");
  }

  let result;

  const fileName = getFileName(file.originalname);

  try {
    result = await minioClient.fPutObject(MINIO_BUCKET, `${fileName}`, file.path, {
      "Content-Type": file.mimetype,
    });
  } finally {
    fs.unlink(file.path, (err) => {
      if (err) console.error("Temp file cleanup failed:", err.message);
    });
  }

  if (!result) {
    fs.unlinkSync(file.path || "");
    throw new apiError(500, "File upload failed");
  }

  res.status(200).json(new apiResponse(200, fileName, "File uploaded successfully"));
});

export const deleteFile = asyncHandler(async (req, res) => {
  const fileName = req.params.fileName;

  if (!fileName) {
    throw new apiError(400, "File name is required");
  }

  await minioClient.statObject(MINIO_BUCKET, `${fileName}`).catch(() => {
    throw new apiError(404, "File not found");
  });

  await minioClient.removeObject(MINIO_BUCKET, `${fileName}`);

  res.status(200).json(new apiResponse(200, null, "File deleted successfully"));
});

export const getPresignedUrl = asyncHandler(async (req, res) => {
  const fileName = req.params.fileName;

  if (!fileName) {
    throw new apiError(400, "File name is required");
  }

  await minioClient.statObject(MINIO_BUCKET, fileName).catch(() => {
    throw new apiError(404, "File not found");
  });

  const presignedUrlExpiration = 5 * 60; // 

  const presignedUrl = await minioClient.presignedGetObject(MINIO_BUCKET, fileName, presignedUrlExpiration);

  res.status(200).json(new apiResponse(200, { downloadUrl: presignedUrl }, "Presigned URL generated successfully"));
});

export const downloadFile = asyncHandler(async (req, res) => {
  const { fileName } = req.params;

  if (!fileName) {
    throw new apiError(400, "File name is required");
  }

  const stat = await minioClient.statObject(MINIO_BUCKET, `${fileName}`).catch(() => {
    throw new apiError(404, "File not found");
  });

  const fileStream = await minioClient.getObject(MINIO_BUCKET, `${fileName}`);

  res.setHeader("Content-Type", stat.metaData?.["content-type"] || "application/octet-stream");
  res.setHeader("Content-Disposition", `attachment; filename="${fileName.split("/").pop()}"`);

  fileStream.pipe(res);

  fileStream.on("error", () => {
    if (!res.headersSent) {
      res.status(500).json(new apiResponse(500, null, "Error downloading file"));
    }
  });
});