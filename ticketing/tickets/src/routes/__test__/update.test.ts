import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

const createTicket = () => {
  const title = 'adjgdsfd';
  const price = 400;
  return request(app)
    .post('/api/tickets')
    .set('Cookie', global.testSignin())
    .send({
      title,
      price,
    });
};

it('returns a 404 if the provided id does not exist', async () => {
  await request(app)
    .put(`/api/tickets/${global.testMongoId()}`)
    .set('Cookie', global.testSignin())
    .send({
      title: 'aslkdfj',
      price: 20,
    })
    .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
  await request(app)
    .put(`/api/tickets/${global.testMongoId()}`)
    .send({
      title: 'aslkdfj',
      price: 20,
    })
    .expect(401);
});

it('returns a 401 if the user does not own the ticket', async () => {
  // create the ticket first
  const res = await createTicket();

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', global.testSignin())
    .send({
      title: 'title update!',
      price: 490,
    })
    .expect(401);
});

it('returns a 400 if the user provides an invalid title or price', async () => {
  // save the cookie of the user
  const cookie = global.testSignin();

  // create the ticket first
  const res = await request(app)
    .post(`/api/tickets/`)
    .set('Cookie', cookie)
    .send({
      title: 'aslkdfj',
      price: 20,
    });

  // test updating invalid Title
  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 20,
    })
    .expect(400);

  // test updating invalid price
  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'Good title',
      price: -5,
    })
    .expect(400);
});

it('updates the ticket provided valid inputs', async () => {
  // save the cookie of the user
  const cookie = global.testSignin();

  // create the ticket first
  const res = await request(app)
    .post(`/api/tickets/`)
    .set('Cookie', cookie)
    .send({
      title: 'aslkdfj',
      price: 20,
    });

  // update the ticket
  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new title',
      price: 100,
    })
    .expect(200);

  //check if update is actually applied
  const ticketResponse = await request(app)
    .get(`/api/tickets/${res.body.id}`)
    .send();

  expect(ticketResponse.body.title).toEqual('new title');
  expect(ticketResponse.body.price).toEqual(100);
});
