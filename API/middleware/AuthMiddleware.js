import TokenService from "../services/TokenService.js";
import sessionService from "../services/SessionService.js";
import { generateResponse } from "../services/ErrorHandlerService.js";
import UserController from "../controllers/UserController.js";

export default async function (soft = false) {
    return async function (req, res, next) {
        try {
            const userCode = await TokenService.getUserCodeFromRequest(req);
            const userId = sessionService.getAuthUser(userCode);
            if (!userId) throw "Token is absolete";
            const user = await UserController.getUserById(userId);
            req.user = user;
            req.userCode = userCode;
            next();
        }
        catch (error) {
            if (soft) {
                if (error == "No token provided") {
                    next();
                    return;
                }
            }
            res.status(400).json(generateResponse(error));
            return;
        }
    }
}