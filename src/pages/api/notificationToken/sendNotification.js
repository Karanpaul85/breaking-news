import { pushNotification } from "@/utils/pushNotifications";
import axios from "axios";

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://breakingnewsapp.netlify.app"
    : "http://localhost:3000";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const reqBody = req?.body;
    try {
      const tokens = await axios.get(`${BASE_URL}/api/notificationToken`);
      const notificationData = {
        registration_ids: tokens.data,
        notification: reqBody,
      };
      const finalResp = await pushNotification(notificationData);
      res.status(200).json(finalResp);
    } catch (error) {
      res.status(200).json(error);
    }
  } else if (req.method === "GET") {
    res.status(200).json("GET");
  }
}
