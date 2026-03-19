import { inMemoryStore } from "../store/inMemoryStore";

export const weatherService = {
  getSummary(tripId: string) {
    return inMemoryStore.getWeatherSummary(tripId);
  },
  getForecast(tripId: string) {
    return inMemoryStore.getWeatherForecast(tripId);
  },
  getPackingStrategy(tripId: string) {
    return inMemoryStore.getPackingStrategy(tripId);
  },
};

