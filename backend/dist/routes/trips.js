"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tripsRouter = void 0;
const express_1 = __importDefault(require("express"));
const checklistService_1 = require("../services/checklistService");
const sharedService_1 = require("../services/sharedService");
const tripService_1 = require("../services/tripService");
const weatherService_1 = require("../services/weatherService");
const validate_1 = require("../middleware/validate");
const trips_1 = require("../schemas/trips");
exports.tripsRouter = express_1.default.Router();
exports.tripsRouter.get("/", (0, validate_1.validateZod)({
    query: trips_1.listTripsQuerySchema,
}), (req, res) => {
    const status = req.query.status;
    const trips = tripService_1.tripService.listTrips(status);
    res.json({ trips });
});
exports.tripsRouter.get("/:tripId", (req, res) => {
    const tripId = req.params.tripId;
    const trip = tripService_1.tripService.getTripDetails(tripId);
    res.json({ trip });
});
exports.tripsRouter.get("/:tripId/checklist", (0, validate_1.validateZod)({
    query: trips_1.checklistQuerySchema,
}), (req, res) => {
    const tripId = req.params.tripId;
    const category = req.query.category;
    const checklist = checklistService_1.checklistService.getChecklist(tripId, category);
    res.json({ checklist });
});
exports.tripsRouter.post("/:tripId/checklist/items", (0, validate_1.validateZod)({
    body: trips_1.addChecklistItemBodySchema,
}), (req, res) => {
    const tripId = req.params.tripId;
    const { text, categoryId, quantity } = req.body;
    const item = checklistService_1.checklistService.addCustomItem(tripId, { text, categoryId, quantity });
    res.status(201).json({ item });
});
exports.tripsRouter.patch("/:tripId/checklist/items/:itemId", (0, validate_1.validateZod)({
    body: trips_1.setChecklistItemCompletedBodySchema,
}), (req, res) => {
    const tripId = req.params.tripId;
    const itemId = req.params.itemId;
    const { completed } = req.body;
    const item = checklistService_1.checklistService.setItemCompleted(tripId, itemId, completed);
    res.json({ item });
});
exports.tripsRouter.get("/:tripId/weather/summary", (req, res) => {
    const tripId = req.params.tripId;
    const summary = weatherService_1.weatherService.getSummary(tripId);
    res.json({ summary });
});
exports.tripsRouter.get("/:tripId/weather/forecast", (req, res) => {
    const tripId = req.params.tripId;
    const forecast = weatherService_1.weatherService.getForecast(tripId);
    res.json({ forecast });
});
exports.tripsRouter.get("/:tripId/packing-strategy", (req, res) => {
    const tripId = req.params.tripId;
    const strategy = weatherService_1.weatherService.getPackingStrategy(tripId);
    res.json({ strategy });
});
exports.tripsRouter.get("/:tripId/shared", (req, res) => {
    const tripId = req.params.tripId;
    const shared = sharedService_1.sharedService.getSharedOverview(tripId);
    res.json({ shared });
});
exports.tripsRouter.post("/:tripId/reminders", (0, validate_1.validateZod)({
    body: trips_1.remindersBodySchema.optional(),
}), (req, res) => {
    const tripId = req.params.tripId;
    const payload = req.body;
    const result = sharedService_1.sharedService.sendReminders(tripId, payload ?? {});
    res.json({ result });
});
