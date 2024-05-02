import UserController from "../controllers/UserController.js";
import { uploadAvatar } from "../middleware/UploadMiddleware.js";
import { generateResponse } from "../services/ErrorHandlerService.js";
import CheckService from "../services/FieldsCheckService.js";
import bcrypt from 'bcrypt';

export default class UserRoutherHandler {
    static async getUser(req, res) {
        const targetUserId = req.params.userId;
        const targetUser = await UserController.getUserById(targetUserId);

        if (!targetUser) throw "User not found"

        return generateResponse('User found', targetUser);
    }

    static async createUser(req, res) {
        CheckService.requireOnly(["login", "email", "password"], req.body);

        const { login, email, password } = req.body;
        const saltRounds = 10;
	    const hashedPassword = await bcrypt.hash(password, saltRounds);
        const result = await UserController.createUser({login: login, email: email, password: hashedPassword});

        return generateResponse(result);
    }

    static async updateUser(req, res) {
        const targetUserId = req.params.userId;
        const isAdmin = req.userRole == "Admin" ? true : false;
        const isSelf = req.user.id == targetUserId ? true : false;

        if (!isSelf && !isAdmin) throw "Permission denied";
        const result = await UserController.updateUser(targetUserId, req.body, isAdmin);

        return generateResponse(result);
    }

    static async deleteUser(req, res) {
        const targetUserId = req.params.userId;
        const isAdmin = req.userRole == "Admin" ? true : false;
        const isSelf = req.user.id == targetUserId ? true : false;

        if (!isSelf && !isAdmin) throw "Permission denied";
        const result = await UserController.deleteUser(targetUserId);

        return generateResponse(result);
    }

    static async getUserAvatar(req, res) {
        const targetUserId = req.params.userId;
        const imagePath = await UserController.getUserAvatar(targetUserId);

        res.sendFile(imagePath);
        return
    }

    static async whoAmI(req, res) {
        const result = await UserController.getUserById(req.user.id);

        return generateResponse("User data", result);
    }

    static async setUserAvatar(req, res) {
        const targetUserId = req.params.userId;
        const isAdmin = req.userRole == "Admin" ? true : false;
        const isSelf = req.user.id == targetUserId ? true : false;

        if (!isSelf && !isAdmin) throw "Permission denied";

        const result = new Promise((resolve, reject) => {
            uploadAvatar(req, res, async (err) => {
                if (err) {
                    reject("Failed to upload avatar");
                    return;
                }
    
                const avatarFilename = req.file.filename;
                try {
                    const result = await UserController.setUserAvatar(targetUserId, avatarFilename);
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            });
        });

        return generateResponse(await result);
    }

    static async getUserTickets(req, res) {
        const targetUserId = req.params.userId;
        const isAdmin = req.userRole == "Admin" ? true : false;
        const isSelf = req.user.id == targetUserId ? true : false;

        if (!isSelf && !isAdmin) throw "Permission denied";
        const result = await UserController.getTickets(targetUserId);

        return generateResponse("User Tickets:", result);
    }
}
