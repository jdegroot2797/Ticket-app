import { ValidationError } from 'express-validator';
import { CustomError } from './custom-error'; 

export class RequestValidationError extends CustomError { 
    statusCode = 400;
    
    constructor(public errors: ValidationError[]) {
        super('');

        // Typescript requires when extending built in library class
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }
    // take array of errors from RequestValidationError which 
    // comes from signup.ts "validationResult(err)"
    serializeErrors() {
        return this.errors.map(err => {
            return {message: err.msg, field: err.param};
        })
    }
}