import axios from "axios";
import { getUserFromLocalStorage } from "../store/store";

export default class AuthService {
    static async login(login, password) {
        const response = await axios.post("https://localhost:3001/api/auth/login", {
            login: login,
            password: password,
        });
        return response;
    }

    static async logout() {
        try {
            console.log(getUserFromLocalStorage().token);
            const response = await axios.post("https://localhost:3001/api/auth/logout", {} ,{
                headers: {
                    'Authorization': `Bearer ${getUserFromLocalStorage().token}`
                }
            });
            return response;
        }
        catch(err) {
            console.log(err);
            return;
        }
    }

    static async register(login, password, email) {
        const response = await axios.post("https://localhost:3001/api/auth/register", {
            login: login,
            password: password,
            email: email,
            confirmPassword: password,
        });
        return response;
    }

    static async verifyEmail(confirm_token){
        const data = await axios.get("https://localhost:3001/api/auth/verify-email/" + confirm_token,)
        return data;
    }

}