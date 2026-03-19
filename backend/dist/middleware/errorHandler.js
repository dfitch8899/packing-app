"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpError = void 0;
exports.notFoundHandler = notFoundHandler;
exports.errorHandler = errorHandler;
class HttpError extends Error {
    statusCode;
    code;
    constructor(statusCode, message, code = "HTTP_ERROR") {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
    }
}
exports.HttpError = HttpError;
function notFoundHandler(_req, res) {
    res.status(404).json({
        error: {
            code: "NOT_FOUND",
            message: "Route not found",
        },
    });
}
function errorHandler(err, _req, res, _next) {
    // Zod throws structured errors; we map them to 400.
    if (isZodError(err)) {
        return res.status(400).json({
            error: {
                code: "VALIDATION_ERROR",
                message: "Request validation failed",
                details: err.issues,
            },
        });
    }
    if (err instanceof HttpError) {
        return res.status(err.statusCode).json({
            error: {
                code: err.code,
                message: err.message,
            },
        });
    }
    // Unknown errors should not leak internal details.
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({
        error: {
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong",
        },
    });
}
function isZodError(err) {
    return typeof err === "object" && err !== null && "issues" in err;
}
