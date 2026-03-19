"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inspirationsQuerySchema = void 0;
const zod_1 = require("zod");
exports.inspirationsQuerySchema = zod_1.z.object({
    destination: zod_1.z.string().min(1).optional(),
});
