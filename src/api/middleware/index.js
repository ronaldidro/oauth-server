import { error as logger } from "../utils/logger.js";

const unknownEndpoint = (_req, res) =>
  res.status(404).send({ error: "unknown endpoint" });

const errorHandler = (error, _req, res, next) => {
  logger("error handler: ", error.message);

  if (error.name === "CastError")
    return res.status(422).send({ error: "malformatted id" });
  if (error.name === "ValidationError")
    return res.status(422).json({ error: error.message });
  if (error.name === "JsonWebTokenError")
    return res.status(422).json({ error: "invalid token" });

  next(error);
};

export { errorHandler, unknownEndpoint };
