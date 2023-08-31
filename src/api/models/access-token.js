import { Schema, model } from "mongoose";

const accessTokenSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    client: {
      type: Schema.Types.ObjectId,
      ref: "Client",
    },
    accessToken: String,
    accessTokenExpiresAt: Date,
    refreshToken: String,
    refreshTokenExpiresAt: Date,
    scope: String,
  },
  {
    timestamps: true,
  }
);

export const AccessToken = model(
  "AccessToken",
  accessTokenSchema,
  "oauth_access_tokens"
);
