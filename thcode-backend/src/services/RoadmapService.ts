import { prisma } from '../lib/prisma';
import { redis } from '../lib/redis';

export class RoadmapService {
    async create(title: string, description?: string) {
        if (!title) {
            throw new Error("O título do Roadmap é obrigatório.");
        }

        const roadmap = await prisma.roadmap.create({
            data: {
                title: title,
                description: description,
            },
        });

        return roadmap;
    }
    async findAll() {
    // 1. Tentar buscar no Redis primeiro (chave: 'roadmaps:all')
    const cachedRoadmaps = await redis.get('roadmaps:all');
    
    if (cachedRoadmaps) {
      // Se tiver, converte de volta de string para objeto e retorna super rápido!
      return JSON.parse(cachedRoadmaps);
    }

    // 2. Se não tinha no cache, busca normalmente no PostgreSQL (via Prisma)
    const roadmaps = await prisma.roadmap.findMany({
      orderBy: {
        title: 'asc'
      }
    });

    // 3. Salva a resposta no Redis para os próximos usuários
    // 'EX', 3600 = Expira em 3600 segundos (1 hora)
    await redis.set('roadmaps:all', JSON.stringify(roadmaps), 'EX', 3600);
    
    return roadmaps;
  }

  async findById(id: string) {
    if (!id) {
      throw new Error("ID do roadmap é obrigatório.");
    }

    const roadmap = await prisma.roadmap.findUnique({
      where: { id },
      include: {
        contents: true
      }
    });

    if (!roadmap) {
      throw new Error("Roadmap não encontrado.");
    }

    return roadmap;
  }

  async update(id: string, title?: string, description?: string) {
    if (!id) {
      throw new Error("ID do roadmap é obrigatório para atualização.");
    }

    const roadmapExists = await prisma.roadmap.findUnique({
      where: { id }
    });

    if (!roadmapExists) {
      throw new Error("Roadmap não encontrado.");
    }

    const dataToUpdate: any = {};
    if (title !== undefined) dataToUpdate.title = title;
    if (description !== undefined) dataToUpdate.description = description;

    const roadmap = await prisma.roadmap.update({
      where: { id },
      data: dataToUpdate,
    });

    return roadmap;
  }

  async delete(id: string) {
    if (!id) {
      throw new Error("ID do roadmap é obrigatório.");
    }

    const roadmapExists = await prisma.roadmap.findUnique({
      where: { id }
    });

    if (!roadmapExists) {
      throw new Error("Roadmap não encontrado.");
    }

    await prisma.roadmap.delete({
      where: { id }
    });

    return { message: "Roadmap deletado com sucesso." };
  }
}
