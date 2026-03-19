import express from "express";

import { checklistService } from "../services/checklistService";
import { sharedService } from "../services/sharedService";
import { tripService } from "../services/tripService";
import { weatherService } from "../services/weatherService";
import { validateZod } from "../middleware/validate";
import {
  addChecklistItemBodySchema,
  checklistQuerySchema,
  listTripsQuerySchema,
  remindersBodySchema,
  setChecklistItemCompletedBodySchema,
} from "../schemas/trips";

export const tripsRouter = express.Router();

tripsRouter.get(
  "/",
  validateZod({
    query: listTripsQuerySchema,
  }),
  (req, res) => {
    const status = req.query.status as "upcoming" | "all";
  const trips = tripService.listTrips(status);
  res.json({ trips });
  }
);

tripsRouter.get("/:tripId", (req, res) => {
  const tripId = req.params.tripId;
  const trip = tripService.getTripDetails(tripId);
  res.json({ trip });
});

tripsRouter.get(
  "/:tripId/checklist",
  validateZod({
    query: checklistQuerySchema,
  }),
  (req, res) => {
    const tripId = req.params.tripId;
    const category = req.query.category as string;
    const checklist = checklistService.getChecklist(tripId, category);
    res.json({ checklist });
  }
);

tripsRouter.post(
  "/:tripId/checklist/items",
  validateZod({
    body: addChecklistItemBodySchema,
  }),
  (req, res) => {
    const tripId = req.params.tripId;
    const { text, categoryId, quantity } = req.body as {
      text: string;
      categoryId: string;
      quantity: number;
    };

    const item = checklistService.addCustomItem(tripId, { text, categoryId, quantity });
    res.status(201).json({ item });
  }
);

tripsRouter.patch(
  "/:tripId/checklist/items/:itemId",
  validateZod({
    body: setChecklistItemCompletedBodySchema,
  }),
  (req, res) => {
    const tripId = req.params.tripId;
    const itemId = req.params.itemId;
    const { completed } = req.body as { completed: boolean };

    const item = checklistService.setItemCompleted(tripId, itemId, completed);
    res.json({ item });
  }
);

tripsRouter.get("/:tripId/weather/summary", (req, res) => {
  const tripId = req.params.tripId;
  const summary = weatherService.getSummary(tripId);
  res.json({ summary });
});

tripsRouter.get("/:tripId/weather/forecast", (req, res) => {
  const tripId = req.params.tripId;
  const forecast = weatherService.getForecast(tripId);
  res.json({ forecast });
});

tripsRouter.get("/:tripId/packing-strategy", (req, res) => {
  const tripId = req.params.tripId;
  const strategy = weatherService.getPackingStrategy(tripId);
  res.json({ strategy });
});

tripsRouter.get("/:tripId/shared", (req, res) => {
  const tripId = req.params.tripId;
  const shared = sharedService.getSharedOverview(tripId);
  res.json({ shared });
});

tripsRouter.post(
  "/:tripId/reminders",
  validateZod({
    body: remindersBodySchema.optional(),
  }),
  (req, res) => {
    const tripId = req.params.tripId;
    const payload = req.body as { channel?: string; note?: string } | undefined;
    const result = sharedService.sendReminders(tripId, payload ?? {});
    res.json({ result });
  }
);

