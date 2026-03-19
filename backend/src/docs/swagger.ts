export const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "Packing App API (MVP)",
    version: "0.1.0",
  },
  servers: [
    {
      url: "http://localhost:3001",
    },
  ],
  tags: [{ name: "MVP" }],
  paths: {
    "/api/v1/health": {
      get: {
        tags: ["MVP"],
        summary: "Health check",
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: { type: "object", properties: { status: { type: "string" } } },
              },
            },
          },
        },
      },
    },
    "/api/v1/trips": {
      get: {
        tags: ["MVP"],
        summary: "List trips (with progress)",
        parameters: [
          {
            name: "status",
            in: "query",
            schema: { type: "string", enum: ["upcoming", "all"], default: "upcoming" },
          },
        ],
        responses: { "200": { description: "Trip list" } },
      },
    },
    "/api/v1/trips/{tripId}": {
      get: {
        tags: ["MVP"],
        summary: "Get trip details",
        parameters: [{ name: "tripId", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Trip details" }, "404": { description: "Trip not found" } },
      },
    },
    "/api/v1/trips/{tripId}/checklist": {
      get: {
        tags: ["MVP"],
        summary: "Get checklist (optionally by category)",
        parameters: [
          { name: "tripId", in: "path", required: true, schema: { type: "string" } },
          { name: "category", in: "query", schema: { type: "string", default: "all" } },
        ],
        responses: { "200": { description: "Checklist" } },
      },
    },
    "/api/v1/trips/{tripId}/checklist/items": {
      post: {
        tags: ["MVP"],
        summary: "Add a custom checklist item",
        parameters: [{ name: "tripId", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["text", "categoryId"],
                properties: {
                  text: { type: "string" },
                  categoryId: { type: "string" },
                  quantity: { type: "integer", minimum: 1, default: 1 },
                },
              },
            },
          },
        },
        responses: { "201": { description: "Created item" }, "400": { description: "Validation error" } },
      },
    },
    "/api/v1/trips/{tripId}/checklist/items/{itemId}": {
      patch: {
        tags: ["MVP"],
        summary: "Update checklist item completion state",
        parameters: [
          { name: "tripId", in: "path", required: true, schema: { type: "string" } },
          { name: "itemId", in: "path", required: true, schema: { type: "string" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { type: "object", required: ["completed"], properties: { completed: { type: "boolean" } } },
            },
          },
        },
        responses: { "200": { description: "Updated item" }, "404": { description: "Item not found" } },
      },
    },
    "/api/v1/trips/{tripId}/weather/summary": {
      get: {
        tags: ["MVP"],
        summary: "Weather summary (dummy)",
        parameters: [{ name: "tripId", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Weather summary" } },
      },
    },
    "/api/v1/trips/{tripId}/weather/forecast": {
      get: {
        tags: ["MVP"],
        summary: "7-day forecast (dummy)",
        parameters: [{ name: "tripId", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Forecast" } },
      },
    },
    "/api/v1/trips/{tripId}/packing-strategy": {
      get: {
        tags: ["MVP"],
        summary: "Packing strategy (dummy)",
        parameters: [{ name: "tripId", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Packing strategy" } },
      },
    },
    "/api/v1/trips/{tripId}/shared": {
      get: {
        tags: ["MVP"],
        summary: "Shared trip overview (dummy)",
        parameters: [{ name: "tripId", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Shared overview" } },
      },
    },
    "/api/v1/trips/{tripId}/reminders": {
      post: {
        tags: ["MVP"],
        summary: "Send reminders (dummy)",
        parameters: [{ name: "tripId", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: false,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  channel: { type: "string" },
                  note: { type: "string" },
                },
              },
            },
          },
        },
        responses: { "200": { description: "Success" } },
      },
    },
    "/api/v1/inspirations": {
      get: {
        tags: ["MVP"],
        summary: "Inspirations (dummy)",
        parameters: [
          { name: "destination", in: "query", schema: { type: "string" } },
        ],
        responses: { "200": { description: "Inspiration cards" } },
      },
    },
    "/api/v1/admin/reset-demo-data": {
      post: {
        tags: ["MVP"],
        summary: "Reset in-memory demo data",
        parameters: [
          {
            name: "x-admin-key",
            in: "header",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: { "200": { description: "OK" }, "401": { description: "Unauthorized" } },
      },
    },
  },
} as const;

