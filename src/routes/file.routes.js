import verifyUserJWT from "../middlewares/auth.middleware.js";
import { Router } from "express";
import { uploadFile, deleteFile, getPresignedUrl, downloadFile } from "../controllers/file.controller.js";
import upload from "../middlewares/multer.middleware.js";

const router = Router();

router.use(verifyUserJWT);

router.post("/", upload.single("file"), uploadFile);
router.delete("/:fileName", deleteFile);
router.get("/presigned-url/:fileName", getPresignedUrl);
router.get("/download/:fileName", downloadFile);

export default router;