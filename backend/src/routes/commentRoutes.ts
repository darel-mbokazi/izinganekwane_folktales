import { Router } from 'express'
import {
  addComment,
  deleteComment,
  addReply,
  deleteReply,
  getAllComments,
} from '../controllers/commentController'
import { authenticate } from '../middleware/authMiddleware'

const router = Router()

router.post('/:postId/add-comment', authenticate, addComment)
router.get('/:postId/comments', getAllComments)
router.delete('/:postId/comment/:commentId/delete-comment', authenticate, deleteComment)
router.post('/:postId/comment/:commentId/add-reply', authenticate, addReply)
router.delete('/:postId/comment/:commentId/reply/:replyId/delete-reply',authenticate, deleteReply)

export default router
