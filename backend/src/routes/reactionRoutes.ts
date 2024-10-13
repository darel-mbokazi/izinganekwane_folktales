import express from 'express'
import { authenticate } from '../middleware/authMiddleware'
import { dislikePost, favoritePost, getFavoritePosts, likePost } from '../controllers/reactionController'

const router = express.Router()

router.post('/:postId/like', authenticate, likePost)
router.post('/:postId/dislike', authenticate, dislikePost)
router.post('/:postId/favorite', authenticate, favoritePost)
router.get('/favorites', authenticate, getFavoritePosts)

export default router