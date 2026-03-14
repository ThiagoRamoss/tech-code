import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { IdCardController } from '../controllers/IdCardController';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';

const userRoutes = Router();
const userController = new UserController();
const idCardController = new IdCardController();

userRoutes.post('/users', userController.create);
userRoutes.get('/users/:id', userController.show);

userRoutes.get('/users', ensureAuthenticated, userController.index);
userRoutes.put('/users/:id', ensureAuthenticated, userController.update);
userRoutes.delete('/users/:id', ensureAuthenticated, userController.delete);

userRoutes.get('/idcards', idCardController.index);
userRoutes.get('/idcards/:id', idCardController.show);

userRoutes.post('/idcards', ensureAuthenticated, idCardController.create);
userRoutes.put('/idcards/:id', ensureAuthenticated, idCardController.update);
userRoutes.delete('/idcards/:id', ensureAuthenticated, idCardController.delete);

export { userRoutes };