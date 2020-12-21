import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { requireAuth, validateRequest } from '@jdtix/common';
import { body } from 'express-validator';

const router = express.Router();

router.post(
  '/api/orders',
  requireAuth,
  [
    // ticketId will come from MongoDB
    // can check if the ticketId will follow mongo format
    // assumes mongodb will always be used, slight coupling issue
    body('ticketId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('Ticket Id must be provided'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    res.send({});
  },
);

export { router as newOrderRouter };
