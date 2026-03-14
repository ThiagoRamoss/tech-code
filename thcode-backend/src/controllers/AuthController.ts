import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

export class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
         res.status(400).json({ error: "E-mail e senha são obrigatórios para o login." });
         return;
      }

      const authService = new AuthService();
      const authData = await authService.authenticate(email, password);

      res.status(200).json(authData);
    } catch (error: any) {
      if (error.message === "E-mail/senha incorretos.") {
        res.status(401).json({ error: error.message });
      } else {
        console.error("Erro interno no Login:", error);
        res.status(500).json({ error: "Erro interno no servidor." });
      }
    }
  }
}
