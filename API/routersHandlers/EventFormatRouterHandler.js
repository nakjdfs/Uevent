import EventFormatController from "../controllers/EventFormatController.js";
import CheckService from "../services/FieldsCheckService.js";
import { generateResponse } from "../services/ErrorHandlerService.js";

export default class EventFormatHandler {
    static async getEventByEventFormat(req, res) {
        const targetEventFormatId = req.params.eventFormatId;
        const isAdmin = req.userRole == "Admin" ? true : false;

        const result = await EventFormatController.getEventByEventFormat(targetEventFormatId, isAdmin);
        return generateResponse("Events:", result);
    }

    static async getEventFormats(req, res) {
        const result = await EventFormatController.getEventFormats();

        return generateResponse("Event Formats:", result);
    }

    static async getEventFormat(req, res) {
        const targetEventFormatId = req.params.eventFormatId;
        
        CheckService.requireNone([], req.body);
        const result = await EventFormatController.getEventFormat(targetEventFormatId, req.body);

        return generateResponse("Event Format:" ,result);
    }

    static async createEventFormats(req, res) {
        CheckService.requireOnly(["name"], req.body);
        const result = await EventFormatController.createEventFormat({ name: req.body.name });

        return generateResponse(result);
    }

    static async updateEventFormats(req, res) {
        const targetEventFormatId = req.params.eventFormatId;
        
        CheckService.requireNone([], req.body);
        const result = await EventFormatController.updateEventFormat(targetEventFormatId, req.body);

        return generateResponse(result);
    }

    static async deleteEventFormats(req, res) {
        const targetEventFormatId = req.params.eventFormatId;
        const result = await EventFormatController.deleteEventFormat(targetEventFormatId);

        return generateResponse(result);
    }
}