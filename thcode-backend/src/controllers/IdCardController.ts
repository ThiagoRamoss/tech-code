import { Request, Response } from 'express';
import { IdCardService } from '../services/IdCardService';

export class IdCardController {
  async create(req: Request, res: Response) {
    try {
      const { nickname, userId } = req.body;
      const idCardService = new IdCardService();
      const idCard = await idCardService.create(nickname, userId);

      return res.status(201).json(idCard);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async index(req: Request, res: Response) {
    try {
      const idCardService = new IdCardService();
      const idCards = await idCardService.findAll();

      return res.status(200).json(idCards);
    } catch (error: any) {
      return res.status(500).json({ error: "Erro interno ao buscar IdCards." });
    }
  }

  async show(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const idCardService = new IdCardService();
      const idCard = await idCardService.findById(id);

      return res.status(200).json(idCard);
    } catch (error: any) {
      return res.status(404).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const { nickname, level, experience, badges } = req.body;
      const idCardService = new IdCardService();
      
      const idCard = await idCardService.update(id, nickname, level, experience, badges);

      return res.status(200).json(idCard);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const idCardService = new IdCardService();
      const result = await idCardService.delete(id);

      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}