import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

it('has a route handler listening to /api/tickets for post reqs', async () => {
  const res = await request(app).post('/api/tickets').send({});

  expect(res.status).not.toEqual(404);
});

it('only accessed if user is signed in', async () => {
  const res = await request(app).post('/api/tickets').send({});

  expect(res.status).toEqual(401);
});

it('returns a non 401 status code if user signed in', async () => {
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.testSignin())
    .send({});

  expect(res.status).not.toEqual(401);
});

it('returns error if invalid title provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.testSignin())
    .send({
      title: '',
      price: 15,
    })
    .expect(400);
});

it('returns error if invalid price provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.testSignin())
    .send({
      title: 'sadasadd',
      price: -15,
    })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.testSignin())
    .send({
      title: 'sdfdsfsdsfd',
    })
    .expect(400);
});

it('create ticket with valid params', async () => {
  let tickets = await Ticket.find({});

  // This should be the case as when testing in
  // '__test__/setup.ts we wipe mongoose collections on each test
  expect(tickets.length).toEqual(0);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.testSignin())
    .send({
      title: 'sdfdsfsdsfd',
      price: 20,
    })
    .expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(20);
  expect(tickets[0].title).toEqual('sdfdsfsdsfd');
});

it('publishes an event', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.testSignin())
    .send({
      title: 'sdfdsfsdsfd',
      price: 20,
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalledTimes(1);
});
