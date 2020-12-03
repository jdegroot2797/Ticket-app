import request from 'supertest';
import { app } from '../../app';

it('fails when email does not exist in database', async () => {
    await request(app)
        .post('/api/users/signin')
        .send({ 
            email: 'test@test.com',
            password: 'password'
        })
        .expect(400);
});

it('fails when incorrect password is given', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({ 
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);

    await request(app)
        .post('/api/users/signin')
        .send({ 
            email: 'test@test.com',
            password: 'abc123'
        })
        .expect(400);
});

it('responds with cookie when given a valid login', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({ 
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);

    const res = await request(app)
        .post('/api/users/signin')
        .send({ 
            email: 'test@test.com',
            password: 'password'
        })
        .expect(200);
    
    expect(res.get('Set-Cookie')).toBeDefined();
});