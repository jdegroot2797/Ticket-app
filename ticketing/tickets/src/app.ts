// EXPRESS & MIDDLEWARE
import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

// ROUTES
import { createTicketRouter } from './routes/new';
import { showTicketRouter } from './routes/show';

// OUR MIDDLEWARE
import { errorHandler, NotFoundError, currentUser } from '@jdtix/common';

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
app.use(currentUser);

// REGISTER ROUTE HANDLERS
app.use(createTicketRouter);
app.use(showTicketRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

// For express, error handler must be defined after all other "app.use() calls"
app.use(errorHandler);

export { app };
