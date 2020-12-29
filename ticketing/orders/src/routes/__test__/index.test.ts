import request from 'supertest';
import { Ticket } from '../../models/ticket';
import { Order, OrderStatus } from '../../models/order';
import { app } from '../../app';

const createTicket = async () => {
  const ticket = Ticket.build({
    title: 'asdsadsda',
    price: 30,
  });
  await ticket.save();

  return ticket;
};

it('Gets all orders for the specfic user', async () => {
  // Create a few tickets for the user to purchase and
  const ticketOne = await createTicket();
  const ticketTwo = await createTicket();
  const ticketThree = await createTicket();

  // Create two mock users
  const userOne = global.testSignin();
  const userTwo = global.testSignin();

  // Create orders for a user #1
  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticketOne.id })
    .expect(201);

  const { body: orderTwo } = await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticketTwo.id })
    .expect(201);

  // Create orders for user #2
  await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketThree.id })
    .expect(201);

  // Make request to get all of user #1's orders
  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', userOne)
    .expect(200);

  // Ensure we get only tickets for one the specific users
  expect(response.body.length).toEqual(2);

  // check order id matches
  expect(response.body[0].id).toEqual(orderOne.id);
  expect(response.body[1].id).toEqual(orderTwo.id);

  //check embedded tickets on res
  expect(response.body[0].ticket.id).toEqual(ticketOne.id);
  expect(response.body[1].ticket.id).toEqual(ticketTwo.id);
});
