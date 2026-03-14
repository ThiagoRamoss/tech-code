import { prisma } from '../lib/prisma';

export class GlossaryService {
  
  async create(term: string, definition: string) {
    if (!term || !definition) {
      throw new Error("O termo e a definição são obrigatórios para o Glossário.");
    }
    const glossaryItem = await prisma.glossary.create({
      data: {
        term: term,
        definition: definition,
      },
    });

    return glossaryItem;
  }

  async findAll() {
    const glossaries = await prisma.glossary.findMany({
      orderBy: {
        term: 'asc', 
      },
    });

    return glossaries; 
  }

  async findById(id: string) {
    if (!id) {
      throw new Error("ID do termo é obrigatório.");
    }

    const glossaryItem = await prisma.glossary.findUnique({
      where: { id }
    });

    if (!glossaryItem) {
      throw new Error("Termo não encontrado no glossário.");
    }

    return glossaryItem;
  }

  async update(id: string, term?: string, definition?: string) {
    if (!id) {
      throw new Error("ID do termo é obrigatório para atualização.");
    }

    const itemExists = await prisma.glossary.findUnique({
      where: { id }
    });

    if (!itemExists) {
      throw new Error("Termo não encontrado no glossário.");
    }

    if (term && term !== itemExists.term) {
      const termExists = await prisma.glossary.findUnique({
        where: { term }
      });
      if (termExists) {
        throw new Error("Este termo já existe no glossário.");
      }
    }

    const dataToUpdate: any = {};
    if (term !== undefined) dataToUpdate.term = term;
    if (definition !== undefined) dataToUpdate.definition = definition;

    const glossaryItem = await prisma.glossary.update({
      where: { id },
      data: dataToUpdate,
    });

    return glossaryItem;
  }

  async delete(id: string) {
    if (!id) {
      throw new Error("ID do termo é obrigatório.");
    }

    const itemExists = await prisma.glossary.findUnique({
      where: { id }
    });

    if (!itemExists) {
      throw new Error("Termo não encontrado no glossário.");
    }

    await prisma.glossary.delete({
      where: { id }
    });

    return { message: "Termo deletado com sucesso." };
  }
}