"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inMemoryStore = exports.InMemoryStore = void 0;
const demoData_1 = require("./demoData");
const errorHandler_1 = require("../middleware/errorHandler");
function computeChecklistProgress(trip) {
    const items = trip.checklistItems;
    const total = items.length;
    const completed = items.filter((i) => i.completed).length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { totalCount: total, completedCount: completed, percentPacked: percent };
}
class InMemoryStore {
    data;
    constructor() {
        this.data = (0, demoData_1.createSeedData)();
    }
    resetDemoData() {
        this.data = (0, demoData_1.createSeedData)();
    }
    listTrips(status = "upcoming") {
        // MVP: treat all trips as upcoming.
        // In a real app, this would use startDate relative to "now".
        void status;
        return this.data.trips.map((t) => {
            const progress = computeChecklistProgress(t);
            return {
                id: t.id,
                name: t.name,
                location: t.location,
                startDate: t.startDate,
                endDate: t.endDate,
                progress,
            };
        });
    }
    getTrip(tripId) {
        const trip = this.data.trips.find((t) => t.id === tripId);
        if (!trip)
            throw new errorHandler_1.HttpError(404, `Trip not found: ${tripId}`, "TRIP_NOT_FOUND");
        return trip;
    }
    getTripChecklist(tripId, categoryId) {
        const trip = this.getTrip(tripId);
        const items = categoryId === "all"
            ? trip.checklistItems
            : trip.checklistItems.filter((i) => i.categoryId === categoryId);
        return {
            tripId,
            categories: trip.checklistCategories,
            items,
        };
    }
    addChecklistItem(tripId, input) {
        const trip = this.getTrip(tripId);
        const id = `item_${Math.random().toString(16).slice(2)}_${Date.now()}`;
        const item = {
            id,
            completed: false,
            ...input,
        };
        trip.checklistItems.push(item);
        return item;
    }
    patchChecklistItem(tripId, itemId, patch) {
        const trip = this.getTrip(tripId);
        const item = trip.checklistItems.find((i) => i.id === itemId);
        if (!item)
            throw new errorHandler_1.HttpError(404, `Checklist item not found: ${itemId}`, "ITEM_NOT_FOUND");
        if (typeof patch.completed === "boolean") {
            item.completed = patch.completed;
        }
        return item;
    }
    getWeatherSummary(tripId) {
        const trip = this.getTrip(tripId);
        return {
            tripId,
            ...trip.weather.summary,
        };
    }
    getWeatherForecast(tripId) {
        const trip = this.getTrip(tripId);
        return {
            tripId,
            forecast: trip.weather.forecast,
        };
    }
    getPackingStrategy(tripId) {
        const trip = this.getTrip(tripId);
        return {
            tripId,
            recommended: trip.packingStrategy.recommended,
        };
    }
    getSharedTrip(tripId) {
        const trip = this.getTrip(tripId);
        const participantsReadyCount = trip.participants.filter((p) => p.ready).length;
        return {
            tripId,
            participants: trip.participants,
            participantsReadyCount,
            participantsTotalCount: trip.participants.length,
            commonItems: trip.shared.commonItems,
        };
    }
    // MVP: "send reminders" is a no-op that returns success.
    sendReminders(_tripId, _payload) {
        return { sent: true };
    }
    listInspirations(destination) {
        if (!destination)
            return this.data.inspirations;
        const d = destination.toLowerCase();
        return this.data.inspirations.filter((c) => c.destination.toLowerCase() === d);
    }
}
exports.InMemoryStore = InMemoryStore;
exports.inMemoryStore = new InMemoryStore();
