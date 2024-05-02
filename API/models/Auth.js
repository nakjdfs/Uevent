import UserController from "../controllers/UserController.js";
import sessionService from "../services/SessionService.js";
import validator from 'validator';
import { Op } from 'sequelize';
import bcrypt from 'bcrypt';
import crypto from 'crypto';


export default class Auth {
    static async login(login, password) {
        const existingUser = await UserController.getUserByRule({ where: { login: login } });
        if (!existingUser) throw "User not found";
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) throw 'Wrong password';
        let userCode = crypto.randomBytes(16).toString('hex');
        let expiresAt = new Date();
        expiresAt.setTime(expiresAt.getTime() + parseInt(process.env.SESSION_TTL));
        sessionService.addToAuthUsers(userCode, {id: existingUser.id, expiresAt: expiresAt});
        return userCode;
    }

    static async register(login, email, password) {
        const existingUser = await UserController.getUserByRule({ where: { [Op.or]: [ { login: login }, { email: email } ] }});
        if (existingUser) {
            if (existingUser.login === login) throw 'User with this username already exists';
		    else throw 'User with this email already exists';
        }
        
        if (!validator.isEmail(email)) throw 'Email is invalid';
        if (!validator.isStrongPassword(password, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 2, minSymbols: 1 })) {
            throw 'Password is too weak';
        }

        const saltRounds = 10;
	    const hashedPassword = await bcrypt.hash(password, saltRounds);
        let userCode = crypto.randomBytes(16).toString('hex');
        let expiresAt = new Date();
        expiresAt.setTime(expiresAt.getTime() + parseInt(process.env.EMAIL_CODE_TTL));
        sessionService.addToTempUsers(userCode, {expiresAt: expiresAt, userData: {
            login: login,
            email: email,
            password: hashedPassword
        }});
        return userCode;
    }

    static async emailConfirmation(code) {
        const userData = sessionService.getTempUser(code);
        if (!userData) throw "Token is absolute";
        await UserController.createUser(userData);
        sessionService.deleteTempUser(code);
        return "Email confirmed successfuly";
    }

    static async logout(userCode) {
        sessionService.deleteAuthUser(userCode);
        return "You logged out successfully";
    }
}