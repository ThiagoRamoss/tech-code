import { Router } from 'express';
import { RoadmapController } from '../controllers/RoadmapController';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';

const roadmapRoutes = Router();
const roadmapController = new RoadmapController();

roadmapRoutes.get('/roadmaps', roadmapController.index);
roadmapRoutes.get('/roadmaps/:id', roadmapController.show);

roadmapRoutes.post('/roadmaps', ensureAuthenticated, roadmapController.create);
roadmapRoutes.put('/roadmaps/:id', ensureAuthenticated, roadmapController.update);
roadmapRoutes.delete('/roadmaps/:id', ensureAuthenticated, roadmapController.delete);

export { roadmapRoutes };