declare module "swagger-jsdoc" {
  // Minimal typing for MVP; swagger-jsdoc returns an OpenAPI spec object.
  const swaggerJSDoc: (options: unknown) => Record<string, unknown>;
  export default swaggerJSDoc;
}

declare module "swagger-ui-express" {
  import type { RequestHandler } from "express";

  const swaggerUi: {
    serve: RequestHandler;
    setup: (spec: unknown) => RequestHandler;
  };
  export default swaggerUi;
}

