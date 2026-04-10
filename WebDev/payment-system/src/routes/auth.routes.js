import {Router} from 'express';
import { login, logout, logoutAll, refreshToken, register, verifyEmail } from '../controllers/auth.controller.js';

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/refresh-token", refreshToken);
authRouter.get("/logout", logout);
authRouter.get("/logout-all", logoutAll);
authRouter.post("/verify-email", verifyEmail);

export default authRouter;