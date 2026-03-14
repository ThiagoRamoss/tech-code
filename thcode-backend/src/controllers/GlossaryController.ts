import { Request, Response } from 'express';
import { GlossaryService } from '../services/GlossaryService';

export class GlossaryController {
  async create(req: Request, res: Response) {
    try {
      const { term, definition } = req.body;
      const glossaryService = new GlossaryService();
      const glossaryItem = await glossaryService.create(term, definition);

      return res.status(201).json(glossaryItem);

    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
  async index(req: Request, res: Response) {
    try {
      const glossaryService = new GlossaryService();
      const glossaries = await glossaryService.findAll();

      return res.status(200).json(glossaries);
    
    } catch (error: any) {
      return res.status(500).json({ error: "Erro interno ao buscar o glossário." });
    }
  }

  async show(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const glossaryService = new GlossaryService();
      const glossaryItem = await glossaryService.findById(id);

      return res.status(200).json(glossaryItem);
    } catch (error: any) {
      return res.status(404).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const { term, definition } = req.body;
      const glossaryService = new GlossaryService();
      
      const glossaryItem = await glossaryService.update(id, term, definition);

      return res.status(200).json(glossaryItem);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const glossaryService = new GlossaryService();
      const result = await glossaryService.delete(id);

      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
