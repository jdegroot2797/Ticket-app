import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../app';
import { Order } from '../models/order';
import { OrderStatus } from '@jdtix/common';
import { stripe } from '../stripe';

jest.mock('../stripe');

it('returns 404 error when attempting to purchase a non-existant order', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.testSignin())
    .send({
      token: '12312321',
      orderId: mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it('returns 401 when purchasing an order that does not belong to the user', async () => {
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 100,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.testSignin())
    .send({
      token: '12312321',
      orderId: order.id,
    })
    .expect(401);
});

it('returns 400 when purchasing a cancelled order', async () => {
  const userId = mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: userId,
    version: 0,
    price: 100,
    status: OrderStatus.Cancelled,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.testSignin(userId))
    .send({
      orderId: order.id,
      token: '12312321',
    })
    .expect(400);
});

it('returns a 201 when provided valid inputs', async () => {
  const userId = mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: userId,
    version: 0,
    price: 100,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.testSignin(userId))
    .send({
      orderId: order.id,
      token: 'tok_visa',
    })
    .expect(201);

  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
  expect(chargeOptions.source).toEqual('tok_visa');
  expect(chargeOptions.amount).toEqual(100 * 100);
  expect(chargeOptions.currency).toEqual('usd');
});
