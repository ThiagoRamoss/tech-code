import { Router } from 'express';
import { GlossaryController } from '../controllers/GlossaryController';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';

const glossaryRoutes = Router();
const glossaryController = new GlossaryController();

glossaryRoutes.get('/glossary', glossaryController.index);
glossaryRoutes.get('/glossary/:id', glossaryController.show);

glossaryRoutes.post('/glossary', ensureAuthenticated, glossaryController.create);
glossaryRoutes.put('/glossary/:id', ensureAuthenticated, glossaryController.update);
glossaryRoutes.delete('/glossary/:id', ensureAuthenticated, glossaryController.delete);

export { glossaryRoutes };