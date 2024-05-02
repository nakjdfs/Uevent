import express from 'express';
import AccessMiddleware from '../middleware/AccessMiddleware.js';
import { errorHandler } from '../services/ErrorHandlerService.js';
import TicketRouterHandler from '../routersHandlers/TicketRouterHandler.js';

const router = express.Router();

router.get('/:ticketId', AccessMiddleware(["User", "Admin"]), errorHandler(async (req, res) => {return await TicketRouterHandler.getTicket(req, res)}));

export default router;