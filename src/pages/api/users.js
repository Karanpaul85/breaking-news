import { adminEmails } from "@/constant/common_constants";
import { connectionStr } from "@/utils/db";
import parseJwt from "@/utils/jwt";
import { User } from "@/utils/model/user";
import mongoose from "mongoose";

export default async function handler(req, res) {
  // Connect to the MongoDB database
  await mongoose.connect(connectionStr);
  const checkAdmin = (email) => {
    if (adminEmails.includes(email)) {
      return true;
    }
    return false;
  };
  if (req.method === "GET") {
    // Handle GET request to fetch data
    const data = await User.find();
    res.status(200).json(data);
  } else if (req.method === "POST") {
    const authHeader = req?.headers?.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    const payLoad = parseJwt(token);
    // Handle POST request to add new data
    const { email, name, picture, given_name, family_name } = payLoad;
    let setAdmin = checkAdmin(email);

    // Validate request body
    if (!email) {
      res.status(400).json({ error: "Bad Request" });
      return;
    }

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(200).json({
          name: existingUser.name,
          email: existingUser.email,
          picture: existingUser.picture,
          email_verified: true,
          isAdmin: existingUser.isAdmin,
        });
        return;
      }

      const newUser = new User({
        email,
        name,
        picture,
        given_name,
        family_name,
        password: "",
        isAdmin: setAdmin,
      });

      // Save the new user to the database
      const savedUser = await newUser.save();

      res.status(201).json({
        name: savedUser.name,
        email: savedUser.email,
        picture: savedUser.picture,
        email_verified: true,
        isAdmin: setAdmin,
      });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    // Handle other HTTP methods
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
