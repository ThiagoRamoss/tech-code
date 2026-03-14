import { Request, Response } from 'express';
import { ContentService } from '../services/ContentService';

export class ContentController {
  async create(req: Request, res: Response) {
    try {
      const { title, body, roadmapId } = req.body;

      const contentService = new ContentService();
      const content = await contentService.create(title, body, roadmapId);

      return res.status(201).json(content);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
  async index(req: Request, res: Response) {
    try {
      const contentService = new ContentService();
      const contents = await contentService.findAll();

      return res.status(200).json(contents);
    } catch (error: any) {
      return res.status(500).json({ error: "Erro interno ao buscar conteúdos." });
    }
  }

  async show(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const contentService = new ContentService();
      const content = await contentService.findById(id);

      return res.status(200).json(content);
    } catch (error: any) {
      return res.status(404).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const { title, body, roadmapId } = req.body;
      const contentService = new ContentService();
      
      const content = await contentService.update(id, title, body, roadmapId);

      return res.status(200).json(content);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const contentService = new ContentService();
      const result = await contentService.delete(id);

      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}