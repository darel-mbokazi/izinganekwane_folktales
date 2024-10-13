import { RequestHandler } from 'express'
import PostModel from '../models/post'

const likePost: RequestHandler = async (req, res, next) => {
  const { postId } = req.params
  const userId = req.user?.userId

  try {
    const post = await PostModel.findById(postId)
    if (!post) return res.status(404).json({ error: 'Post not found' })

    const postUserId = post?.author.toString().trim() 

    // Handle likes
    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter((id) => id.toString() !== userId)
    } else {
      post.dislikes = post.dislikes.filter((id) => id.toString() !== userId)
      post.likes.push(userId)
    }

    await post.save()
    res.status(200).json(post)
  } catch (error) {
    next(error)
  }
}

const dislikePost: RequestHandler = async (req, res, next) => {
  const { postId } = req.params
  const userId = req.user?.userId

  try {
    const post = await PostModel.findById(postId)
    if (!post) return res.status(404).json({ error: 'Post not found' })

    const postUserId = post?.author.toString().trim()

    // Handle dislikes
    if (post.dislikes.includes(userId)) {
      post.dislikes = post.dislikes.filter((id) => id.toString() !== userId)
    } else {
      post.likes = post.likes.filter((id) => id.toString() !== userId)
      post.dislikes.push(userId)
    }

    await post.save()
    res.status(200).json(post)
  } catch (error) {
    next(error)
  }
}


const favoritePost: RequestHandler = async (req, res, next) => {
  const { postId } = req.params
  const userId = req.user?.userId

  try {
    const post = await PostModel.findById(postId)
    if (!post) {
      return res.status(404).json({ error: 'Post not found' })
    }

    // Toggle Favorite
    if (post.favorites.includes(userId)) {
      post.favorites = post.favorites.filter((id) => id.toString() !== userId)
    } else {
      post.favorites.push(userId)
    }

    await post.save()
    res.status(200).json(post)
  } catch (error) {
    next(error)
  }
}

// Get all favorite posts by a user
const getFavoritePosts: RequestHandler = async (req, res, next) => {
  const userId = req.user?.userId 

  try {
    const favoritePosts = await PostModel.find({ favorites: userId })

    res.status(200).json(favoritePosts)
  } catch (error) {
    next(error)
  }
}


export { likePost, dislikePost, favoritePost, getFavoritePosts }
