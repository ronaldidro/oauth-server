import { Router } from "express";
import OAuthServer from "express-oauth-server";
import { OAuth } from "../models/oauth.js";
import { User } from "../models/user.js";

export const OAuthRouter = Router();

const oauth = new OAuthServer({
  model: OAuth,
  debug: true,
});

OAuthRouter.post(
  "/access_token",
  oauth.token({
    requireClientAuthentication: {
      authorization_code: false,
      refresh_token: false,
    },
  })
);

OAuthRouter.post(
  "/authenticate",
  async (req, _res, next) => {
    req.body.user = await User.findOne({ username: req.body.username });
    return next();
  },
  oauth.authorize({
    authenticateHandler: {
      handle: (req) => {
        return req.body.user;
      },
    },
  })
);
