import { Router } from "express";
import {
  registerUser,
  login,
  logoutUser,
} from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validator.middleware.js";
import {
  userRegisterValidator,
  userLoginValidator,
} from "../validators/index.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter
  .route("/register")
  .post(userRegisterValidator(), validate, registerUser);

authRouter.route("/login").post(userLoginValidator(), validate, login);

authRouter.route("/logout").post(verifyToken, logoutUser);

export default authRouter;
