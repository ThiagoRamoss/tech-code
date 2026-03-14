import { Request, Response } from 'express';
import { UserService } from '../services/UserService';

export class UserController {
  async create(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;

      const userService = new UserService();
      
      const user = await userService.create(name, email, password);

      return res.status(201).json(user);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
  async index(req: Request, res: Response) {
    try {
      const userService = new UserService();
      const users = await userService.findAll();

      return res.status(200).json(users);
    } catch (error: any) {
      return res.status(500).json({ error: "Erro interno ao buscar usuários." });
    }
  }

  async show(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const userService = new UserService();
      const user = await userService.findById(id);

      return res.status(200).json(user);
    } catch (error: any) {
      return res.status(404).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const { name, email, password } = req.body;
      const userService = new UserService();
      
      const user = await userService.update(id, name, email, password);

      return res.status(200).json(user);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const userService = new UserService();
      const result = await userService.delete(id);

      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}