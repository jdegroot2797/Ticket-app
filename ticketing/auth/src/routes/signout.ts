import express from 'express';

const router = express.Router();

router.post('/api/users/signout', (req, res) => {
    //send back header to delete the users cookieSession
    req.session = null;
    res.send({});
});

export { router as signOutRouter };