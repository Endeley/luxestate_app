import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import cookieParser from 'cookie-parser';
// import contactRouter from './routes/contact.route.js';
dotenv.config();

mongoose
    .connect(process.env.MONGODB)
    .then(() => {
        console.log('connected to db');
    })
    .catch((err) => {
        console.log(err);
    });

const app = express();
app.use(express.json());
app.use(cookieParser());

app.listen(3000, () => {
    console.log('server listeng at 3000');
});

app.use('/server/user', userRouter);
app.use('/server/auth', authRouter);
app.use('/server/listing', listingRouter);
// app.use('/server/contact', contactRouter);

//

//
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success: false,
        statusCode: statusCode,
        message: message,
    });
});
