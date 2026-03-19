"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiV1Router = void 0;
const express_1 = __importDefault(require("express"));
const health_1 = require("./health");
const trips_1 = require("./trips");
const inspirations_1 = require("./inspirations");
const admin_1 = require("./admin");
exports.apiV1Router = express_1.default.Router();
exports.apiV1Router.use("/health", health_1.healthRouter);
exports.apiV1Router.use("/trips", trips_1.tripsRouter);
exports.apiV1Router.use("/", inspirations_1.inspirationsRouter);
exports.apiV1Router.use("/admin", admin_1.adminRouter);
