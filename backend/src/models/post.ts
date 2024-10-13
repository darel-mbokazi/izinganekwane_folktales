import mongoose, { Schema, Document } from 'mongoose'

const replySchema = new Schema({
  content: { type: String, required: true },
  author: { type: String, required: true },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
  dislikes: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
  createdAt: { type: Date, default: Date.now },
})

const commentSchema = new Schema({
  content: { type: String, required: true },
  author: { type: String, required: true },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
  dislikes: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
  replies: [replySchema],
  createdAt: { type: Date, default: Date.now },
})

interface IPost extends Document {
  title: string
  content: string
  authorId: mongoose.Types.ObjectId 
  author: string 
  likes: mongoose.Types.ObjectId[] 
  dislikes: mongoose.Types.ObjectId[]
  favorites: mongoose.Types.ObjectId[]
  comments: {
    [x: string]: any
    content: string
    author: string
    likes: mongoose.Types.ObjectId[] 
    dislikes: mongoose.Types.ObjectId[] 
    replies: {
      [x: string]: any
      content: string
      author: string
      likes: mongoose.Types.ObjectId[] 
      dislikes: mongoose.Types.ObjectId[] 
      createdAt: Date
    }[]
    createdAt: Date
  }[]
  createdAt: Date
  updatedAt: Date
}

const postSchema: Schema<IPost> = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, 
    author: { type: String, required: true }, 
    likes: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }], 
    dislikes: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
    favorites: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
    comments: [commentSchema],
  },
  { timestamps: true } 
)

const PostModel = mongoose.model<IPost>('Post', postSchema)

export default PostModel
