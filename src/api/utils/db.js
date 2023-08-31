import { connect, set } from "mongoose";
import { DEBUG_DB, MONGODB_URI } from "./config.js";
import { error, info } from "./logger.js";

export const connectToDatabase = async () => {
  info("Connecting to", MONGODB_URI);

  connect(MONGODB_URI)
    .then(() => info("Connected to MongoDB"))
    .catch((err) => error("Error connection to MongoDB:", err.message));

  set("debug", DEBUG_DB);

  return null;
};
