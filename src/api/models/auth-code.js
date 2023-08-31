import { Schema, model } from "mongoose";

const authCodeSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    client: {
      type: Schema.Types.ObjectId,
      ref: "Client",
    },
    authorizationCode: String,
    expiresAt: Date,
    scope: String,
  },
  {
    timestamps: true,
  }
);

export const AuthCode = model("AuthCode", authCodeSchema, "oauth_auth_codes");
