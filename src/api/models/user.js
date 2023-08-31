import { Schema, model } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import { pbkdf2Sync } from "node:crypto";
import { SALT } from "../utils/config.js";

const userSchema = new Schema(
  {
    firstName: { type: String, minlength: 3, required: true },
    lastName: { type: String, minlength: 3, required: true },
    username: { type: String, minlength: 4, unique: true },
    password: { type: String, minlength: 5, required: true },
    email: { type: String, unique: true },
    verificationCode: String,
    verifiedAt: Date,
  },
  {
    timestamps: true,
  }
);

userSchema.methods.setPassword = function (password) {
  this.password = pbkdf2Sync(password, SALT, 10000, 32, "sha512").toString(
    "hex"
  );
};

userSchema.methods.validatePassword = function (password) {
  const _password = pbkdf2Sync(password, SALT, 10000, 32, "sha512").toString(
    "hex"
  );
  return this.password === _password;
};

userSchema.plugin(uniqueValidator, {
  message: "{VALUE} is already used",
});

export const User = model("User", userSchema, "users");
