import axios from "axios";
import { getUserFromLocalStorage } from "../store/store";

export default class CompanyService {
    static async getCompanyById(id) {
        const response = await axios.get(`https://localhost:3001/api/companies/${id}`, {});
        return response;
    }

    static async getCompanies() {
        const response = await axios.get(`https://localhost:3001/api/companies/`, {});
        return response;
    }

    static async createCompany(companyData) {
        try {
            const response = await axios.post(`https://localhost:3001/api/companies/`, 
            {
                name: companyData.name,
                email: companyData.email,
                location: companyData.location,
                description: companyData.description
            },
            {
                headers: {
                    'Authorization': `Bearer ${getUserFromLocalStorage().token}`
                }
            });

            return response.data;
        }
        catch (error) {
            return error;
        }
    }

    static async getCompanyEvent(id) {
        console.log(`https://localhost:3001/api/companies/${id}/events`);
        try {
            const response = await axios.get(`https://localhost:3001/api/companies/${id}/events`, 
            {},
            {
                headers: {
                    'Authorization': `Bearer ${getUserFromLocalStorage().token}`
                }
            });

            return response.dataz;
        }
        catch (error) {
            return error;
        }
    }
};