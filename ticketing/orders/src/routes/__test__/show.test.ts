import request from 'supertest'; //
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

it('fetches ther order', async () => {
  // create a ticket
  const ticket = Ticket.build({
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

  expect(fetchedOrder.id).toEqual(order.id);
});
