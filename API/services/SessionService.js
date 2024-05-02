import { setInterval } from 'timers';

class SessionService {
    constructor() {
        this.authUsers = {};
        this.tempUsers = {};
    }

    getAuthUsers() {
        return this.authUsers;
    }

    getTempUsers() {
        return this.tempUsers;
    }

    getAuthUser(userCode) {
        const userData = this.authUsers[userCode];
        if (!userData) return;
        return this.authUsers[userCode].id;
    }

    getTempUser(userCode) {
        return this.tempUsers[userCode].userData;
    }

    addToAuthUsers(userCode, userData) {
        this.authUsers[userCode] = userData;
    }

    addToTempUsers(userCode, userData) {
        this.tempUsers[userCode] = userData;
    }

    deleteAuthUser(userCode) {
        if (this.authUsers[userCode] !== undefined) {
            delete this.authUsers[userCode];
        }
    }

    deleteTempUser(userCode) {
        if (this.tempUsers[userCode] !== undefined) {
            delete this.tempUsers[userCode];
        }
    }

    deleteExpiredSessions() {
        const currentTime = new Date();
        const keys = Object.keys(this.authUsers);

        for (const key of keys) {
            if (this.authUsers[key].expiresAt <= currentTime) this.deleteAuthUser(key);
        }
    }

    deleteExpiredEmailConfirms() {
        const currentTime = new Date();
        const keys = Object.keys(this.tempUsers);

        for (const key of keys) {
            if (this.tempUsers[key].expiresAt <= currentTime) this.deleteTempUser(key);
        }
    }

}

const sessionService = new SessionService();
setInterval(() => sessionService.deleteExpiredSessions(), parseInt(process.env.SESSION_TTL));
setInterval(() => sessionService.deleteExpiredEmailConfirms(), parseInt(process.env.EMAIL_CODE_TTL));

export default sessionService;