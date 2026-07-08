import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import path from "path";
import { CORS_ORIGIN } from "./constant.js";
import fileRoutes from "./routes/file.routes.js";

const app = express();


const corsOptions = {
  origin: [ CORS_ORIGIN, "http://localhost:3000", "http://localhost:5173", "http://localhost:5174" ],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());
app.use(express.static(path.join(process.cwd(), 'public')));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_, res) => {
  res.send("App is healthy");
});

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.use("/api/v1/files", fileRoutes);

app.use((req, res, next) => {
  res.status(404).json({ statusCode: 404, success: false, message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  const statusCode = err instanceof Error && err.statusCode ? err.statusCode : 500;
  res.status(statusCode).json({ statusCode: statusCode, success: false, message: err.message });
});

export default app;