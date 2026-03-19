import express from "express";

import { inspirationService } from "../services/inspirationService";
import { validateZod } from "../middleware/validate";
import { inspirationsQuerySchema } from "../schemas/inspirations";

export const inspirationsRouter = express.Router();

inspirationsRouter.get(
  "/inspirations",
  validateZod({
    query: inspirationsQuerySchema,
  }),
  (req, res) => {
    const destination = req.query.destination as string | undefined;
  const inspirations = inspirationService.list(destination);
  res.json({ inspirations });
  }
);

