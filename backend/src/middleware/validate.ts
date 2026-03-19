import type { NextFunction, Request, RequestHandler, Response } from "express";
import type { z } from "zod";

type ZodSchema<T> = { parse: (v: unknown) => T };
type ValidateSchemas = {
  body?: ZodSchema<unknown>;
  query?: ZodSchema<unknown>;
  params?: ZodSchema<unknown>;
};

export function validateZod(schemas: ValidateSchemas): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schemas.body) {
        (req as any).body = schemas.body.parse(req.body);
      }
      if (schemas.query) {
        (req as any).query = schemas.query.parse(req.query);
      }
      if (schemas.params) {
        (req as any).params = schemas.params.parse(req.params);
      }
      next();
    } catch (err) {
      next(err);
    }
  };
}

