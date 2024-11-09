import UserModel from "./user-model.js";
import "dotenv/config";
import { connect } from "mongoose";

export async function connectToDB() {
  let mongoDBUri =
    process.env.ENV === "PROD"
      ? process.env.DB_CLOUD_URI
      : process.env.DB_LOCAL_URI;

  await connect(mongoDBUri);
}

export async function createUser(username, email, password, verificationCode) {
  return new UserModel({ username, email, password, verificationCode }).save();
}

export async function findUserByEmail(email) {
  return UserModel.findOne({ email });
}

export async function findUserById(userId) {
  return UserModel.findById(userId);
}

export async function findUserByUsername(username) {
  return UserModel.findOne({ username });
}

export async function findUserByUsernameOrId(userId) {
  const length = userId.length;
  if (length === 24) {
    return await findUserById(userId);
  }
  return await findUserByUsername(userId);
}

export async function findUserByUsernameOrEmail(username, email) {
  return UserModel.findOne({
    $or: [{ username }, { email }],
  });
}

export async function findAllUsers() {
  return UserModel.find();
}

export async function updateUserById(
  userId,
  username,
  email,
  password,
  bio,
  linkedin,
  github,
  profilePictureUrl,
  isVerified,
  verificationCode
) {
  return UserModel.findByIdAndUpdate(
    userId,
    {
      $set: {
        username,
        email,
        password,
        bio,
        linkedin,
        github,
        profilePictureUrl,
        isVerified,
        verificationCode
      },
    },
    { new: true } // return the updated user
  );
}

export async function updateUserPrivilegeById(userId, isAdmin) {
  return UserModel.findByIdAndUpdate(
    userId,
    {
      $set: {
        isAdmin,
      },
    },
    { new: true } // return the updated user
  );
}

export async function deleteUserById(userId) {
  return UserModel.findByIdAndDelete(userId);
}

export async function findUserByVerificationCode(verificationCode) {
  return UserModel.findOne({ verificationCode });
}

export async function verifyUserByVerificationCode(verificationCode) {
  return UserModel.findOneAndUpdate(
    { verificationCode },
    { $set: { isVerified: true } }, // we keep verification code because we want to say "already verified" if the user decides to go again
    { new: true },  // return the updated user
  );
}

export async function addPasswordResetCodeToUser(userId, passwordResetCode) {
  return UserModel.findByIdAndUpdate(
    userId,
    { $set: { passwordResetCode } },
    { new: true },  // return the updated user
  );
}

export async function findUserByPasswordResetCode(passwordResetCode) {
  return UserModel.findOne({ passwordResetCode });
}