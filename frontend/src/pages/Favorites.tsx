import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Posts } from '../models/Post'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const Favorites = () => {
  const [posts, setPosts] = useState<Posts[]>([])
  const { user } = useAuth()

  // to remove HTML tags from content
  const stripHtmlTags = (html: string) => {
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = html
    return tempDiv.textContent || tempDiv.innerText || ''
  }

  useEffect(() => {
    const fetchPosts = async () => {
      if (!user?._id) return 

      try {
        // Fetch favorite posts for the authenticated user
        const response = await axios.get(
          'https://izinganekwane-folktales-backend.vercel.app/api/posts/reaction/favorites',
          { withCredentials: true }
        )
        setPosts(response.data)
      } catch (err) {
        console.error('Error fetching favorite posts:', err)
      }
    }

    fetchPosts()
  }, [user]) 

  return (
    <div className="container mx-auto grid place-content-center place-items-center min-h-screen max-sm:p-5">
      {posts.length === 0 ? (
        <div className="grid place-content-center place-items-center">
          <p className="text-xl font-semibold text-center">
            You have not yet added any posts to favorites.
          </p>
          <button className="bg-slate-950 text-slate-300 py-2 px-10 rounded-md mt-20 w-fit hover:bg-slate-500">
            <Link to="/All-Posts">See All Posts</Link>
          </button>
        </div>
      ) : (
        <div className="grid place-content-center place-items-center">
          <h1 className="text-center text-3xl font-bold py-10">
            Favorite Posts
          </h1>
          <div className="grid grid-cols-2 gap-4 mt-10 max-sm:grid-cols-1">
            {posts.map((post) => (
              <div key={post._id} className="p-5 flex flex-1">
                <div className="max-w-lg rounded overflow-hidden shadow-lg p-4 grid place-content-center">
                  <h2 className="font-bold">{post.title}</h2>
                  <p className="italic py-5">By: {post.author}</p>
                  <div className="text-gray-800 leading-7 mb-6">
                    {stripHtmlTags(post.content).slice(0, 500)}...
                  </div>
                  <p className="py-4 text-slate-950 font-bold hover:text-slate-500">
                    <Link to={`/Post/${post._id}`}>Read more</Link>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Favorites
