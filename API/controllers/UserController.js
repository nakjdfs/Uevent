import CheckService from "../services/FieldsCheckService.js";
import UserModel from "../models/UserModel.js"
import { Op } from 'sequelize';
import { unlink } from "fs";

import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import TicketController from "./TicketController.js";

export default class UserController {
    static async getUserById(id, full = false) {
        const existingUser = await UserModel.getUserById(id);
        if (!existingUser) return;
        if (full) return existingUser;
        return {
            id: existingUser.id,
            login: existingUser.login,
            email: existingUser.email,
            companyId: existingUser.companyId,
            role: existingUser.role
        };
    }

    static async getUserByRule(rule) {
        const existingUser = await UserModel.getUserByRule(rule);
        return existingUser;
    }

    static async getUsersByRule(rule) {
        const existingUsers = await UserModel.getUsersByRule(rule);
        return existingUsers;
    }

    static async createUser(user) {
        const existingUser = await UserModel.getUserByRule({ where: { [Op.or]: [ { login: user.login }, { email: user.email } ] }});
        if (existingUser) {
            if (existingUser.login == user.login) throw 'User with this username already exists';
		    else throw 'User with this email already exists';
        }
        await UserModel.createUser(user);
        return "User created successfully";
    }

    static async updateUser(id, userData, isAdmin, isSystem = false) {
        const existingUser = await UserModel.getUserById(id);
        if (!existingUser) throw "User not found";
        if (!isSystem) {
            CheckService.isUnknown(Object.keys(existingUser.toJSON()), userData);
            CheckService.requireNone(["companyId", "role"], userData, isAdmin);
            CheckService.requireNone(["password", "email"], userData);
            CheckService.requireAtLeastOne(Object.keys(existingUser.toJSON()), userData, ["avatar"]);
        }
        // check if new login / mail is already taken

        await existingUser.update(userData);

        return "User changed successfully";
    }

    static async deleteUser(id) {
        const existingUser = await UserModel.getUserById(id);
        if (!existingUser) throw "User not found";
        await existingUser.destroy();
        return "User deleted successfully";
    }

    static async getUserAvatar(id) {
        const existingUser = await UserModel.getUserById(id);
        if (!existingUser) throw "User not found";

        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);
    
        const imagePath = path.join(__dirname, `../storage/UserAvatars/${existingUser.avatar}`);
        return imagePath;
    }

    static async setUserAvatar(id, filename) {
        const existingUser = await UserModel.getUserById(id);
        if (!existingUser) throw "User not found";

        if (existingUser.avatar != "default.jpg") {
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = dirname(__filename);
    
            const imagePath = path.join(__dirname, `../storage/UserAvatars/${existingUser.avatar}`);
            unlink(imagePath, (err) => {
                if (err) throw "Error deleting old avatar";
            });
        }

        existingUser.avatar = filename;
        existingUser.save();
        return "Avatar updated successfully";
    }

    static async setCompanyId(id, companyId) {
        const existingUser = await UserModel.getUserById(id);
        if (!existingUser) throw "User not found";

        if (existingUser.companyId) throw "User already have company";
        existingUser.companyId = companyId;
        existingUser.save();
        return "User company setted successfully";
    }

    static async delCompanyId(id, companyId) {
        const existingUser = await UserModel.getUserById(id);
        if (!existingUser) throw "User not found";

        if (existingUser.companyId != companyId) throw "User belongs to another company";
        existingUser.companyId = null;
        existingUser.save();
        return "User company deleted successfully";
    }
    // static async getCompanyId(id) {
    //     const existingUser = await UserModel.getUserById(id);
    //     if (!existingUser) throw "User not found";


    // }

    static async getTickets(id) {
        const existingUser = await UserModel.getUserById(id);
        if (!existingUser) throw "User not found";

        const tickets = await TicketController.getTicketsByUserId(id);

        return tickets;
    }
}