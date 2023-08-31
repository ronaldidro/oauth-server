import { config } from "dotenv";

config();

const MONGODB_URI = process.env.MONGODB_URI;
const SALT = process.env.SALT;
const DEBUG_DB = process.env.NODE_ENV === "development";

export { DEBUG_DB, MONGODB_URI, SALT };
