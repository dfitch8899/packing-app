import { inMemoryStore } from "../store/inMemoryStore";

export const inspirationService = {
  list(destination?: string) {
    return inMemoryStore.listInspirations(destination);
  },
};

