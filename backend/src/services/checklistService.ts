import { inMemoryStore } from "../store/inMemoryStore";
import type { ChecklistItem } from "../store/types";

export const checklistService = {
  getChecklist(tripId: string, categoryId: string | "all") {
    return inMemoryStore.getTripChecklist(tripId, categoryId);
  },

  addCustomItem(
    tripId: string,
    input: { text: string; categoryId: string; quantity: number }
  ) {
    const item = inMemoryStore.addChecklistItem(tripId, input as Omit<ChecklistItem, "id" | "completed">);
    return item;
  },

  setItemCompleted(
    tripId: string,
    itemId: string,
    completed: boolean
  ) {
    return inMemoryStore.patchChecklistItem(tripId, itemId, { completed });
  },
};

