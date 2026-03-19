import { z } from "zod";

export const listTripsQuerySchema = z.object({
  status: z.enum(["upcoming", "all"]).optional().default("upcoming"),
});

export const checklistQuerySchema = z.object({
  category: z.string().min(1).optional().default("all"),
});

export const addChecklistItemBodySchema = z.object({
  text: z.string().min(1),
  categoryId: z.string().min(1),
  quantity: z.coerce.number().int().min(1).default(1),
});

export const setChecklistItemCompletedBodySchema = z.object({
  completed: z.boolean(),
});

export const remindersBodySchema = z.object({
  channel: z.string().min(1).optional(),
  note: z.string().min(1).optional(),
});

