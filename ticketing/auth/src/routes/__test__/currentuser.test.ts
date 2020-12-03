import request from 'supertest';
import { app } from '../../app';

it('responds with details of the signed in user', async () => {
    const signupRes = await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password',
        })
        .expect(201);
    
    const cookie = signupRes.get('Set-Cookie');

    const res = await request(app)
        .get('/api/users/currentuser')
        .set('Cookie', cookie)
        .send()
        .expect(200);

    //console.log(res.body);
    expect(res.body.currentUser.email).toEqual('test@test.com');

});