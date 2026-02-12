import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
    getPasswords,
    createPassword,
    updatePassword,
    deletePassword,
} from '../controllers/passwordController.js';

const router = express.Router();

router.route('/').get(protect, getPasswords).post(protect, createPassword);
router.route('/:id').put(protect, updatePassword).delete(protect, deletePassword);

export default router;
