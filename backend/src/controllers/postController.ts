import { RequestHandler } from 'express'
import PostModel from '../models/post'
import UserModel from '../models/User'

const getPosts: RequestHandler = async (req, res, next) => {
  try {
    const posts = await PostModel.find().exec()

    if (!posts || posts.length === 0) {
      return res.status(404).json({ gettingPostsError: 'Could not find posts' })
    }

    res.status(200).json(posts)
  } catch (error) {
    next(error)
  }
}

const getPost: RequestHandler = async (req, res, next) => {
  const postId = req.params.postId

  try {
    const post = await PostModel.findById(postId).exec()

    if (!post) {
      return res.status(404).json({ gettingPostError: 'Post not found' })
    }

    res.status(200).json(post)
  } catch (error) {
    next(error)
  }
}


const getPostByUser: RequestHandler = async (req, res, next) => {
  const userId = req.user?.userId 

  try {
    const user = await UserModel.findById(userId).exec() 
    if (!user) {
      return res.status(404).json({ userError: 'User not found' })
    }
    const posts = await PostModel.find({ authorId: userId }).exec() 
    if (!posts || posts.length === 0) {
      return res
        .status(404)
        .json({ postsError: 'No posts created by this user' })
    }

    res.status(200).json(posts)
  } catch (error) {
    next(error)
  }
}


interface PostTypes {
  title: string
  author: string
  content: string
}

const createPost: RequestHandler<unknown, unknown, PostTypes, unknown> = async (
  req,
  res,
  next
) => {
  const { title, author, content } = req.body
  const userId = req.user?.userId 

  try {
    const newPost = await PostModel.create({
      authorId: userId, 
      author, 
      title,
      content,
    })

    if (!newPost) {
      return res
        .status(400)
        .json({ creatingPostError: 'There was an error creating post' })
    }

    res
      .status(201)
      .json({ newPost, postCreatedSuccess: 'Post created successfully' })
  } catch (error) {
    next(error)
  }
}



const updatePost: RequestHandler<
  { postId: string },
  unknown,
  PostTypes,
  unknown
> = async (req, res, next) => {
  const postId = req.params.postId
  const { title, author, content } = req.body
  const userId = req.user?.userId.toString().trim() 

  try {
    const post = await PostModel.findById(postId).exec()

    if (!post) {
      return res.status(404).json({ findingPostError: 'Post not found' })
    }

    if (post.authorId.toString().trim() !== userId) {
      return res.status(403).json({
        authorizationError: 'You are not authorized to update this post',
      })
    }

    if (title.length === 0 || author.length === 0 || content.length === 0) {
      return res.status(400).json({ emptyError: 'Field must not be empty' })
    }

    const existingPost = await PostModel.findOne({
      title,
      _id: { $ne: postId },
    }).exec()

    if (existingPost) {
      return res
        .status(400)
        .json({ duplicateTitleError: 'A post with this title already exists' })
    }

    // Update post fields
    if (title) post.title = title
    if (author) post.author = author 
    if (content) post.content = content

    const updatedPost = await post.save()

    if (!updatedPost) {
      return res
        .status(404)
        .json({ updatingPostError: 'There was an error updating post' })
    }

    res
      .status(201)
      .json({ updatedPost, updatedPostSuccess: 'Post updated successfully' })
  } catch (error) {
    next(error)
  }
}


const deletePost: RequestHandler = async (req, res, next) => {
  const postId = req.params.postId
  const userId = req.user?.userId.toString().trim() 

  try {
    const post = await PostModel.findById(postId).exec()

    if (!post) {
      return res.status(404).json({ findingDeletedPostError: 'Post not found' })
    }


    if (post.authorId.toString().trim() !== userId) {
      return res.status(403).json({
        authorizationError: 'You are not authorized to delete this post',
      })
    }

    await PostModel.findByIdAndDelete(postId)
    res.status(204).send()
  } catch (error) {
    next(error)
  }
}


export { getPosts, getPost, getPostByUser, createPost, updatePost, deletePost }
