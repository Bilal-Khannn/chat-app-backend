import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY || '1234';
const EXPIRES_IN = process.env.EXPIRES_IN || '1h';

export const generateToken = (payload: object) => {
    return jwt.sign(payload, SECRET_KEY, {
        expiresIn: EXPIRES_IN
    });
};

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (err) {
        return null;
    }
};
