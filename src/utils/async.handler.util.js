import fs from "fs";

const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    console.error(error);

    if (req.file?.path || req.files?.[0]?.path) {
      fs.unlinkSync(req.file?.path || req.files?.[0]?.path || "");
    }

    const statusCode = error instanceof Error && error.statusCode ? error.statusCode : 500;
    res.status(statusCode).json({ statusCode: statusCode, success: false, message: error.message });
  }
}

export default asyncHandler;