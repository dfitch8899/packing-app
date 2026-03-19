import express from "express";

import { healthRouter } from "./health";
import { tripsRouter } from "./trips";
import { inspirationsRouter } from "./inspirations";
import { adminRouter } from "./admin";

export const apiV1Router = express.Router();

apiV1Router.use("/health", healthRouter);
apiV1Router.use("/trips", tripsRouter);
apiV1Router.use("/", inspirationsRouter);
apiV1Router.use("/admin", adminRouter);

