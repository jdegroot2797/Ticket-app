// EXPRESS & MIDDLEWARE
import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import mongoose from 'mongoose';
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
app.use(cookieSession({
    signed: false,
    secure: true
  })
);


// REGISTER ROUTE HANDLERS
app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter)

app.all('*', async () => {
  throw new NotFoundError();
});

// For express, error handler must be defined after all other "app.use() calls"
app.use(errorHandler);


const startUp = async () => {
  if(!process.env.JWT_KEY){
    throw new Error('JWT_KEY environment variable must be defined');
  }

  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('connected to mongodb');
  } catch (err){
    console.error(err);
  }
}

app.listen(3000, () => {
    console.log('Listening on port 3000!');
});

// listen for traffic after app is live
startUp();