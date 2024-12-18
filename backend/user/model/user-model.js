import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserModelSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    default: "",
  },
  linkedin: {
    type: String,
    default: "",
  },
  github: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now, // Setting default to the current date/time
  },
  profilePictureUrl: {
    type: String,
    default: "",
  },
  verificationCode: {
    type: String,
    default: "",
  },
  passwordResetCode: {
    type: String,
    default: "",
  },
  isVerified: {
    type: Boolean,
    required: true,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
});

export default mongoose.model("UserModel", UserModelSchema);
