import EventController from "../controllers/EventController.js";
import CheckService from "../services/FieldsCheckService.js";
import { generateResponse } from "../services/ErrorHandlerService.js";
import CompanyController from "../controllers/CompanyController.js";
import EventFormatController from "../controllers/EventFormatController.js";
import validator from 'validator';
import TicketController from "../controllers/TicketController.js";
import { uploadEventLogo, uploadEventCover } from "../middleware/UploadMiddleware.js";

export default class EventHandler {

    static async getEvent(req, res) {
        const targetEventId = req.params.eventId;
        const isAdmin = req.userRole == "Admin" ? true : false;

        const result = await EventController.getEvent(targetEventId);

        if (result.status in ["planning", "cancelled"] && !isAdmin) {
            if (req.userRole != "User") throw "Permission denied";
            if (req.user.companyId != result.companyId) throw "Permission denied";
        }

        return generateResponse("Event Data:", result);
    }


    static async createEvent(req, res) {
        const isAdmin = req.userRole == "Admin" ? true : false;

        if (!isAdmin && !(req.user.companyId)) throw "Permission denied";
        if (isAdmin && !(req.body.companyId)) throw "Field 'companyId' is required";
        const targetCompanyId = isAdmin ? req.body.companyId : req.user.companyId;

        CheckService.requireAll(["name", "description", "coordinates", "startDate", "endDate", "capacity", "price", "formatId"], req.body);
        const { name, description, coordinates, startDate, endDate, capacity, formatId, price} = req.body

        if (isAdmin) await CompanyController.getCompanyModel(targetCompanyId);
        await EventFormatController.getEventFormatModel(formatId);

        const eventData = {
            name:        name,
            description: description,
            coordinates: coordinates,
            startDate:   startDate,
            endDate:     endDate,
            capacity:    capacity,
            price:       price,
            formatId:    formatId,
            companyId:   targetCompanyId
        }

        const result = await EventController.createEvent(eventData);

        return generateResponse(result);
    }

    static async updateEvent(req, res) {
        const targetEventId = req.params.eventId;
        const isAdmin = req.userRole == "Admin" ? true : false;

        if (!isAdmin && !(req.user.companyId)) throw "Permission denied";
        if (isAdmin && !(req.body.companyId)) throw "Field 'companyId' is required";
        const targetCompanyId = isAdmin ? req.body.companyId : req.user.companyId;

        const result = await EventController.updateEvent(targetEventId, req.body, targetCompanyId);

        return generateResponse(result);
    }

    static async updateEventStatus(req, res) {
        const targetEventId = req.params.eventId;

        CheckService.requireOnly(["status"], req.body);
        const { status } = req.body;
        const result = await EventController.updateEventStatus(targetEventId, status);
        
        return generateResponse(result);
    }

    static async buyTicket(req, res) {
        const targetEventId = req.params.eventId;
        const targetUserId = req.user ? req.user.id : null;

        CheckService.requireOnly(["fullName", "email"], req.body);
        const { fullName, email } = req.body;

        if (!validator.isEmail(email)) throw 'Email is invalid';

        const result = await EventController.buyTicket(targetEventId, { userId: targetUserId, fullName: fullName, email: email });

        return generateResponse(result);
    }

    static async validateTicket(req, res) {
        const targetEventId = req.params.eventId;
        const targetTicketCode = req.params.code;

        const ticket = await TicketController.getTicketByCode(targetTicketCode);

        if (ticket.eventId != targetEventId) throw "Ticket not found";

        return generateResponse("Ticket validated successfully", { fullName: ticket.fullName });
    }

    static async setEventLogo(req, res) {
        const targetEventId = req.params.eventId;
        const isAdmin = req.userRole == "Admin" ? true : false;

        if (!isAdmin) throw "Permission denied";

        const result = new Promise((resolve, reject) => {
            uploadEventLogo(req, res, async (err) => {
                if (err) {
                    reject("Failed to upload event logo");
                    return;
                }
    
                const avatarFilename = req.file.filename;
                try {
                    const result = await EventController.setEventLogo(targetEventId, avatarFilename);
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            });
        });

        return generateResponse(await result);
    }

    static async getEventLogo(req, res) {
        const targetEventId = req.params.eventId;
        const imagePath = await EventController.getEventLogo(targetEventId);

        res.sendFile(imagePath);
        return
    }

    static async setEventCover(req, res) {
        const targetEventId = req.params.eventId;
        const isAdmin = req.userRole == "Admin" ? true : false;

        if (!isAdmin) throw "Permission denied";

        const result = new Promise((resolve, reject) => {
            uploadEventCover(req, res, async (err) => {
                if (err) {
                    reject("Failed to upload event cover");
                    return;
                }
    
                const coverFilename = req.file.filename;
                try {
                    const result = await EventController.setEventCover(targetEventId, coverFilename);
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            });
        });

        return generateResponse(await result);
    }

    static async getEventCover(req, res) {
        const targetEventId = req.params.eventId;
        const imagePath = await EventController.getEventCover(targetEventId);

        res.sendFile(imagePath);
        return
    }
}