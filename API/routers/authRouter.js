import express from 'express';
import AccessMiddleware from '../middleware/AccessMiddleware.js'
import { errorHandler } from '../services/ErrorHandlerService.js';
import AuthRoutherHandler from '../routersHandlers/AuthRouterHandler.js';

const router = express.Router();

router.post('/login',                  errorHandler(async (req, res) => {return await AuthRoutherHandler.login(req, res)}));
router.post('/logout', AccessMiddleware(["User", "Admin"]), errorHandler(async (req, res) => {return await AuthRoutherHandler.logout(req, res)}));
router.post('/register',               errorHandler(async (req, res) => {return await AuthRoutherHandler.register(req, res)}));
router.get('/confirm/:code',           errorHandler(async (req, res) => {return await AuthRoutherHandler.confirmEmail(req, res)}));

export default router;