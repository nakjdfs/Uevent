import express from 'express';
import AccessMiddleware from '../middleware/AccessMiddleware.js';
import { errorHandler } from '../services/ErrorHandlerService.js';
import UserRouterHandler from '../routersHandlers/UserRouterHandler.js';

const router = express.Router();

router.get('/whoAmI',          AccessMiddleware(["User", "Admin"]), errorHandler(async (req, res) => {return await UserRouterHandler.whoAmI(req, res)}));
router.get('/:userId',         AccessMiddleware(),                  errorHandler(async (req, res) => {return await UserRouterHandler.getUser(req, res)}));
router.get('/:userId/tickets', AccessMiddleware(["User", "Admin"]), errorHandler(async (req, res) => {return await UserRouterHandler.getUserTickets(req, res)}));
router.post('/',               AccessMiddleware(["Admin"]),         errorHandler(async (req, res) => {return await UserRouterHandler.createUser(req, res)}));
router.patch('/:userId',       AccessMiddleware(["User", "Admin"]), errorHandler(async (req, res) => {return await UserRouterHandler.updateUser(req, res)}));
router.delete('/:userId',      AccessMiddleware(["User", "Admin"]), errorHandler(async (req, res) => {return await UserRouterHandler.deleteUser(req, res)}));
router.get('/:userId/avatar',                                       errorHandler(async (req, res) => {return await UserRouterHandler.getUserAvatar(req, res)}));
router.post('/:userId/avatar', AccessMiddleware(["User", "Admin"]), errorHandler(async (req, res) => {return await UserRouterHandler.setUserAvatar(req, res)}));

export default router;
