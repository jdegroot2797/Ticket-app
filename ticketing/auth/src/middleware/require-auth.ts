import {Request, Response, NextFunction} from 'express';


export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    if(!req.currentUser){
        //TODO: create a not authed error
        return res.status(401).send({});
    }
}