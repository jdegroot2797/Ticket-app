import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
  NotAuthError,
  OrderStatus,
} from '@jdtix/common';
import { Order } from '../models/order';
import { stripe } from '../stripe';

const router = express.Router();

router.post(
  '/api/payments',
  requireAuth,
  [body('token').not().isEmpty(), body('orderId').not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthError();
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError(
        'Order is expired/cancelled, cannot pay for invalid orders',
      );
    }

    //create the charge
    await stripe.charges.create({
      currency: 'usd',
      amount: order.price * 100,
      source: token,
    });

    //TODO: automate testing for
    // 1. creating order, waiting for expiration window, then trying to paym
    // 2. ensure payment is successfully
    // 3. ensure order exists/ not cancelled
    // 4. make sure order is only paid for by one user, which belongs to that user and not another

    // implement stripe js payment authorization
    res.status(201).send({ success: true });
  },
);

export { router as createChargeRouter };
