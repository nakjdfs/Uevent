import EventFormatShceme from "../db/schemes/EventFormat.js";

class EventFormatModel {
    static async createEventFormat(eventFormat) {
        const createdEventFormat = await EventFormatShceme.create(eventFormat);
        return createdEventFormat;
    }

    static async getEventFormatById(id) {
        const eventFormat = await EventFormatShceme.findByPk(id);
        return eventFormat;
    }

    static async getEventFormatByRule(rule) {
        const eventFormat = await EventFormatShceme.findOne(rule);
        return eventFormat;
    }

    static async getEventFormatsByRule(rule) {
        const eventFormat = await EventFormatShceme.findAll(rule);
        return eventFormat;
    }
}

export default EventFormatModel;