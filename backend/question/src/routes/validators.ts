import { check, body } from "express-validator";

export const createQuestionValidators = [
  check("title").isString().isLength({ min: 1 }),
  check("description").isString().isLength({ min: 1 }),
  check("complexity").isString().isLength({ min: 1 }),
  //custom validation for category
  check("category").custom((category) => {
    if (!Array.isArray(category) || category.length === 0) {
      throw new Error("Category must be a non-empty array");
    }
    //check if array contains only non-empty strings and trim whitespace
    if (!category.every((element) => typeof element === "string" && element.length > 0 && element.trim().length > 0)) {
      throw new Error("Category must contain only non-empty strings");
    }
    return true;
  }
  ),
];

export const idValidators = [check("id").isInt({ min: 1 })];

export const updateQuestionValidators = [
  check("id").isInt(),
  body().custom((body) => {
    const { title, description, category, complexity } = body;
    if (!title && !description && !category && !complexity) {
      throw new Error("At least one field must be provided");
    }
    for (const field of [title, description, category, complexity]) {
      if (field) {
        //if field is cateogry
        if (field === category) {
          if (!Array.isArray(field) || field.length === 0) {
            throw new Error("Category must be a non-empty array");
          }
          //check if array contains only non-empty strings and trim whitespace
          if (!field.every((element) => typeof element === "string" && element.length > 0 && element.trim().length > 0)) {
            throw new Error("Category must contain only non-empty strings");
          }
        } else {
          //check that it is string
          if (typeof field !== "string") {
            throw new Error("Field must be a string");
          }
        }
      }
    }
    return true;
  }),
];
