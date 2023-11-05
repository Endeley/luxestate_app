import mongoose from 'mongoose';

//

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
            default: 'https://images.pexels.com/photos/18972776/pexels-photo-18972776/free-photo-of-a-beach-with-people-walking-on-it-and-people-on-the-sand.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        },
    },
    { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
