import { body } from "express-validator";

export const userRegisterValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),

    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is required")
      .isLowerCase()
      .withMessage("Username must be in the lower case")
      .isLength("Username must be atleast 3 characters long"),

    body("passowrd").trim().notEmpty().withMessage("password is required"),

    body("fullname").optional().trim(),
  ];
};
