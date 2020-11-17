import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
    id: string,
    email: string
}

// modify existing response object interface
declare global {
    namespace Express {
        interface Request {
            currentUser?: UserPayload;
        }
    }
}

export const currentUser = (
    req: Request, 
    res: Response, next: 
    NextFunction
) => {
    // if not returns undefined
    if(!req.session?.jwt){
        // move onto next middleware in the chain of calls
        return next();
    }

    try{
        const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!) as UserPayload;
        //tell request object that the current user has a valid JWT token
        req.currentUser = payload;
    }catch(err){
    }

    //move onto next middleware in the chain of calls
    next();
};