"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateZod = validateZod;
function validateZod(schemas) {
    return (req, res, next) => {
        try {
            if (schemas.body) {
                req.body = schemas.body.parse(req.body);
            }
            if (schemas.query) {
                req.query = schemas.query.parse(req.query);
            }
            if (schemas.params) {
                req.params = schemas.params.parse(req.params);
            }
            next();
        }
        catch (err) {
            next(err);
        }
    };
}
