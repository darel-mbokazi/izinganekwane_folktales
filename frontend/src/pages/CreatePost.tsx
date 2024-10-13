import axios from 'axios'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const CreatePost = () => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [content, setContent] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get(
          'https://izinganekwane-folktales-backend.vercel.app/api/users/',
          {
            withCredentials: true,
          }
        )
        if (response.status === 200) {
          setIsLoggedIn(true)
          setAuthor(response.data.user.name)
        } else {
          navigate('/Sign-In')
        }
      } catch (error) {
        navigate('/Sign-In')
      }
    }
    checkLoginStatus()
  }, [navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()


    try {
      await axios.post(
        'https://izinganekwane-folktales-backend.vercel.app/api/posts/',
        { title, author, content },
        { withCredentials: true }
      )
      navigate('/My-Posts')
    } catch (error) {
      console.error('Error creating post:', error)
    }
  }

  if (!isLoggedIn) {
    return null 
  }

  return (
    <div className="container mx-auto grid place-content-center max-sm:p-5">
      <h2 className="text-center text-3xl font-bold py-10">Create Post</h2>
      <form onSubmit={handleSubmit} className="grid gap-4">
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
          placeholder="Write your text here"
          className="max-w-2xl"
        />

        <div className="grid place-content-center">
          <button
            type="submit"
            className="bg-slate-950 text-slate-300 py-2 px-10 rounded-md mt-20 w-fit hover:bg-slate-500">
            Post
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreatePost
