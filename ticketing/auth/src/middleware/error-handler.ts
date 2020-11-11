import { Request, Response, NextFunction } from 'express';
import { RequestValidationError } from '../errors/request-validation-error';
import { DatabaseConnectionError } from '../errors/database-connection-error'; 

export const errorHandler = (
    err: Error, 
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    // VALIDATION ERROR
    if(err instanceof RequestValidationError){
        return res.status(err.statusCode).send({errors: err.serializeErrors()});
    }

    // DB CONNECTION ERROR
    if(err instanceof DatabaseConnectionError){
        return res.status(err.statusCode).send({errors: err.serializeErrors()});
    }

    // GENERIC ERROR
    res.status(400).send({ errors: [{message: err.message}] });
};