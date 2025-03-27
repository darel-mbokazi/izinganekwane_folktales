import { RequestHandler } from 'express'
import PostModel from '../models/post'
import UserModel from '../models/User';

const addComment: RequestHandler = async (req, res, next) => {
  const { content } = req.body;
  const postId = req.params.postId;
  const userId = req.user?.userId;

  if (!content) {
    return res.status(400).json({ message: 'Comment content is required.' });
  }

  try {
    const post = await PostModel.findById(postId).exec();

    if (!post) {
      return res.status(404).json({ message: 'Failed to add comment.' });
    }

    // Fetch the user's name
    const user = await UserModel.findById(userId).select('name').exec();
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const comment = {
      content,
      authorId: userId, 
      authorName: user.name, 
      likes: [],
      dislikes: [],
      replies: [],
      createdAt: new Date(),
    };

    post.comments.push(comment);
    const updatedPost = await post.save();

    res.status(201).json({ message: 'Comment added.', post: updatedPost });
  } catch (error) {
    next(error);
  }
};

const getAllComments: RequestHandler = async (req, res, next) => {
  const postId = req.params.postId

  try {
    const post = await PostModel.findById(postId).exec()

    if (!post) {
      return res.status(404).json({ message: 'Comments not found.' })
    }

    res.status(200).json({ comments: post.comments })
  } catch (error) {
    next(error)
  }
}

const deleteComment: RequestHandler = async (req, res, next) => {
  const { postId, commentId } = req.params;
  const userId = req.user?.userId;

  try {
    const post = await PostModel.findById(postId).exec();

    if (!post) {
      return res.status(404).json({ message: 'Comment not found.' });
    }

    const commentIndex = post.comments.findIndex(
      (comment) =>
        comment._id.toString() === commentId &&
        comment.authorId.toString() === userId 
    );

    if (commentIndex === -1) {
      return res.status(403).json({
        message:
          'You are not authorized to delete this comment or comment not found.',
      });
    }

    post.comments.splice(commentIndex, 1);

    const updatedPost = await post.save();

    res.status(200).json({ message: 'Comment deleted.', post: updatedPost });
  } catch (error) {
    next(error);
  }
};


const addReply: RequestHandler = async (req, res, next) => {
  const { postId, commentId } = req.params;
  const { content } = req.body;
  const userId = req.user?.userId;

  if (!content) {
    return res.status(400).json({ message: 'Reply content is required.' });
  }

  try {
    const post = await PostModel.findById(postId).exec();

    if (!post) {
      return res.status(404).json({ message: 'Failed to add reply' });
    }

    const comment = post.comments.find((c) => c._id.toString() === commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Reply not found.' });
    }

    if (!Array.isArray(comment.replies)) {
      comment.replies = [];
    }

    const user = await UserModel.findById(userId).select('name').exec();
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const reply = {
      content,
      authorId: userId, 
      authorName: user.name, 
      likes: [],
      dislikes: [],
      createdAt: new Date(),
    };

    comment.replies.push(reply);
    const updatedPost = await post.save();

    res.status(201).json({ message: 'Reply added.', post: updatedPost });
  } catch (error) {
    next(error);
  }
};


const deleteReply: RequestHandler = async (req, res, next) => {
  const { postId, commentId, replyId } = req.params;
  const userId = req.user?.userId;

  try {
    const post = await PostModel.findById(postId).exec();

    if (!post) {
      return res.status(404).json({ message: 'Reply not found.' });
    }

    const comment = post.comments.find(
      (comment) => comment._id.toString() === commentId
    );

    if (!comment) {
      return res.status(404).json({ message: 'Reply not found.' });
    }

    const replyIndex = comment.replies.findIndex(
      (reply) =>
        reply._id.toString() === replyId &&
        reply.authorId.toString() === userId 
    );

    if (replyIndex === -1) {
      return res.status(403).json({
        message:
          'You are not authorized to delete this reply or reply not found.',
      });
    }

    comment.replies.splice(replyIndex, 1);

    const updatedPost = await post.save();

    res.status(200).json({ message: 'Reply deleted.', post: updatedPost });
  } catch (error) {
    next(error);
  }
};


export {
  addComment,
  getAllComments,
  deleteComment,
  addReply,
  deleteReply,
}
