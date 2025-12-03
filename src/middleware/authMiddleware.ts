import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
    userId?: string;
    userRole?: string;
}

export const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Authentication failed' });
        }

        const decodedData: any = jwt.verify(token, process.env.JWT_SECRET!);

        req.userId = decodedData?.id;
        req.userRole = decodedData?.role;

        next();
    } catch (error) {
        res.status(401).json({ message: 'Authentication failed' });
    }
};

export const checkRole = (roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.userRole || !roles.includes(req.userRole)) {
            return res.status(403).json({ message: 'Access denied' });
        }
        next();
    };
};
