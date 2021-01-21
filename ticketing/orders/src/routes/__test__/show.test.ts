import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

it('fetches a users orders', async () => {
  // create a ticket
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'asdads',
    price: 25,
  });
  await ticket.save();

  // get a mock user
  const user = global.testSignin();

  // make request to create an order with the newly created ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // get the the newly created order with reserved tickets
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);

  // check to see if the order we fetched was the same one created
  expect(fetchedOrder.id).toEqual(order.id);
});

it('throws an error if one users tries to get another users orders', async () => {
  // create a ticket
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'asdads',
    price: 25,
  });
  await ticket.save();

  // get a mock user
  const user = global.testSignin();
  const userTwo = global.testSignin();

  // make request to create an order with the newly created ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // try to access newly created order under users #1 with user #2
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', userTwo)
    .send()
    .expect(401);
});
