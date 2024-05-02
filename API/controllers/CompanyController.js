import CompanyModel from "../models/CompanyModel.js";
import UserController from "./UserController.js";
import CheckService from "../services/FieldsCheckService.js";

import { Op } from 'sequelize';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import EventController from "./EventController.js";

export default class CompanyController {
    static async getCompanyModel(data, options = { allowNull: false, byRule: false }) {
        let existingCompany;
        if (options.byRule) {
            existingCompany = await CompanyModel.getCompanyByRule(data);
        }
        else {
            existingCompany = await CompanyModel.getCompanyById(data)
        }
        if (!existingCompany && !options.allowNull) throw "Company not found";
        return existingCompany;
    }

    static async getCompany(id) {
        const company = await this.getCompanyModel(id);

        return {
            id: company.id,
            name: company.name,
            email: company.email,
            location: company.location
        };
    }

    static async getCompanies() {
        const companies = await CompanyModel.getCompanies();
        console.log(companies);

        return companies;
    }


    static async createCompany(company, options = { isSystem: false }) {
        const existingCompany = await this.getCompanyModel({
            where: { [Op.or]: [ 
                    { name: company.name }, 
                    { email: company.email } 
                ] }
            }, 
            { allowNull: true, byRule: true }
        );
        if (existingCompany) {
            if (existingCompany.name == company.name) throw 'Company with this name already exists';
		    else throw 'Company with this email already exists';
        }
        const result = await CompanyModel.createCompany(company);
        return options.isSystem ? result : "Company created successfully";
    }

    static async updateCompany(id, companyData, options = { isSystem: false }) {
        const existingCompany = await this.getCompanyModel(id);
        if (!options.isSystem) {
            CheckService.isUnknown(Object.keys(existingCompany.toJSON()), companyData);
            CheckService.requireNone([], companyData);
            // CheckService.requireNone(["password", "email"], companyData);
            CheckService.requireAtLeastOne(Object.keys(existingCompany.toJSON()), companyData, ["logo"]);
        }
        await existingCompany.update(companyData);
        return "Company changed successfully";
    }

    static async deleteCompany(id) {
        const existingCompany = await this.getCompanyModel(id);
        await existingCompany.destroy();
        return "Company deleted successfully";
    }

    static async getCompanyLogo(id) {
        const existingCompany = await this.getCompanyModel(id);

        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);
    
        const imagePath = path.join(__dirname, `../storage/CompanyLogos/${existingCompany.logo}`);
        return imagePath;
    }

    static async setCompanyLogo(id, filename) {
        const existingCompany = await this.getCompanyModel(id);

        if (existingCompany.logo != "default.jpg") {
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = dirname(__filename);
    
            const imagePath = path.join(__dirname, `../storage/CompanyLogos/${existingCompany.logo}`);
            unlink(imagePath, (err) => {
                if (err) throw "Error deleting old logo";
            });
        }

        existingCompany.logo = filename;
        existingCompany.save();
        return "Logo updated successfully";
    }

    static async addUserToCompany(companyId, userId) {
        const result = await UserController.setCompanyId(userId, companyId);
        return result;
    }

    static async createNewCompany(data, userId) {
        const company = await this.createCompany(data, { isSystem: true });
        await this.addUserToCompany(company.id, userId);
        return "New Company created successfully";
    }

    static async getCompanyUsers(companyId) {
        const Users = UserController.getUsersByRule({ 
            attributes: ['id', 'login'],
            where: { companyId: companyId } 
        });
        if (!Users) throw "WTF! Empty Company??";

        return Users;
    }

    static async getCompanyEvents(companyId, isFull=false) {
        const eventsQuery = isFull ? {
            attributes: ['id', 'name', 'startDate', 'status', 'capacity', 'occupiedCapacity'],
            where: { companyId: companyId }
        } : {
            attributes: ['id', 'name', 'startDate', 'status', 'capacity', 'occupiedCapacity'],
            where: { 
                [Op.and]: {
                    companyId: companyId,
                    [Op.or]: [
                        { status: "upcoming" },
                        { status: "completed" }
                    ]
                }
            }
        };

        const events = await EventController.getEventsByRule(eventsQuery);

        return events;
    }
}