import { prisma } from '../lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AuthService {
  async authenticate(email: string, passwordStringDigitada: string) {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new Error("E-mail/senha incorretos.");
    }

    const isValidPassword = await bcrypt.compare(passwordStringDigitada, user.password);

    if (!isValidPassword) {
      throw new Error("E-mail/senha incorretos.");
    }

    const secret = process.env.JWT_SECRET || 'senhaSuperSecretaDeDeveloper';

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
      },
      secret,
      {
        subject: user.id,
        expiresIn: '1d'
      }
    );

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      token
    };
  }
}
