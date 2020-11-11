// EXPRESS & MIDDLEWARE
import express from 'express';
import { json } from 'body-parser';

// ROUTES
import { currentUserRouter } from './routes/current-user';
import { signInRouter } from './routes/signin';
import { signOutRouter } from './routes/signout';
import { signUpRouter } from './routes/signup';

// REGISTER APP & MIDDLEWARE
const app = express();
app.use(json());

// REGISTER ROUTE HANDLERS
app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter)


app.listen(3000, () => {
    console.log('Listening on port 3000!');
});