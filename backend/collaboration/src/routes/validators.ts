import { check } from "express-validator";

export const createSessionValidators = [
  check("collabid").isString().isLength({ min: 1 }),
  check("language").isString().isLength({ min: 1 }),
  check("question_id").isInt(),
  //custom validation for users
  check("users").custom((users) => {
    if (!Array.isArray(users) || users.length !== 2) {
      throw new Error("Users must only contain 2 users");
    }
    //check if array contains only non-empty strings and trim whitespace
    if (
      !users.every(
        (element) =>
          typeof element === "string" &&
          element.length > 0 &&
          element.trim().length > 0
      )
    ) {
      throw new Error("Users must be non-empty");
    }
    return true;
  }),
];

export const idValidators = [check("id").isString().isLength({ min: 1 })];

export const updateSessionValidators = [
  check("id").isString().isLength({ min: 1 }),
  check("code").isString(),
];

export const createChatLogValidators = [
  check("collabid").isString().isLength({ min: 1 }),
  check("message").isString().isLength({ min: 1 }),
  check("senderId").isString().isLength({ min: 1 }),
  check("recipientId").isString().isLength({ min: 1 }),
  check("timestampEpoch").isInt(),
]

export const getChatLogValidators = [
  check("collabid").isString().isLength({ min: 1 }),
  check("page").isInt(),
  check("limit").isInt(),
]