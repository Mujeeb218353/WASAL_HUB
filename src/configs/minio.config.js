import { Client } from "minio";
import {
  MINIO_ENDPOINT,
  MINIO_PORT,
  MINIO_USE_SSL,
  MINIO_ACCESS_KEY,
  MINIO_SECRET_KEY,
  MINIO_BUCKET,
} from "../constant.js";

export const minioClient = new Client({
  endPoint: MINIO_ENDPOINT,
  port: Number(MINIO_PORT),
  useSSL: MINIO_USE_SSL === "true",
  accessKey: MINIO_ACCESS_KEY,
  secretKey: MINIO_SECRET_KEY,
});

export const BUCKET_NAME = MINIO_BUCKET;

export const ensureBucket = async () => {
  try {
    const exists = await minioClient.bucketExists(BUCKET_NAME);
    if (!exists) {
      await minioClient.makeBucket(BUCKET_NAME, "us-east-1");
      console.log(`✅ Bucket "${BUCKET_NAME}" created`);
    } else {
      console.log(`✅ Bucket "${BUCKET_NAME}" already exists`);
    }
  } catch (err) {
    console.error("❌ MinIO bucket check failed:", err.message);
    throw err;
  }
};