import app from "./app.js";
import http from "http";
import { PORT } from "./constant.js";
import { ensureBucket } from "./configs/minio.config.js";

const server = http.createServer(app);

server.listen(PORT, async () => {
  await ensureBucket();
  console.log(`🚀 Server started on port http://localhost:${PORT}`);
});