import { describe, expect, it } from "vitest";
import request from "supertest";

import { createApp } from "../src/app";

describe("Packing App API (MVP)", () => {
  const app = createApp();

  it("GET /api/v1/health returns ok", async () => {
    const res = await request(app).get("/api/v1/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });

  it("GET /api/v1/trips/:tripId returns 404 when missing", async () => {
    const res = await request(app).get("/api/v1/trips/not-a-trip");
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe("TRIP_NOT_FOUND");
  });

  it("POST checklist item validates request body", async () => {
    const res = await request(app)
      .post("/api/v1/trips/kyoto/checklist/items")
      .send({ categoryId: "clothing" }); // missing text

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });
});

