import express from 'express';
import jwt from 'jsonwebtoken';


const router = express.Router();

router.get('/api/users/currentuser', (req, res) => {
    // is jwt set?
    if(!req.session?.jwt){
        return res.send({currentUser: null});
    }
    //if so respond that user does not have valid session token
    try{
        const payload = jwt.verify(
            req.session.jwt, 
            process.env.JWT_KEY!
        );
        //otherwise user has valida session token
        // send back the current user
        res.send({currentUser: payload});
    }catch (err){
        res.send({currentUser: null});
    }
    
    // TODO: create current user middlerware
    
});

export { router as currentUserRouter };