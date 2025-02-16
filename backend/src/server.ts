import express, { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import userRoutes from './routes/userRoutes'
import postRoutes from './routes/postRoutes'
import commentRoutes from './routes/commentRoutes'
import reactionRoutes from './routes/reactionRoutes'

dotenv.config()

const app = express()
const port = process.env.PORT || 5400
const mongoUrl = process.env.MONGO_URI

// Middleware
app.use(express.json())
app.use(morgan('dev'))
app.use(
  cors({
    origin: ['https://izinganekwane-folktales.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  })
)
app.use(cookieParser())
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Hello from Express on Vercel!');
});

// Routes
app.use('/api/posts', postRoutes)
app.use('/api/users', userRoutes)
app.use('/api/posts/comments', commentRoutes)
app.use('/api/posts/reactions', reactionRoutes)

// Connect to MongoDB and start server
mongoose
  .connect(mongoUrl!)
  .then(() => {
    console.log('Connected to MongoDB')
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`)
    })
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error)
  })

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack)
  res.status(500).send('Internal Server Error')
})