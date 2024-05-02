import { generateResponse } from "../services/ErrorHandlerService.js";
import CheckService from "../services/FieldsCheckService.js";
import TokenService from "../services/TokenService.js";
import emailService from "../services/EmailService.js";
import Auth from "../models/Auth.js";

export default class AuthRoutherHandler {
    static async login(req, res) {
        CheckService.requireOnly(["login", "password"], req.body);

        const {login, password} = req.body;
        const userCode = await Auth.login(login, password);
        const token = TokenService.createToken(userCode);

        return generateResponse("You have successfully logged in", {token: token});
    }
    
    static async register(req, res) {
        CheckService.requireOnly(["login", "email", "password", "confirmPassword"], req.body);

        const {login, email, password, confirmPassword} = req.body;
        if (password != confirmPassword) throw "Passwords mismatch";

        const userCode = await Auth.register(login, email, password);
        emailService.sendMail(email, userCode);

        return generateResponse("Confirmation token was sended to your email");
    }

    static async confirmEmail(req, res) {
        const confirmCode = req.params.code;
        const result = await Auth.emailConfirmation(confirmCode);
        return generateResponse(result);
    }

    static async logout(req, res) {
        const result = await Auth.logout(req.userCode);
        return generateResponse(result);
    }
}