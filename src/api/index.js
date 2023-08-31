import express from "express";
import "express-async-errors";
import morgan from "morgan";
import { errorHandler, unknownEndpoint } from "./middleware/index.js";
import { router } from "./routes.js";
import { connectToDatabase } from "./utils/db.js";

export const api = express();

connectToDatabase();

if (process.env.NODE_ENV !== "production") {
  morgan.token("body", (req) => JSON.stringify(req.body));
  api.use(
    morgan(
      ":method :url :body :status :res[content-length] - :response-time ms"
    )
  );
}

api.use(express.json());
api.use(express.urlencoded({ extended: false }));

api.use(router);

api.use(unknownEndpoint);
api.use(errorHandler);
