import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { User } from '../models/user';
import { PasswordManager } from '../services/password-manager';
import { validateRequest, BadRequestError } from '@jdtix/common';

const router = express.Router();

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().notEmpty().withMessage('Password must be valid'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    //TODO: implement signin workflow with mongodb
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError('invalid login credentials');
    }

    const passwordsMatch = await PasswordManager.compare(
      existingUser.password,
      password,
    );
    if (!passwordsMatch) {
      throw new BadRequestError('invalid login credentials');
    }
    // generate JWT token
    const userJWT = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!,
    );

    // store jwt on cookieSession
    req.session = {
      jwt: userJWT,
    };

    res.status(200).send(existingUser);
  },
);

export { router as signInRouter };
