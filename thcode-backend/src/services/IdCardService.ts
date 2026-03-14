import { prisma } from '../lib/prisma';

export class IdCardService {
  async create(nickname: string, userId: string) {
    if (!nickname || !userId) {
      throw new Error("Nickname e ID do Usuário são obrigatórios.");
    }

    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      throw new Error("Usuário não encontrado.");
    }

    const cardExists = await prisma.idCard.findUnique({
      where: { userId: userId },
    });

    if (cardExists) {
      throw new Error("Este usuário já possui um IdCard vinculado.");
    }

    const idCard = await prisma.idCard.create({
      data: {
        nickname,
        userId,
      },
    });

    return idCard;
  }

  async findAll() {
    const idCards = await prisma.idCard.findMany({
      orderBy: {
        nickname: 'asc'
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          }
        }
      }
    });

    return idCards;
  }

  async findById(id: string) {
    if (!id) {
      throw new Error("ID do IdCard é obrigatório.");
    }

    const idCard = await prisma.idCard.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          }
        }
      }
    });

    if (!idCard) {
      throw new Error("IdCard não encontrado.");
    }

    return idCard;
  }

  async update(id: string, nickname?: string, level?: number, experience?: number, badges?: string[]) {
    if (!id) {
      throw new Error("ID do IdCard é obrigatório para atualização.");
    }

    const cardExists = await prisma.idCard.findUnique({
      where: { id }
    });

    if (!cardExists) {
      throw new Error("IdCard não encontrado.");
    }

    if (nickname && nickname !== cardExists.nickname) {
      const nicknameExists = await prisma.idCard.findUnique({
        where: { nickname }
      });
      if (nicknameExists) {
        throw new Error("Este nickname já está sendo utilizado.");
      }
    }

    const dataToUpdate: any = {};
    if (nickname !== undefined) dataToUpdate.nickname = nickname;
    if (level !== undefined) dataToUpdate.level = level;
    if (experience !== undefined) dataToUpdate.experience = experience;
    if (badges !== undefined) dataToUpdate.badges = badges;

    const idCard = await prisma.idCard.update({
      where: { id },
      data: dataToUpdate,
    });

    return idCard;
  }

  async delete(id: string) {
    if (!id) {
      throw new Error("ID do IdCard é obrigatório.");
    }

    const cardExists = await prisma.idCard.findUnique({
      where: { id }
    });

    if (!cardExists) {
      throw new Error("IdCard não encontrado.");
    }

    await prisma.idCard.delete({
      where: { id }
    });

    return { message: "IdCard deletado com sucesso." };
  }
}