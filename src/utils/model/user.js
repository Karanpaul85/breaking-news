import mongoose from "mongoose";

const userModel = mongoose.Schema({
  email: String,
  name: String,
  picture: String,
  given_name: String,
  family_name: String,
  password: String,
  isAdmin: Boolean,
});
export const User = mongoose.models.users || mongoose.model("users", userModel);
