import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { RequestValidationError } from '../errors/request-validation-error'
import { BadRequestError } from '../errors/bad-request-error';
import { User } from '../models/user';

const router = express.Router();

router.post('/api/users/signup', 
    // validation on body for required email & password
    [
        body('email')
            .isEmail()
            .withMessage('Must provide valid email'),
        body('password')
            .trim()
            .isLength({min: 8, max: 80})
            .withMessage('Password must be between 8 to 80 characters')
    ],
    async (req: Request, res: Response) => {
        // check for errors
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            throw new RequestValidationError(errors.array());
        }
        // retrieve email and password from body
        const { email, password } = req.body;
        
        // check if user exists
        const existingUser = await User.findOne({ email });
        
        if(existingUser){
            throw new BadRequestError('Email is already in use');
        }

        // create user
        const user = User.createUser({ email, password });
        await user.save();
        
        // generate JWT token
        const userJWT = jwt.sign({
            id: user.id,
            email: user.email,
        }, 'placeholder');

        // store jwt on cookieSession
        req.session = {
            jwt: userJWT,
        }; 

        res.status(201).send(user);
    }
);

export { router as signUpRouter };