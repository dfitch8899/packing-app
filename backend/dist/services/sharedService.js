"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sharedService = void 0;
const inMemoryStore_1 = require("../store/inMemoryStore");
exports.sharedService = {
    getSharedOverview(tripId) {
        return inMemoryStore_1.inMemoryStore.getSharedTrip(tripId);
    },
    sendReminders(tripId, payload) {
        return inMemoryStore_1.inMemoryStore.sendReminders(tripId, payload);
    },
};
