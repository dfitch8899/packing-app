"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.weatherService = void 0;
const inMemoryStore_1 = require("../store/inMemoryStore");
exports.weatherService = {
    getSummary(tripId) {
        return inMemoryStore_1.inMemoryStore.getWeatherSummary(tripId);
    },
    getForecast(tripId) {
        return inMemoryStore_1.inMemoryStore.getWeatherForecast(tripId);
    },
    getPackingStrategy(tripId) {
        return inMemoryStore_1.inMemoryStore.getPackingStrategy(tripId);
    },
};
