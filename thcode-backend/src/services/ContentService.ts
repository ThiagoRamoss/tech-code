import { prisma } from '../lib/prisma';

export class ContentService {
  async create(title: string, body: string, roadmapId: string) {
    if (!title || !body || !roadmapId) {
      throw new Error("Título, corpo do texto e o ID do Roadmap são obrigatórios.");
    }

    const roadmapExists = await prisma.roadmap.findUnique({
      where: {
        id: roadmapId,
      },
    });

    if (!roadmapExists) {
      throw new Error("O Roadmap informado não existe no sistema.");
    }

    const content = await prisma.content.create({
      data: {
        title,
        body,
        roadmapId,
      },
    });

    return content;
  }
  async findAll() {
    const contents = await prisma.content.findMany({
      orderBy: {
        title: 'asc',
      },
      include: {
        roadmap: true, 
      }
    });

    return contents;
  }

  async findById(id: string) {
    if (!id) {
      throw new Error("ID do conteúdo é obrigatório.");
    }

    const content = await prisma.content.findUnique({
      where: { id },
      include: {
        roadmap: true
      }
    });

    if (!content) {
      throw new Error("Conteúdo não encontrado.");
    }

    return content;
  }

  async update(id: string, title?: string, body?: string, roadmapId?: string) {
    if (!id) {
      throw new Error("ID do conteúdo é obrigatório para atualização.");
    }

    const contentExists = await prisma.content.findUnique({
      where: { id }
    });

    if (!contentExists) {
      throw new Error("Conteúdo não encontrado.");
    }

    if (roadmapId && roadmapId !== contentExists.roadmapId) {
      const roadmapExists = await prisma.roadmap.findUnique({
        where: { id: roadmapId }
      });
      if (!roadmapExists) {
        throw new Error("O Roadmap informado não existe no sistema.");
      }
    }

    const dataToUpdate: any = {};
    if (title !== undefined) dataToUpdate.title = title;
    if (body !== undefined) dataToUpdate.body = body;
    if (roadmapId !== undefined) dataToUpdate.roadmapId = roadmapId;

    const content = await prisma.content.update({
      where: { id },
      data: dataToUpdate,
    });

    return content;
  }

  async delete(id: string) {
    if (!id) {
      throw new Error("ID do conteúdo é obrigatório.");
    }

    const contentExists = await prisma.content.findUnique({
      where: { id }
    });

    if (!contentExists) {
      throw new Error("Conteúdo não encontrado.");
    }

    await prisma.content.delete({
      where: { id }
    });

    return { message: "Conteúdo deletado com sucesso." };
  }
}
