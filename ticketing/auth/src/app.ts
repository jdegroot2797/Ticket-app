// EXPRESS & MIDDLEWARE
import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

// ROUTES
import { currentUserRouter } from './routes/current-user';
import { signInRouter } from './routes/signin';
import { signOutRouter } from './routes/signout';
import { signUpRouter } from './routes/signup';

// OUR MIDDLEWARE
import { errorHandler } from './middleware/error-handler';
import { NotFoundError } from './errors/not-found';

// REGISTER APP & MIDDLEWARE
const app = express();

// traffic is being proxied by ingress-nginx
app.set('trust proxy', true);

app.use(json());
app.use(
  cookieSession({
    signed: false,
    //sets cookie session to secure connections only except
    //for test environments
    secure: process.env.NODE_ENV !== 'test',
  }),
);

// REGISTER ROUTE HANDLERS
app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

// For express, error handler must be defined after all other "app.use() calls"
app.use(errorHandler);

export { app };
