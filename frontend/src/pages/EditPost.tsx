import { useState, useEffect } from 'react'
import axios from 'axios'
import ReactQuill from 'react-quill'
import { useParams, useNavigate } from 'react-router-dom'
import 'react-quill/dist/quill.snow.css'

const EditPost = () => {
  const { postId } = useParams<{ postId: string }>()
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [content, setContent] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`https://izinganekwane-folktales-backend.vercel.app/api/posts/${postId}`, 
          { withCredentials: true })
        const post = response.data
        setTitle(post.title)
        setAuthor(post.author)
        setContent(post.content)

      } catch (err) {
        console.error('Failed to fetch post', err)
      }
    }

    fetchPost()
  }, [postId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await axios.put(`https://izinganekwane-folktales-backend.vercel.app/api/posts/${postId}`, { title, author, content }, { withCredentials: true })
      navigate(`/Post/${postId}`) 
    } catch (err) {
      console.error('Failed to update post', err)
    }
  }

  return (
    <div className="container mx-auto max-sm:px-5">
      <h2 className="text-center text-3xl font-bold py-10">Edit Post</h2>
      <div className="grid place-content-center place-items-center">
        <form onSubmit={handleSubmit} className="grid gap-4 w-full">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="border p-2"
          />
          <input
            type="text"
            placeholder="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
            className="border p-2"
          />
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            className="max-w-2xl"
          />
          <button
            type="submit"
            className="bg-slate-950 text-slate-300 py-2 px-10 rounded-md mt-20 w-fit hover:bg-slate-500 m-auto">
            Update Post
          </button>
        </form>
      </div>
    </div>
  )
}

export default EditPost
