import request from 'supertest';
import { app } from '../../app';

// helper function to be reused for creating tickets
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

it('Fetch a list of tickets succesfully', async () => {
  await createTicket();
  await createTicket();
  await createTicket();
  await createTicket();
  await createTicket();

  const res = await request(app).get('/api/tickets').send().expect(200);

  expect(res.body.length).toEqual(5);
});
