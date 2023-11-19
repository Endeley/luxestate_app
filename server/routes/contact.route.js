// routes/contact.route.js

import express from 'express';
import { getUserContact } from '../controllers/contact.controller.js';

const router = express.Router();

router.get('/:username', getUserContact);

export default router;
