import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { env } from "./config/env";
import { authRoutes, bankSettingsRoutes, complaintsRoutes } from "./routes";
import { startEscalationJob } from "./jobs/escalation.job";

const app = express();

app.use(
  cors({
    origin: env.corsOrigin,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", authRoutes);
app.use("/api", bankSettingsRoutes);
app.use("/api", complaintsRoutes);

app.listen(env.port, () => {
  console.log(`Server listening on port ${env.port}`);
  startEscalationJob();
});