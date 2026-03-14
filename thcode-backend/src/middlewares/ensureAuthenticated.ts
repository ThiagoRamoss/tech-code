import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: string;
    };
  }
}

export function ensureAuthenticated(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ error: "Token JWT não informado." });
    return;
  }

  const [, token] = authHeader.split(' ');

  try {
    const secret = process.env.JWT_SECRET || 'senhaSuperSecretaDeDeveloper';

    const decoded = jwt.verify(token, secret);

    const { sub } = decoded as { sub: string };
    req.user = {
      id: sub,
    };
    return next();
  } catch (error) {
    res.status(401).json({ error: "Token JWT inválido ou expirado." });
    return;
  }
}
