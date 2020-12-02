import request from 'supertest';
import { app } from '../../app';

it('returns 201 status code for successful signups', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);
});

it('returns 400 status code with invalid email', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'testtest.com',
            password: 'password'
        })
        .expect(400);
});

it('returns 400 status code with invalid password, mininum 4 characters to 40 characters', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'pass'
        })
        .expect(400);
});

it('rejects duplicated email signups', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);

    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(400);
});

it('sets the cookie after successful signup', async () => {
    const res = await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);
    
    expect(res.get('Set-Cookie')).toBeDefined();
});