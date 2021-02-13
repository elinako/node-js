const { Router } = require("express");
const UserController = require("./user.controllers");

const userRouter = Router();

userRouter.post(
  "/register",
  UserController.validateCreateUser,
  UserController.createUser
);

userRouter.put("/signin", UserController.validateSignIn, UserController.signIn);

userRouter.patch("/logout", UserController.authorize, UserController.logout);

userRouter.get(
  "/current",
  UserController.authorize,
  UserController._getCurrentUser
);

module.exports = userRouter;
