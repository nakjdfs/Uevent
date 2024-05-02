import CompanyController from "../controllers/CompanyController.js";
import UserController from "../controllers/UserController.js";
import { uploadLogo } from "../middleware/UploadMiddleware.js";
import { generateResponse } from "../services/ErrorHandlerService.js";
import CheckService from "../services/FieldsCheckService.js";
import bcrypt from 'bcrypt';

export default class CompanyRoutherHandler {
    static async getCompany(req, res) {
        const targetCompanyId = req.params.companyId;

        const result = await CompanyController.getCompany(targetCompanyId);

        return generateResponse("Company data:", result);
    }

    static async getCompanies(req, res) {
        const result = await CompanyController.getCompanies();

        return generateResponse("Companies data:", result);
    }

    static async createCompany(req, res) {
        CheckService.requireOnly(["name", "email", "description", "location"], req.body);
        const { name, email, description, location } = req.body;
        let data = { name: name, email: email, description: description, location: location }

        const result = await CompanyController.createNewCompany(data, req.user.id);
        return generateResponse(result);
    }

    static async updateCompany(req, res) {
        const targetCompanyId = req.params.companyId;
        const isAdmin = req.userRole == "Admin" ? true : false;
        const isHaveAccess = req.user.companyId == targetCompanyId ? true : false;

        if (!isHaveAccess && !isAdmin) throw "Permission denied";
        CheckService.requireNone([], req.body);
        const result = await CompanyController.updateCompany(targetCompanyId, req.body);

        return generateResponse(result);
    }

    static async deleteCompany(req, res) {
        const targetCompanyId = req.params.companyId;
        const isAdmin = req.userRole == "Admin" ? true : false;
        const isHaveAccess = req.user.companyId == targetCompanyId ? true : false;

        // clear user with this company

        if (!isHaveAccess && !isAdmin) throw "Permission denied";
        const result = await CompanyController.deleteCompany(targetCompanyId);

        return generateResponse(result);
    }



    static async getUsers(req, res) {
        const targetCompanyId = req.params.companyId;
        const result = await CompanyController.getCompanyUsers(targetCompanyId);
        
        return generateResponse("Company Users:", result);
    }

    static async addUserToCompany(req, res) {
        const targetCompanyId = req.params.companyId;
        const isAdmin = req.userRole == "Admin" ? true : false;
        const isHaveAccess = req.user.companyId == targetCompanyId ? true : false;
        if (!isHaveAccess && !isAdmin) throw "Permission denied";

        CheckService.requireOnly(["userId"], req.body);

        const { userId } = req.body;
        
        const result = await UserController.setCompanyId(userId, targetCompanyId);
        return generateResponse(result);
    }

    static async deleteUserFromCompany(req, res) {
        const targetCompanyId = req.params.companyId;
        const isAdmin = req.userRole == "Admin" ? true : false;
        const isHaveAccess = req.user.companyId == targetCompanyId ? true : false;
        if (!isHaveAccess && !isAdmin) throw "Permission denied";

        CheckService.requireOnly(["userId"], req.body);

        const { userId } = req.body;

        const result = await UserController.delCompanyId(userId, targetCompanyId);
        return generateResponse(result);
    }



    static async getCompanyEvents(req, res) {
        const targetCompanyId = req.params.companyId;
        const isAdmin = req.userRole == "Admin" ? true : false;
        const isHaveAccess = !req.user ? false : req.user.companyId == targetCompanyId ? true : false;
        const isFull = isAdmin || isHaveAccess; 

        const result = await CompanyController.getCompanyEvents(targetCompanyId, isFull);
        return generateResponse("Events:", result);
    }

    static async getCompanyLogo(req, res) {
        const targetCompanyId = req.params.companyId;
        const imagePath = await CompanyController.getCompanyLogo(targetCompanyId);

        res.sendFile(imagePath);
        return
    }

    static async setCompanyAvatar(req, res) {
        const targetCompanyId = req.params.companyId;
        const isAdmin = req.userRole == "Admin" ? true : false;
        const isHaveAccess = req.user.companyId == targetCompanyId ? true : false;
        if (!isHaveAccess && !isAdmin) throw "Permission denied";

        const result = new Promise((resolve, reject) => {
            uploadLogo(req, res, async (err) => {
                if (err) {
                    reject("Failed to upload logo");
                    return;
                }
    
                const logoFilename = req.file.filename;
                try {
                    const result = await CompanyController.setCompanyLogo(targetCompanyId, logoFilename);
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            });
        });

        return generateResponse(await result);
    }

}