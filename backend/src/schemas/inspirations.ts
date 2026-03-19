import { z } from "zod";

export const inspirationsQuerySchema = z.object({
  destination: z.string().min(1).optional(),
});

