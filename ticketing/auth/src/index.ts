// EXPRESS & MIDDLEWARE
import express from 'express';
import { json } from 'body-parser';

// ROUTES
import { currentUserRouter } from './routes/current-user';
import { signInRouter } from './routes/signin';
import { signOutRouter } from './routes/signout';
import { signUpRouter } from './routes/signup';

// OUR MIDDLEWARE
import { errorHandler } from './middleware/error-handler';

// REGISTER APP & MIDDLEWARE
const app = express();
app.use(json());


// REGISTER ROUTE HANDLERS
app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter)

// For express, error handler must be defined after all other "app.use() calls"
app.use(errorHandler);


app.listen(3000, () => {
    console.log('Listening on port 3000!');
});