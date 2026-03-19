"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRouter = void 0;
const express_1 = __importDefault(require("express"));
const admin_1 = require("../middleware/admin");
const inMemoryStore_1 = require("../store/inMemoryStore");
exports.adminRouter = express_1.default.Router();
exports.adminRouter.post("/reset-demo-data", admin_1.requireAdmin, (_req, res) => {
    inMemoryStore_1.inMemoryStore.resetDemoData();
    res.json({ ok: true });
});
