import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { Posts } from '../models/Post'
import DeletePost from '../components/DeletePost'
import { useAuth } from '../context/AuthContext' 
import { FaRegEdit } from 'react-icons/fa'
import { MdDeleteForever } from 'react-icons/md'
import { API_URL } from '../config.ts';

const MyPosts = () => {
  const [posts, setPosts] = useState<Posts[]>([])
  const [deletePostPopUp, setDeletePostPopUp] = useState<boolean>(false)
  const [deletePost, setDeletePost] = useState<string | null>(null)

  const { user } = useAuth() 

  const stripHtmlTags = (html: string) => {
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = html
    return tempDiv.textContent || tempDiv.innerText || ''
  }

  useEffect(() => {
    const fetchPosts = async () => {
      if (user?._id) {
        try {
          const response = await axios.get(
            `${API_URL}/posts/my-posts/`,
            { withCredentials: true }
          )
          // Filter the posts to ensure only posts created by the authenticated user are displayed
          const userPosts = response.data.filter(
            (post: Posts) => post.authorId === user._id
          )
          setPosts(userPosts)
        } catch (err) {
          console.error('Failed to fetch posts:', err)
        }
      }
    }

    fetchPosts()
  }, [user]) 

  const handleDeleteClick = (postId: string) => {
    setDeletePost(postId)
    setDeletePostPopUp(true)
  }

  const handleCancelDelete = () => {
    setDeletePostPopUp(false)
    setDeletePost(null)
  }

  const handleConfirmDelete = async () => {
    if (deletePost) {
      try {
        await axios.delete(`${API_URL}/posts/${deletePost}`, {
          withCredentials: true,
        })
        setPosts(posts.filter((post) => post._id !== deletePost))
        setDeletePostPopUp(false)
      } catch (err) {
        console.error('Failed to delete post:', err)
      }
    }
  }

  return (
    <div className="container mx-auto grid place-content-center place-items-center min-h-svh">
      {posts.length === 0 ? (
        <div className="grid place-content-center place-items-center">
          <p className="text-xl font-semibold">You have not yet made a post</p>
          <button className="bg-slate-950 text-slate-300 py-2 px-10 rounded-md mt-20 w-fit hover:bg-slate-500">
            <Link to="/Create-Post">Create One</Link>
          </button>
        </div>
      ) : (
        <div className="grid place-content-center place-items-center">
          <h1 className="text-center text-3xl font-bold py-10">My Posts</h1>
          <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
            {posts.map((post) => (
              <div key={post._id} className="p-5 flex flex-1">
                <div className="max-w-lg rounded overflow-hidden shadow-lg p-4 grid place-center-center">
                  <h1>Kwesukesukela</h1>
                  <h2 className="font-bold">{post.title.toUpperCase()}</h2>
                  <p className="italic">Cosu</p>
                  <p className="italic">Sampheka ngogozwana!</p>
                  <p className="italic py-5">By: {post.author}</p>
                  <div className="text-gray-800 leading-7 mb-6">
                    {stripHtmlTags(post.content).slice(0, 500)}...
                  </div>
                  <p className="py-4 text-slate-950 font-bold hover:text-slate-500">
                    <Link to={`/Post/${post._id}`}>Read more</Link>
                  </p>
                  <div className="flex flex-1 justify-star gap-7">
                    <button className="bg-slate-950 px-5 py-1 rounded-md hover:bg-slate-500">
                      <Link to={`/Edit-Post/${post._id}`}>
                        {' '}
                        <FaRegEdit className="text-slate-200" />
                      </Link>
                    </button>
                    <button
                      className="bg-slate-950 px-5 py-1 rounded-md hover:bg-slate-500"
                      onClick={() => handleDeleteClick(post._id)}>
                      <MdDeleteForever className="text-slate-200" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {deletePostPopUp && (
        <DeletePost
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  )
}

export default MyPosts
