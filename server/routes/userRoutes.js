import express from 'express';
import { getUserProfile, getUserBlogs } from '../controllers/userController.js';

const router = express.Router();

router.get('/:id', getUserProfile);
router.get('/:id/blogs', getUserBlogs);

export default router;
