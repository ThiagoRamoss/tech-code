import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';

export const authRoutes = Router();
const authController = new AuthController();

authRoutes.post('/login', authController.login.bind(authController));
