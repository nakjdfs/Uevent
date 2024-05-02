import CompanyScheme from "../db/schemes/Company.js";

class CompanyModel {
    static async createCompany(company) {
        const createdCompany = await CompanyScheme.create(company);
        return createdCompany;
    }

    static async getCompanyById(id) {
        const company = await CompanyScheme.findByPk(id);
        return company;
    }

    static async getCompanyByRule(rule) {
        const company = await CompanyScheme.findOne(rule);
        return company;
    }

    static async getCompanies() {
        const company = await CompanyScheme.findAll({
            attributes: ["id", "name"]
        });
        return company;
    }
}

export default CompanyModel;