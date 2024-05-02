import UserScheme from "../db/schemes/User.js";

class UserModel {
    static async createUser(user) {
        const createdUser = await UserScheme.create(user);
        return createdUser;
    }

    static async getUserById(id) {
        const user = await UserScheme.findByPk(id);
        return user;
    }

    static async getUserByRule(rule) {
        const user = await UserScheme.findOne(rule);
        return user;
    }

    static async getUsersByRule(rule) {
        const user = await UserScheme.findAll(rule);
        return user;
    }
}

export default UserModel;