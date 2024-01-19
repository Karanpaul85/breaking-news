import mongoose from "mongoose";
import { connectionStr } from "@/utils/db";
import { notificationToken } from "@/utils/model/userNotificationToken";
export default async function handler(req, res) {
  await mongoose.connect(connectionStr);
  if (req.method === "POST") {
    const reqBody = req?.body;
    const token = reqBody.token;
    try {
      const existing = await notificationToken.findOne({ token });
      if (!existing) {
        const newToken = new notificationToken({
          token,
        });
        await newToken.save();
        res.status(200).json(true);
      } else {
        res.status(200).json(true);
      }
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else if (req.method === "GET") {
    const data = await notificationToken.find();
    const tokens = data.map(item => item.token);
    res.status(200).json(tokens);
  }
}
