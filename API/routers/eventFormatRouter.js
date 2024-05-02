import express from 'express';
import AccessMiddleware from '../middleware/AccessMiddleware.js';
import { errorHandler } from '../services/ErrorHandlerService.js';
import EventFormatHandler from '../routersHandlers/EventFormatRouterHandler.js';

const router = express.Router();

router.get('/',                                                   errorHandler(async (req, res) => {return await EventFormatHandler.getEventFormats(req, res)}));
router.get('/:eventFormatId',                                     errorHandler(async (req, res) => {return await EventFormatHandler.getEventFormat(req, res)}));
router.post('/',                     AccessMiddleware(["Admin"]), errorHandler(async (req, res) => {return await EventFormatHandler.createEventFormats(req, res)}));
router.patch('/:eventFormatId',      AccessMiddleware(["Admin"]), errorHandler(async (req, res) => {return await EventFormatHandler.updateEventFormats(req, res)}));
router.delete('/:eventFormatId',     AccessMiddleware(["Admin"]), errorHandler(async (req, res) => {return await EventFormatHandler.deleteEventFormats(req, res)}));
router.get('/:eventFormatId/events', AccessMiddleware(),          errorHandler(async (req, res) => {return await EventFormatHandler.getEventByEventFormat(req, res)}));

export default router;