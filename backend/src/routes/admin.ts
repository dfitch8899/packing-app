import express from "express";

import { requireAdmin } from "../middleware/admin";
import { inMemoryStore } from "../store/inMemoryStore";

export const adminRouter = express.Router();

adminRouter.post("/reset-demo-data", requireAdmin, (_req, res) => {
  inMemoryStore.resetDemoData();
  res.json({ ok: true });
});

