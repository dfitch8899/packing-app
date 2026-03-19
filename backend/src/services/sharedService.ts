import { inMemoryStore } from "../store/inMemoryStore";

export const sharedService = {
  getSharedOverview(tripId: string) {
    return inMemoryStore.getSharedTrip(tripId);
  },
  sendReminders(tripId: string, payload: { channel?: string; note?: string }) {
    return inMemoryStore.sendReminders(tripId, payload);
  },
};

