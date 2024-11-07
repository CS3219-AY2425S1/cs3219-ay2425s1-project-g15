import bcrypt from "bcryptjs";
import { isValidObjectId } from "mongoose";
import {
  createUser as _createUser,
  deleteUserById as _deleteUserById,
  findAllUsers as _findAllUsers,
  findUserByEmail as _findUserByEmail,
  findUserById as _findUserById,
  findUserByUsername as _findUserByUsername,
  findUserByUsernameOrEmail as _findUserByUsernameOrEmail,
  findUserByUsernameOrId as _findUserByUsernameOrId,
  updateUserById as _updateUserById,
  updateUserPrivilegeById as _updateUserPrivilegeById,
} from "../model/repository.js";
import multer from "multer";
import { Storage } from "@google-cloud/storage";

const storage = new Storage({
  projectId: process.env["credentials_project_id"],
  credentials: {
    type: process.env["credentials_type"],
    project_id: process.env["credentials_project_id"],
    private_key_id: process.env["a087d3fe5241946fd7309c0f923b06e6522cc5b6"],
    private_key: process.env["credentials_private_key"],
    client_email: process.env["credentials_client_email"],
    client_id: process.env["credentials_client_id"],
    auth_uri: process.env["credentials_auth_uri"],
    token_uri: process.env["credentials_token_uri"],
    auth_provider_x509_cert_url: process.env["credentials_auth_provider"],
    client_x509_cert_url: process.env["credentials_cert_url"],
  },
});
const profileBucketName = "peerprep-g15-profile-pictures";
const profileBucket = storage.bucket(profileBucketName);
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
}).single("profilePicture");

export async function createUser(req, res) {
  try {
    const { username, email, password } = req.body;
    if (username && email && password) {
      const existingUser = await _findUserByUsernameOrEmail(username, email);
      if (existingUser) {
        return res
          .status(409)
          .json({ message: "username or email already exists" });
      }

      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);
      const createdUser = await _createUser(username, email, hashedPassword);
      return res.status(201).json({
        message: `Created new user ${username} successfully`,
        data: formatUserResponse(createdUser),
      });
    } else {
      return res
        .status(400)
        .json({ message: "username and/or email and/or password are missing" });
    }
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Unknown error when creating new user!" });
  }
}

export async function getUser(req, res) {
  try {
    const userId = req.params.id;

    const user = await _findUserByUsernameOrId(userId);
    if (!user) {
      return res.status(404).json({ message: `User ${userId} not found` });
    } else {
      return res
        .status(200)
        .json({ message: `Found user`, data: formatUserResponse(user) });
    }
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Unknown error when getting user!" });
  }
}

export async function getAllUsers(req, res) {
  try {
    const users = await _findAllUsers();

    return res
      .status(200)
      .json({ message: `Found users`, data: users.map(formatUserResponse) });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Unknown error when getting all users!" });
  }
}

export async function updateUser(req, res) {
  try {
    const { username, email, password, bio, linkedin, github } = req.body;
    if (username || email || password || bio || linkedin || github) {
      const userId = req.params.id;
      if (!isValidObjectId(userId)) {
        return res.status(404).json({ message: `User ${userId} not found` });
      }
      const user = await _findUserById(userId);
      if (!user) {
        return res.status(404).json({ message: `User ${userId} not found` });
      }
      if (username || email) {
        let existingUser = await _findUserByUsername(username);
        if (existingUser && existingUser.id !== userId) {
          return res.status(409).json({ message: "username already exists" });
        }
        existingUser = await _findUserByEmail(email);
        if (existingUser && existingUser.id !== userId) {
          return res.status(409).json({ message: "email already exists" });
        }
      }

      let hashedPassword;
      if (password) {
        const salt = bcrypt.genSaltSync(10);
        hashedPassword = bcrypt.hashSync(password, salt);
      }
      const updatedUser = await _updateUserById(
        userId,
        username,
        email,
        hashedPassword,
        bio,
        linkedin,
        github
      );
      return res.status(200).json({
        message: `Updated data for user ${userId}`,
        data: formatUserResponse(updatedUser),
      });
    } else {
      return res.status(400).json({
        message:
          "No field to update: username and email and password are all missing!",
      });
    }
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Unknown error when updating user!" });
  }
}

export async function updateUserPrivilege(req, res) {
  try {
    const { isAdmin } = req.body;

    if (isAdmin !== undefined) {
      // isAdmin can have boolean value true or false
      const userId = req.params.id;
      if (!isValidObjectId(userId)) {
        return res.status(404).json({ message: `User ${userId} not found` });
      }
      const user = await _findUserById(userId);
      if (!user) {
        return res.status(404).json({ message: `User ${userId} not found` });
      }

      const updatedUser = await _updateUserPrivilegeById(
        userId,
        isAdmin === true
      );
      return res.status(200).json({
        message: `Updated privilege for user ${userId}`,
        data: formatUserResponse(updatedUser),
      });
    } else {
      return res.status(400).json({ message: "isAdmin is missing!" });
    }
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Unknown error when updating user privilege!" });
  }
}

export async function deleteUser(req, res) {
  try {
    const userId = req.params.id;
    if (!isValidObjectId(userId)) {
      return res.status(404).json({ message: `User ${userId} not found` });
    }
    const user = await _findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: `User ${userId} not found` });
    }

    await _deleteUserById(userId);
    return res
      .status(200)
      .json({ message: `Deleted user ${userId} successfully` });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Unknown error when deleting user!" });
  }
}

export function formatUserResponse(user) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    bio: user.bio,
    linkedin: user.linkedin,
    github: user.github,
    isAdmin: user.isAdmin,
    createdAt: user.createdAt,
  };
}

export function uploadProfilePicture(req, res) {
  upload(req, res, async (err) => {
    if (err) {
      console.error("File upload error:", err);
      return res.status(400).json({ message: "Error uploading file" });
    }

    const userId = req.params.id;
    if (!isValidObjectId(userId)) {
      return res.status(404).json({ message: `User ${userId} not found` });
    }

    const user = await _findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: `User ${userId} not found` });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No file provided" });
    }

    // Define a unique file name
    const blob = profileBucket.file(
      `profile-pictures/${userId}-${Date.now()}-${file.originalname}`
    );
    const blobStream = blob.createWriteStream({
      resumable: false,
      metadata: {
        contentType: file.mimetype,
      },
    });

    blobStream.on("error", (error) => {
      console.error("GCS upload error:", error);
      return res
        .status(500)
        .json({ message: "Error uploading profile picture" });
    });

    blobStream.on("finish", async () => {
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;

      // Update user's profile picture URL in the database
      try {
        const updatedUser = await _updateUserById(userId, {
          profilePictureUrl: publicUrl,
        });

        return res.status(200).json({
          message: "Profile picture uploaded successfully",
          data: formatUserResponse(updatedUser),
        });
      } catch (dbError) {
        console.error("Database update error:", dbError);
        return res.status(500).json({ message: "Error updating user profile" });
      }
    });

    // Pipe the file buffer to the blob stream
    blobStream.end(file.buffer);
  });
}
