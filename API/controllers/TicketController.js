import TicketModel from "../models/Ticket.js";
import { v4 as uuidv4 } from 'uuid';
import emailService from "../services/EmailService.js";
import EventController from "./EventController.js";
import Event from "../db/schemes/Event.js";

export default class TicketController {
    static async getTicketModel(data, options = { allowNull: false, byRule: false }) {
        let existingTicket;
        if (options.byRule) {
            existingTicket = await TicketModel.getTicketByRule(data);
        }
        else {
            existingTicket = await TicketModel.getTicketById(data)
        }
        if (!existingTicket && !options.allowNull) throw "Ticket not found";
        return existingTicket;
    }

    static async createNewTicket(ticketData, eventData) {
        const ticket = await this.createTicket(ticketData);
        
        const ticketMailData = {
            ticketN: ticket.id, 
            eventName: eventData.name,
            eventStartTime: eventData.startDate,
            userBio: ticketData.fullName,
            ticketCode: ticket.code
        }

        await emailService.sendTicketMail(ticket.email, ticketMailData);

        return ticket.id;
    }

    static async createTicket(ticketData) {
        const code = uuidv4();
        ticketData.code = code;

        const ticket = await TicketModel.createTicket(ticketData);

        return ticket;
    }

    static async getTicket(ticketId) {
        const existingTicket = await this.getTicketModel(ticketId);
        const existingEvent = await EventController.getSmallEvent(existingTicket.eventId);

        const resultTicketData = {
            id: existingTicket.id,
            userBio: existingTicket.fullName,
            code: existingTicket.code,
            email: existingTicket.email,
            price: existingEvent.price,
            startDate: existingEvent.startDate,
            status: existingEvent.status,
            userId: existingTicket.userId,
            event: {
                id: existingEvent.id,
                name: existingEvent.name
            }
        }

        return resultTicketData;
    }

    static async getTicketsByUserId(userId) {
        const tickets = await TicketModel.getTicketsByRule({
            where: { userId: userId },
            include: [{
                model: Event,
                attributes: ['id', 'name', 'price', 'startDate', 'status'],
                as: 'Event'
            }]
        });

        const resultTicketData = tickets.map(ticket => ({
            id: ticket.id,
            price: ticket.Event.price,
            startDate: ticket.Event.startDate,
            status: ticket.Event.status,
            event: {
                id: ticket.Event.id,
                name: ticket.Event.name
            }
        }));


        return resultTicketData;
    }

    static async getTicketByCode(code) {
        const ticket = await this.getTicketModel({
            where: {
                code: code
            }
        }, { byRule: true });

        return ticket;
    }
}