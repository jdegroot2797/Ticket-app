import express, { Request, Response } from 'express';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.get('/api/tickets', async (req: Request, res: Response) => {
  const tickets = await Ticket.find({
    // only get tickets without an order tied to them
    orderId: undefined,
  });

  res.send(tickets);
});

export { router as indexTicketRouter };
