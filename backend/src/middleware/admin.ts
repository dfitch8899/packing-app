import type { NextFunction, Request, Response } from "express";
import { HttpError } from "./errorHandler";

export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  const provided = req.header("x-admin-key");
  const expected = process.env.ADMIN_KEY ?? "dev";

  if (!provided || provided !== expected) {
    return next(new HttpError(401, "Unauthorized", "ADMIN_UNAUTHORIZED"));
  }

  return next();
}

