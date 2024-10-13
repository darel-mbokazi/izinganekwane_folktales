import express from 'express'
import { getPosts, getPost ,createPost, updatePost, deletePost, getPostByUser } from '../controllers/postController'
import { authenticate } from '../middleware/authMiddleware'

const router = express.Router()

router.get('/my-posts', authenticate, getPostByUser)
router.get('/', getPosts)
router.get('/:postId', getPost)
router.post('/', authenticate, createPost)
router.put('/:postId', authenticate, updatePost)
router.delete('/:postId', authenticate, deletePost)

export default router