import { Schema, model } from "mongoose";

const clientSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    clientId: String,
    clientSecret: String,
    redirectUris: Array,
    grants: Array,
  },
  {
    timestamps: true,
  }
);

export const Client = model("Client", clientSchema, "oauth_clients");
