import type { ChecklistItem, StoreData, Trip } from "./types";
import { createSeedData } from "./demoData";
import { HttpError } from "../middleware/errorHandler";

function computeChecklistProgress(trip: Trip) {
  const items = trip.checklistItems;
  const total = items.length;
  const completed = items.filter((i) => i.completed).length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { totalCount: total, completedCount: completed, percentPacked: percent };
}

export class InMemoryStore {
  private data: StoreData;

  constructor() {
    this.data = createSeedData();
  }

  resetDemoData() {
    this.data = createSeedData();
  }

  listTrips(status: "upcoming" | "all" = "upcoming") {
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

  getTrip(tripId: string) {
    const trip = this.data.trips.find((t) => t.id === tripId);
    if (!trip) throw new HttpError(404, `Trip not found: ${tripId}`, "TRIP_NOT_FOUND");
    return trip;
  }

  getTripChecklist(tripId: string, categoryId: string | "all") {
    const trip = this.getTrip(tripId);
    const items =
      categoryId === "all"
        ? trip.checklistItems
        : trip.checklistItems.filter((i) => i.categoryId === categoryId);

    return {
      tripId,
      categories: trip.checklistCategories,
      items,
    };
  }

  addChecklistItem(
    tripId: string,
    input: Omit<ChecklistItem, "id" | "completed">
  ) {
    const trip = this.getTrip(tripId);

    const id = `item_${Math.random().toString(16).slice(2)}_${Date.now()}`;
    const item: ChecklistItem = {
      id,
      completed: false,
      ...input,
    };
    trip.checklistItems.push(item);
    return item;
  }

  patchChecklistItem(tripId: string, itemId: string, patch: Partial<Pick<ChecklistItem, "completed">>) {
    const trip = this.getTrip(tripId);
    const item = trip.checklistItems.find((i) => i.id === itemId);
    if (!item) throw new HttpError(404, `Checklist item not found: ${itemId}`, "ITEM_NOT_FOUND");

    if (typeof patch.completed === "boolean") {
      item.completed = patch.completed;
    }

    return item;
  }

  getWeatherSummary(tripId: string) {
    const trip = this.getTrip(tripId);
    return {
      tripId,
      ...trip.weather.summary,
    };
  }

  getWeatherForecast(tripId: string) {
    const trip = this.getTrip(tripId);
    return {
      tripId,
      forecast: trip.weather.forecast,
    };
  }

  getPackingStrategy(tripId: string) {
    const trip = this.getTrip(tripId);
    return {
      tripId,
      recommended: trip.packingStrategy.recommended,
    };
  }

  getSharedTrip(tripId: string) {
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
  sendReminders(_tripId: string, _payload: { channel?: string; note?: string }) {
    return { sent: true };
  }

  listInspirations(destination?: string) {
    if (!destination) return this.data.inspirations;
    const d = destination.toLowerCase();
    return this.data.inspirations.filter((c) => c.destination.toLowerCase() === d);
  }
}

export const inMemoryStore = new InMemoryStore();

