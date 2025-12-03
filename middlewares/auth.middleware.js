import jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../config/env.js';

export const authMiddleware = (req, res, next) => {

    // Getting token from authorization header
    const authHeader = req.headers.authorization;

    //Check if header exists
    if (!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({ message: 'No token provided, authorization denied'});
    } console.log("Auth header:", authHeader);

    //Extract token
    const token = authHeader.split(' ')[1];





    try {
    
        //Verify token
        const decoded = jwt.verify(token, JWT_SECRET);

        //Attaching user info to request
        if (!decoded.isAdmin){
            return res.status(403).json({message: "Admin access only"});
        }
        req.auth = decoded; //optional routes can use user data

       
        console.log("Token extracted:", token);

        next();
    }
    
    catch(error) {
        console.error('Auth middleware eror:', error.message);
        return res.status(401).json({
            message: 'Invalid or expired token'
        });
    }
}
// export const adminOnly = (req,  res, next => {
//     if (!req.auth.isAdmin){
//         return res.status(403).json({
//             message: 'Admin access only'
//         })
//     }
//     next()
            
// })







// const jwt = require('jsonwebtoken');

// const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret'