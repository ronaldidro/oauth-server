import express from "express";

export const api = express();

api.get("/test", (_req, res) => {
  res.json({ message: "test oka" });
});
