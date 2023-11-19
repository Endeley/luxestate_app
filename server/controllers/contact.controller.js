import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';

export const getUserContact = async (req, res, next) => {
    const { username } = req.params;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return next(errorHandler(404, 'User not found'));
        }

        const { mobileContact, telContact } = user;
        res.json({ mobileContact, telContact });
    } catch (error) {
        next(error);
    }
};
