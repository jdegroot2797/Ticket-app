import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  NotAuthError,
  BadRequestError,
} from '@jdtix/common';
import { Ticket } from '../models/ticket';
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.put(
  '/api/tickets/:id',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    // ensure the ticket exists
    if (!ticket) {
      throw new NotFoundError();
    }

    // make sure a reserved ticket cannot be edited by a user
    if (ticket.orderId) {
      throw new BadRequestError('A reserved ticket cannot be edited');
    }

    // ensure the user is updating a ticket they own
    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthError();
    }

    // all is well, lets update the tickets
    // mongo saves this in memory
    ticket.set({
      title: req.body.title,
      price: req.body.price,
    });

    // needed to save the data and persist in database
    await ticket.save();

    // publish event to NATS
    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    });

    res.send(ticket);
  },
);

export { router as updateTicketRouter };
