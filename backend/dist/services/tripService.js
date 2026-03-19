"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tripService = void 0;
const inMemoryStore_1 = require("../store/inMemoryStore");
function computeChecklistProgress(trip) {
    const total = trip.checklistItems.length;
    const completed = trip.checklistItems.filter((i) => i.completed).length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { totalCount: total, completedCount: completed, percentPacked: percent };
}
exports.tripService = {
    listTrips(status) {
        return inMemoryStore_1.inMemoryStore.listTrips(status);
    },
    getTripDetails(tripId) {
        const trip = inMemoryStore_1.inMemoryStore.getTrip(tripId);
        const progress = computeChecklistProgress(trip);
        const participantsReadyCount = trip.participants.filter((p) => p.ready).length;
        return {
            id: trip.id,
            name: trip.name,
            location: trip.location,
            startDate: trip.startDate,
            endDate: trip.endDate,
            progress,
            participantsReadyCount,
            participantsTotalCount: trip.participants.length,
        };
    },
};
