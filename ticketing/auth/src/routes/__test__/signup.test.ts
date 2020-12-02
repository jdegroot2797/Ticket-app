import request from 'supertest';
import { app } from '../../app';

// test the signup route
it('returns 201 status code for successful signups', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);
});