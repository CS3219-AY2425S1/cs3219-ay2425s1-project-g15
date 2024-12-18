import express from "express";

import {
  checkPasswordResetCode,
  createUser,
  deleteUser,
  getAllUsers,
  getUser,
  requestPasswordReset,
  resetPasswordUsingCode,
  updateUser,
  updateUserPrivilege,
  getFileUrl,
  verifyUser,
  resetPasswordFromProfile,
} from "../controller/user-controller.js";
import {
  verifyAccessToken,
  verifyIsAdmin,
  verifyIsOwnerOrAdmin,
} from "../middleware/basic-access-control.js";

const router = express.Router();

router.get("/", verifyAccessToken, verifyIsAdmin, getAllUsers);

router.patch(
  "/:id/privilege",
  verifyAccessToken,
  verifyIsAdmin,
  updateUserPrivilege
);

router.get("/verify", verifyUser);

router.post("/:id/reset-password-from-profile", resetPasswordFromProfile);

router.post("/request-password-reset", requestPasswordReset);

router.post("/check-password-reset-code", checkPasswordResetCode);

router.post("/password-reset", resetPasswordUsingCode);

router.post("/", createUser);

router.post("/:id/getFileUrl", getFileUrl);

router.get("/:id", verifyAccessToken, getUser);

router.patch("/:id", verifyAccessToken, verifyIsOwnerOrAdmin, updateUser);

router.delete("/:id", verifyAccessToken, verifyIsOwnerOrAdmin, deleteUser);

export default router;
