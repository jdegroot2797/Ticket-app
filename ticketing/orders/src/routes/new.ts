import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import {
  NotFoundError,
  requireAuth,
  validateRequest,
  OrderStatus,
  BadRequestError,
} from '@jdtix/common';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';

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
    const { ticketId } = req.body;

    // Find the desired ticket the user is trying to purchase in MongoDB
    const ticket = await Ticket.findById(ticketId);

    // if ticket cannot be found send back some type of error message
    if (!ticket) {
      throw new NotFoundError();
    }

    // Ensure the ticket is not already reserved
    const isReserved = await ticket.isReserved();

    // error message if the ticket is already reserved
    if (isReserved) {
      throw new BadRequestError('Ticket is already reserved');
    }

    //(what if many people are all trying to get a popular ticket?)

    // Check the expiration date for the order

    // if all the checks above are successful
    // build the order object and save it to the database as a document

    // publish an event telling NATS that the order was successfully created
    res.send({});
  },
);

export { router as newOrderRouter };
