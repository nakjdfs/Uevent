import axios from "axios";
import { getUserFromLocalStorage } from "../store/store";

export default class UsersService {
    static async getUserById(id) {
        const response = await axios.get(`https://localhost:3001/api/users/${id}`, {});
        return response;
    }

    static async WhoAmI(token) {
        const response = await axios.get(`https://localhost:3001/api/users/whoAmI`, 
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        return response.data.data;
    }

    static async createUser(login, email, password) {
        try {
            const response = await axios.post(`https://localhost:3001/api/users/`, 
            {
                login: login,
                email:email,
                password:password
            },
            {
                headers: {
                    'Authorization': `Bearer ${getUserFromLocalStorage().token}`
                }
            });
            const posts = response.data.data;
            return posts;
        }
        catch (error) {
            return [];
        }
    }

    static async updateUser(userId, login ,fullName) {
        try {
            const response = await axios.patch(`https://localhost:3001/api/users/${userId}`, 
            {
                login: login,
                fullName:fullName
            },
            {
                headers: {
                    'Authorization': `Bearer ${getUserFromLocalStorage().token}`
                }
            });
            const posts = response.data.data;
            return posts;
        }
        catch (error) {
            return [];
        }
    }

    static async deleteUser(userId) {
        try {
            const response = await axios.delete(`https://localhost:3001/api/users/${userId}`, 
            {},
            {
                headers: {
                    'Authorization': `Bearer ${getUserFromLocalStorage().token}`
                }
            });
            const posts = response.data.data;
            return posts;
        }
        catch (error) {
            return [];
        }
    }
    static async getUserAvatar(userId) {
        try {
            const response = await axios.get(`https://localhost:3001/api/users/${userId}/avatar`, 
            {},{});
            return response;
        }
        catch (error) {
            return [];
        }
    }

    static async setUserAvatar(userId, avatar) {
        try {
            const response = await axios.post(`https://localhost:3001/api/users/${userId}/avatar`, 
            {
                avatar
            },
            {
                headers: {
                    'Authorization': `Bearer ${getUserFromLocalStorage().token}`,
                    "Content-Type": "multipart/form-data",
                }
            });
            const posts = response.data.data;
            return posts;
        }
        catch (error) {
            return [];
        }
    }

}