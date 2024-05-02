import { where } from "sequelize";
import { Op } from 'sequelize';
import EventFormatModel from "../models/EventFormatModel.js";
import CheckService from "../services/FieldsCheckService.js";
import EventController from "./EventController.js";

export default class EventFormatController {
    static async getEventFormatModel(data, options = { allowNull: false, byRule: false }) {
        let existingEventFormat;
        if (options.byRule) {
            existingEventFormat = await EventFormatModel.getEventFormatByRule(data);
        }
        else {
            existingEventFormat = await EventFormatModel.getEventFormatById(data)
        }
        if (!existingEventFormat && !options.allowNull) throw "Event Format not found";
        return existingEventFormat;
    }

    static async getEventFormats() {
        const existingEventFormats = await EventFormatModel.getEventFormatsByRule({});
        const formattedEventFormats = existingEventFormats.map(eventFormat => ({
            id: eventFormat.id,
            name: eventFormat.name
        }));
        return formattedEventFormats;
    }

    static async getEventFormat(id) {
        const existingEventFormat = await this.getEventFormatModel(id);
        return {
            id: existingEventFormat.id,
            name: existingEventFormat.name,
        };
    }

    static async createEventFormat(eventFormatData) {
        const existingEventFormat = await this.getEventFormatModel({ where: { name: eventFormatData.name } }, { byRule: true, allowNull: true });
        if (existingEventFormat) throw 'This Event Format already exists';

        await EventFormatModel.createEventFormat(eventFormatData);
        return "Event Format created successfully";
    }

    static async updateEventFormat(id, eventFormatData, options = { isSystem: false }) {
        const existingEventFormat2 = await this.getEventFormatModel({ where: { name: eventFormatData.name } }, { byRule: true, allowNull: true });
        if (existingEventFormat2 && existingEventFormat2.id != id) throw 'This Event Format already exists';
        
        const existingEventFormat = await this.getEventFormatModel(id);

        if (!options.isSystem) {
            CheckService.requireOnly(["name"], eventFormatData);
        }
        await existingEventFormat.update(eventFormatData);
        return "Event Format changed successfully";
    }

    static async deleteEventFormat(id) {
        const existingEventFormat = await this.getEventFormatModel(id);
        await existingEventFormat.destroy();
        return "Event Format deleted successfully";
    }

    static async getEventByEventFormat(id, isFull=false) {
        const eventsQuery = isFull ? {
            attributes: ['id', 'name', 'startDate', 'status', 'capacity', 'occupiedCapacity'],
            where: { formatId: id }
        } : {
            attributes: ['id', 'name', 'startDate', 'status', 'capacity', 'occupiedCapacity'],
            where: { 
                [Op.and]: {
                    formatId: id,
                    [Op.or]: [
                        { status: "upcoming" },
                        { status: "completed" }
                    ]
                }
            }
        };

        const events = await EventController.getEventsByRule(eventsQuery);

        return events;
    }
}