import request from 'supertest';
import { app } from '../../app';

it('responds with details of the signed in user', async () => {
  const cookie = await global.testSignup();

  const res = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send()
    .expect(200);

  //console.log(res.body);
  expect(res.body.currentUser.email).toEqual('test@test.com');
});

it('responds with "null" response of user being undefined if user not authenticated', async () => {
  const response = await request(app).get('/api/users/currentuser').send();

  expect(response.body.currentUser).toEqual(null);
});
