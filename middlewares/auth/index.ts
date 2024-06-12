import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../../utils/jwt';
import { JwtPayload } from 'jsonwebtoken';

declare module 'express-serve-static-core' {
    interface Request {
        user?: JwtPayload;
    }
}

// check if a valid token was provided in the request
export const authenticate = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const token = req.cookies.token;
    if (!token) {
        return res
            .status(401)
            .json({ message: 'Access denied. No token provided.' });
    }
    const decoded = verifyToken(token);
    if (!decoded) {
        return res.status(401).json({ message: 'Invalid token.' });
    }
    req.user = decoded as JwtPayload;
    next();
};
