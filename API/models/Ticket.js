import TicketScheme from "../db/schemes/Ticket.js";

class TicketModel {
    static async createTicket(ticket) {
        const createdTicket = await TicketScheme.create(ticket);
        return createdTicket;
    }

    static async getTicketById(id) {
        const ticket = await TicketScheme.findByPk(id);
        return ticket;
    }

    static async getTicketByRule(rule) {
        const ticket = await TicketScheme.findOne(rule);
        return ticket;
    }

    static async getTicketsByRule(rule) {
        const tickets = await TicketScheme.findAll(rule);
        return tickets;
    }
}

export default TicketModel;