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