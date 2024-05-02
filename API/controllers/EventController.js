import EventModel from "../models/EventModel.js";
import CheckService from "../services/FieldsCheckService.js";
import EventFormatController from "./EventFormatController.js";
import EventFormat from "../db/schemes/EventFormat.js";
import TicketController from "./TicketController.js";
import { EventLogosFolder, EventCoversFolder } from "../middleware/UploadMiddleware.js";

import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

export default class EventController {
    static async getEventModel(data, options = { allowNull: false, byRule: false }) {
        let existingEvent;
        if (options.byRule) {
            existingEvent = await EventModel.getEventByRule(data);
        }
        else {
            existingEvent = await EventModel.getEventById(data)
        }
        if (!existingEvent && !options.allowNull) throw "Event not found";
        return existingEvent;
    }

    static async getEventsByRule(rule) {
        const existingEvent = await EventModel.getEventsByRule(rule);

        return existingEvent;
    }

    static async getSmallEvent(id) {
        let existingEvent = await this.getEventModel({
            attributes: ["id",
                "name",
                "startDate",
                "status",
                "price"
            ],
            where: { id: id }
        }, { byRule: true });

        return existingEvent;
    }

    static async getEvent(id) {
        let existingEvent = await this.getEventModel({
            attributes: ["id",
                "name",
                "description",
                "location",
                "startDate",
                "endDate",
                "status",
                "capacity",
                "occupiedCapacity",
                "price",
                "formatId",
                "companyId"
            ],
            where: { id: id }
        }, { byRule: true });
        // existingEvent = existingEvent.dataValues;

        const format = await EventFormatController.getEventFormat(existingEvent.formatId);
        const coordinates = existingEvent.location.coordinates;
        delete existingEvent['formatId'];
        delete existingEvent['location'];
        existingEvent.format = format;
        existingEvent.coordinates = coordinates

        return existingEvent;
    }

    static async createEvent(eventData) {
        await EventFormatController.getEventFormatModel(eventData.formatId);

        if (!Number.isInteger(eventData.capacity)) throw "Event capacity must be a integer";
        if (eventData.capacity && eventData.capacity <= 0) throw "Event capacity cannot be negative";

        if (typeof eventData.price !== 'number') throw "Event price must be a number";
        if (eventData.price < 0) throw "Price cannot be less than zero"

        if (eventData.coordinates) {
            if (!Array.isArray(eventData.coordinates) || eventData.coordinates.length !== 2) throw "Coordinates must be an array of size 2";
            if (eventData.coordinates.every(coord => typeof coord !== 'number')) throw "Coordinates axis must be a number";
        }

        const parsedStartDate = Date.parse(eventData.startDate);
        if (isNaN(parsedStartDate)) throw "The startDate is not in the correct format";

        const parsedEndDate = Date.parse(eventData.endDate);
        if (isNaN(parsedEndDate)) throw "The endDate is not in the correct format";

        await EventModel.createEvent({
            name: eventData.name,
            description: eventData.description,
            location: eventData.coordinates ? ({ type: 'Point', coordinates: eventData.coordinates }) : null,
            startDate: new Date(parsedStartDate),
            endDate: new Date(parsedEndDate),
            capacity: eventData.capacity,
            price: eventData.price,
            formatId: eventData.formatId,
            companyId: eventData.companyId
        });

        return "Event created successfully";
    }


    static async updateEvent(id, eventData, companyId) {
        const existingEvent = await this.getEventModel(id);

        if (existingEvent.companyId != companyId) throw "Permission denied";

        CheckService.requireNone(["logo", "occupiedCapacity", "status", "companyId"], eventData);
        CheckService.requireAtLeastOne(Object.keys(existingEvent.toJSON()), eventData, ["logo", "occupiedCapacity", "status", "companyId"]);

        existingEvent.update(eventData);

        return "Event successfully updated";
    }

    static async updateEventStatus(id, status) {
        const existingEvent = await this.getEventModel(id);

        if (existingEvent.status == "planning" && status == "upcoming") {
            existingEvent.status = "upcoming";
        }
        else if (existingEvent.status in ["planning", "upcoming"] && status == "cancelled") {
            existingEvent.status = "cancelled";
        }
        else {
            throw "Invalid status";
        }

        await existingEvent.save();

        return "Event status updated successfully";
    }

    static async buyTicket(id, userData) {
        const existingEvent = await this.getEventModel(id);

        if (existingEvent.status != "upcoming") throw "You cannot buy ticket to this event";
        userData.eventId = existingEvent.id;

        if (existingEvent.occupiedCapacity >= existingEvent.capacity) throw "Event full"

        const ticketId = await TicketController.createNewTicket(userData, existingEvent);

        existingEvent.occupiedCapacity += 1;
        existingEvent.save();

        return `Ticket №${ticketId} was sended to your email.`;
    }

    static async setEventLogo(id, filename) {
        const existingEvent = await this.getEventModel(id);

        existingEvent.logo = filename;
        existingEvent.save();
        return "Event logo updated successfully";
    }

    static async getEventLogo(id) {
        const existingEvent = await this.getEventModel(id);

        if (!existingEvent) throw "Event not found";

        return this.getStorageFilePath(EventLogosFolder, existingEvent.logo);
    }

    static async setEventCover(id, filename) {
        const existingEvent = await this.getEventModel(id);

        existingEvent.cover = filename;
        existingEvent.save();
        return "Event cover updated successfully";
    }

    static async getEventCover(id) {
        const existingEvent = await this.getEventModel(id);

        if (!existingEvent) throw "Event not found";

        return this.getStorageFilePath(EventCoversFolder, existingEvent.cover);
    }

    static getStorageFilePath(folderName, fileName) {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);

        const imagePath = path.join(__dirname, `../storage/${folderName}/${fileName}`);
        return imagePath;
    }
}