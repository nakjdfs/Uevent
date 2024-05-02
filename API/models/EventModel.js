import EventScheme from "../db/schemes/Event.js";

class EventModel {
    static async createEvent(event) {
        const createdEvent = await EventScheme.create(event);
        return createdEvent;
    }

    static async getEventById(id) {
        const event = await EventScheme.findByPk(id);
        return event;
    }

    static async getEventByRule(rule) {
        const event = await EventScheme.findOne(rule);
        return event;
    }

    static async getEventsByRule(rule) {
        const event = await EventScheme.findAll(rule);
        return event;
    }
}

export default EventModel;