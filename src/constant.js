import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

export const MINIO_ENDPOINT = process.env.MINIO_ENDPOINT;
export const MINIO_PORT = process.env.MINIO_PORT;
export const MINIO_ACCESS_KEY = process.env.MINIO_ACCESS_KEY;
export const MINIO_SECRET_KEY = process.env.MINIO_SECRET_KEY;
export const MINIO_BUCKET = process.env.MINIO_BUCKET;
export const MINIO_USE_SSL = process.env.MINIO_USE_SSL;

export const PORT = process.env.PORT || 8080;

export const WASAL_BACKEND_BASE_URL = process.env.WASAL_BACKEND_BASE_URL;

export const CORS_ORIGIN = process.env.CORS_ORIGIN;

export const JWT_ACCESS_KEY = process.env.JWT_ACCESS_KEY;