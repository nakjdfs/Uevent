import express from 'express';
import AccessMiddleware from '../middleware/AccessMiddleware.js';
import { errorHandler } from '../services/ErrorHandlerService.js';
import EventRouterHandler from '../routersHandlers/EventRouterHandler.js';

const router = express.Router();

router.get('/:eventId',                AccessMiddleware(),                  errorHandler(async (req, res) => {return await EventRouterHandler.getEvent(req, res)}));
router.get('/:eventId/validate/:code', AccessMiddleware(),                  errorHandler(async (req, res) => {return await EventRouterHandler.validateTicket(req, res)}));
router.post('/:eventId/buy',           AccessMiddleware(),                  errorHandler(async (req, res) => {return await EventRouterHandler.buyTicket(req, res)}));
router.post('/',                       AccessMiddleware(["User", "Admin"]), errorHandler(async (req, res) => {return await EventRouterHandler.createEvent(req, res)}));
router.patch('/:eventId',              AccessMiddleware(["User", "Admin"]), errorHandler(async (req, res) => {return await EventRouterHandler.updateEvent(req, res)}));
router.patch('/:eventId/status',       AccessMiddleware(["User", "Admin"]), errorHandler(async (req, res) => {return await EventRouterHandler.updateEventStatus(req, res)}));
router.post('/:eventId/logo',          AccessMiddleware(["User", "Admin"]), errorHandler(async (req, res) => {return await EventRouterHandler.setEventLogo(req, res)}));
router.get('/:eventId/logo',                                                errorHandler(async (req, res) => {return await EventRouterHandler.getEventLogo(req, res)}));
router.post('/:eventId/cover',          AccessMiddleware(["User", "Admin"]), errorHandler(async (req, res) => {return await EventRouterHandler.setEventCover(req, res)}));
router.get('/:eventId/cover',                                                errorHandler(async (req, res) => {return await EventRouterHandler.getEventCover(req, res)}));

export default router;