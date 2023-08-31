import crypto from "crypto";
import { Router } from "express";
import { Client } from "../models/client.js";
import { OAuth } from "../models/oauth.js";
import { User } from "../models/user.js";

export const UsersRouter = Router();

UsersRouter.post("/", async (req, res) => {
  if (req.body.password !== req.body.confirmPassword)
    return res.status(422).json({ error: "Passwords does not match" });

  // Create User
  const _user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    username: req.body.username,
    email: req.body.email,
    verificationCode: crypto.randomBytes(16).toString("hex"),
  });
  _user.setPassword(req.body.password);

  const user = await _user.save();

  if (!user) return res.status(422).json({ error: "Error creating user" });

  // Create OAuth Client
  const _client = await OAuth.getClient(
    req.body.clientId,
    req.body.clientSecret
  );

  if (!_client) {
    _client = new Client({
      user: user.id,
      clientId: req.body.clientId,
      clientSecret: req.body.clientSecret,
      redirectUris: req.body.redirectUris.split(","),
      grants: [
        "authorization_code",
        "client_credentials",
        "refresh_token",
        "password",
      ],
    });
    _client.save();
  }

  return res.status(201).json({ message: "user created" });
});
