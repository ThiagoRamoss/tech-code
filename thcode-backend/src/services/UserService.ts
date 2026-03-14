import { prisma } from '../lib/prisma';
import bcrypt from 'bcrypt';

export class UserService {
  async create(name: string, email: string, password: string) {
    if (!name || !email || !password) {
      throw new Error("Nome, e-mail e senha são obrigatórios.");
    }

    const userExists = await prisma.user.findUnique({
      where: { email }
    });

    if (userExists) {
      throw new Error("Este e-mail já está em uso.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      },
    });

    return user;
  }
  async findAll() {
    const users = await prisma.user.findMany({
      orderBy: {
        name: 'asc',
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        idCard: true,
      }
    });

    return users;
  }

  async findById(id: string) {
    if (!id) {
      throw new Error("ID do usuário é obrigatório.");
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        idCard: true,
      }
    });

    if (!user) {
      throw new Error("Usuário não encontrado.");
    }

    return user;
  }

  async update(id: string, name?: string, email?: string, password?: string) {
    if (!id) {
      throw new Error("ID do usuário é obrigatório para atualização.");
    }

    const userExists = await prisma.user.findUnique({
      where: { id }
    });

    if (!userExists) {
      throw new Error("Usuário não encontrado.");
    }

    if (email && email !== userExists.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email }
      });
      if (emailExists) {
        throw new Error("Este e-mail já está sendo utilizado por outro usuário.");
      }
    }

    const dataToUpdate: any = {};
    if (name) dataToUpdate.name = name;
    if (email) dataToUpdate.email = email;
    if (password) {
      dataToUpdate.password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id },
      data: dataToUpdate,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      }
    });

    return user;
  }

  async delete(id: string) {
    if (!id) {
      throw new Error("ID do usuário é obrigatório.");
    }

    const userExists = await prisma.user.findUnique({
      where: { id }
    });

    if (!userExists) {
      throw new Error("Usuário não encontrado.");
    }

    await prisma.user.delete({
      where: { id }
    });

    return { message: "Usuário deletado com sucesso." };
  }
}
