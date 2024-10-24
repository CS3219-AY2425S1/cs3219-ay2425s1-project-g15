import { check } from "express-validator";

export const createSessionValidators = [
  check("collabid").isString().isLength({ min: 1 }),
  check("difficulty").isString().isLength({ min: 1 }),
  check("topic").isString().isLength({ min: 1 }),
  check("question_title").isString().isLength({ min: 1 }),
  check("question_description").isString().isLength({ min: 1 }),
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
  // custom validation for language
  check("language").custom((language) => {
    if (!Array.isArray(language) || language.length === 0) {
      throw new Error("Language must be a non-empty array");
    }
    //check if array contains only non-empty strings and trim whitespace
    if (
      !language.every(
        (element) =>
          typeof element === "string" &&
          element.length > 0 &&
          element.trim().length > 0
      )
    ) {
      throw new Error("Language must contain only non-empty strings");
    }
    return true;
  }),
];

export const idValidators = [check("id").isString().isLength({ min: 1 })];

export const updateSessionValidators = [
  check("id").isString().isLength({ min: 1 }),
  check("code").isString(),
];
