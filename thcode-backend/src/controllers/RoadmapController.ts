import { Request, Response } from 'express';
import { RoadmapService } from '../services/RoadmapService';

export class RoadmapController {
    async create(req: Request, res: Response) {
        try {
            const { title, description } = req.body;
            const roadmapService = new RoadmapService();
            const roadmap = await roadmapService.create(title, description);

            return res.status(201).json(roadmap);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
    async index(req: Request, res: Response) {
    try {
      const roadmapService = new RoadmapService();
      const roadmaps = await roadmapService.findAll();

      return res.status(200).json(roadmaps);
      
    } catch (error: any) {
      return res.status(500).json({ error: "Erro ao procurar roadmaps." });
    }
  }

  async show(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const roadmapService = new RoadmapService();
      const roadmap = await roadmapService.findById(id);

      return res.status(200).json(roadmap);
    } catch (error: any) {
      return res.status(404).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const { title, description } = req.body;
      const roadmapService = new RoadmapService();
      
      const roadmap = await roadmapService.update(id, title, description);

      return res.status(200).json(roadmap);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const roadmapService = new RoadmapService();
      const result = await roadmapService.delete(id);

      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
