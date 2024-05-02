import { generateResponse } from "../services/ErrorHandlerService.js";

export default async function (roles) {
    return async function (req, res, next) {
        try {
            const user = req.user;
            const userRole = user ? user.role : "Quest";
            req.userRole = userRole;
            const findedRoles = roles.includes(userRole);
            
            if (!findedRoles) throw "Permission denied";
            next();
        }
        catch (error) {
            res.status(400).json(generateResponse(error));
            return;
        }
    }
}