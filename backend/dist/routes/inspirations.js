"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inspirationsRouter = void 0;
const express_1 = __importDefault(require("express"));
const inspirationService_1 = require("../services/inspirationService");
const validate_1 = require("../middleware/validate");
const inspirations_1 = require("../schemas/inspirations");
exports.inspirationsRouter = express_1.default.Router();
exports.inspirationsRouter.get("/inspirations", (0, validate_1.validateZod)({
    query: inspirations_1.inspirationsQuerySchema,
}), (req, res) => {
    const destination = req.query.destination;
    const inspirations = inspirationService_1.inspirationService.list(destination);
    res.json({ inspirations });
});
