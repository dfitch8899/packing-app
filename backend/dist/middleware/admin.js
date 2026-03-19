"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = requireAdmin;
const errorHandler_1 = require("./errorHandler");
function requireAdmin(req, _res, next) {
    const provided = req.header("x-admin-key");
    const expected = process.env.ADMIN_KEY ?? "dev";
    if (!provided || provided !== expected) {
        return next(new errorHandler_1.HttpError(401, "Unauthorized", "ADMIN_UNAUTHORIZED"));
    }
    return next();
}
