import request from 'supertest';
import { app } from '../../app';
import mongoose, { MongooseDocument } from 'mongoose';
import { Ticket } from '../../models/ticket';

it('returns a 404 if the ticket is not found', async () => {
  //generate a valid mongo id

  await request(app)
    .get(`/api/tickets/${global.testMongoId()}`)
    .send()
    .expect(404);
});

it('returns the ticket if the ticket is found', async () => {
  const title = 'concert';
  const price = 20;

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.testSignin())
    .send({
      title,
      price,
    })
    .expect(201);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});
