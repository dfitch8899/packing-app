"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remindersBodySchema = exports.setChecklistItemCompletedBodySchema = exports.addChecklistItemBodySchema = exports.checklistQuerySchema = exports.listTripsQuerySchema = void 0;
const zod_1 = require("zod");
exports.listTripsQuerySchema = zod_1.z.object({
    status: zod_1.z.enum(["upcoming", "all"]).optional().default("upcoming"),
});
exports.checklistQuerySchema = zod_1.z.object({
    category: zod_1.z.string().min(1).optional().default("all"),
});
exports.addChecklistItemBodySchema = zod_1.z.object({
    text: zod_1.z.string().min(1),
    categoryId: zod_1.z.string().min(1),
    quantity: zod_1.z.coerce.number().int().min(1).default(1),
});
exports.setChecklistItemCompletedBodySchema = zod_1.z.object({
    completed: zod_1.z.boolean(),
});
exports.remindersBodySchema = zod_1.z.object({
    channel: zod_1.z.string().min(1).optional(),
    note: zod_1.z.string().min(1).optional(),
});
