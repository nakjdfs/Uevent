import TicketController from "../controllers/TicketController.js";
import { generateResponse } from "../services/ErrorHandlerService.js";

export default class TicketRouterHandler {
    static async getTicket(req, res) {
        const targetTicketId = req.params.ticketId;
        const isAdmin = req.userRole == "Admin" ? true : false;

        const result = await TicketController.getTicket(targetTicketId);

        const isSelf = result.userId == req.user.id ? true : false;
        if (!isAdmin && !isSelf) throw "Permission denied";

        if (!isAdmin) delete result["userId"]

        return generateResponse(result);
    }

}