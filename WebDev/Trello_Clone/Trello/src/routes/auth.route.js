const { Router } = require("express");
const { signup, signin } = require("../controllers/auth.controller.js");

const authRouter = Router();

authRouter.post("/signup", signup);
authRouter.post("/signin", signin);

module.exports = {
  authRouter: authRouter
}