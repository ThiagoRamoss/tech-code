import { Router } from 'express';
import { ContentController } from '../controllers/ContentController';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';

const contentRoutes = Router();
const contentController = new ContentController();

contentRoutes.get('/contents', contentController.index);
contentRoutes.get('/contents/:id', contentController.show);

contentRoutes.post('/contents', ensureAuthenticated, contentController.create);
contentRoutes.put('/contents/:id', ensureAuthenticated, contentController.update);
contentRoutes.delete('/contents/:id', ensureAuthenticated, contentController.delete);

export { contentRoutes };