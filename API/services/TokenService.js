import jwt from 'jsonwebtoken';
// const secretKey = crypto.randomBytes(32).toString('hex');

export default class Token {
    static createToken(code) {
        const token = jwt.sign({ userCode: code}, process.env.SECRET_KEY, { expiresIn: (parseInt(process.env.TOKEN_TTL) / 1000) });
        return token;
    }

    static getTokenFromRequest(req) {
        const data = req.get("Authorization");
        if (!data) throw "No token provided";
        return data.split(' ')[1];
    }

    static getUserCodeByToken(token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
                if (err) {
                    reject('Token is obsolete');
                    return;
                }
                resolve(decoded.userCode);
            });
        });
    }

    static getUserCodeFromRequest(req) {
        const token = this.getTokenFromRequest(req);
        return this.getUserCodeByToken(token);
    }
}