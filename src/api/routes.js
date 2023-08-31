import { Router } from "express";
import { OAuthRouter } from "./controllers/oauth.js";
import { UsersRouter } from "./controllers/users.js";

export const router = Router();

router.use("/oauth", OAuthRouter);
router.use("/users", UsersRouter);
