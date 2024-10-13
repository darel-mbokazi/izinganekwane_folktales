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

router.post('/:postId/comments', authenticate, addComment)
router.get('/:postId/comments', getAllComments)
router.delete('/:postId/delete-comment/:commentId', authenticate, deleteComment)
router.post('/:postId/comment-replies/:commentId', authenticate, addReply)
router.delete('/:postId/delete-reply/:commentId/:replyId',authenticate, deleteReply)

export default router
