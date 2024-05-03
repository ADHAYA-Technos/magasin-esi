import express from "express";
import AuthController from "../controllers/AuthController.js";

const router = express.Router();

router.get('/me', AuthController.me);
router.post('/login', AuthController.login);
router.delete('/logout', AuthController.logout);

export default router;