import mongoose from 'mongoose';
import request from 'supertest';
import { Ticket } from '../../models/ticket';
import { Order, OrderStatus } from '../../models/order';
import { app } from '../../app';

it('it returns an error if the searched ticket does not exist', async () => {
  const ticketId = mongoose.Types.ObjectId();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.testSignin())
    .send({ ticketId })
    .expect(404);
});

it('it returns an error if the searched ticket is already reserved', async () => {
  const ticket = Ticket.build({
    title: 'test concert',
    price: 40,
  });
  await ticket.save();

  const order = Order.build({
    ticket,
    userId: 'steve210321',
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.testSignin())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it('reserves a ticket for the user order', async () => {
  const ticket = Ticket.build({
    title: 'test concert',
    price: 40,
  });
  await ticket.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.testSignin())
    .send({ ticketId: ticket.id })
    .expect(201);
});
