import type { Trip } from "../store/types";
import { inMemoryStore } from "../store/inMemoryStore";

function computeChecklistProgress(trip: Trip) {
  const total = trip.checklistItems.length;
  const completed = trip.checklistItems.filter((i) => i.completed).length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { totalCount: total, completedCount: completed, percentPacked: percent };
}

export const tripService = {
  listTrips(status: "upcoming" | "all") {
    return inMemoryStore.listTrips(status);
  },

  getTripDetails(tripId: string) {
    const trip = inMemoryStore.getTrip(tripId);
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

