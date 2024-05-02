import axios from "axios";
import { getUserFromLocalStorage } from "../store/store";

export default class EventService {
    static async getEventById(id) {
        const response = await axios.get(`https://localhost:3001/api/events/${id}`, {});
        return response;
    }

    static async getCompanies() {
        const response = await axios.get(`https://localhost:3001/api/events/`, {});
        return response;
    }

    static async buyTicket (id, fullName, email) {
        try {
            const response = await axios.post(`https://localhost:3001/api/events/${id}/buy`, 
            {
                fullName: fullName,
                email: email,
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

    static async createEvent(eventData) {
        try {
            const response = await axios.post(`https://localhost:3001/api/events/`, 
            {
                name: eventData.name,
                description: eventData.description,
                startDate: eventData.startTime,
                coordinates: [0, 0],
                endDate: eventData.endTime,
                capacity: parseInt(eventData.capacity),
                price: parseFloat(eventData.price),
                formatId: 1,
                companyId: eventData.companyId,
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
};