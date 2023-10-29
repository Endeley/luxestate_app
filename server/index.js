import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
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

app.listen(3000, () => {
    console.log('server listeng at 300');
});
