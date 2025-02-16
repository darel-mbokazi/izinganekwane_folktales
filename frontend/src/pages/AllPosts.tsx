import { useEffect, useState } from 'react'
import { Posts } from '../models/Post'
import { Link } from 'react-router-dom'
import { API_URL } from '../config.ts';

const AllPosts = () => {
  const [posts, setPosts] = useState<Posts[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 6 

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${API_URL}/posts/`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
        const post = await response.json()
        // Sort posts by createdAt date 
        post.sort((a: Posts, b: Posts) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        })
        setPosts(post)
      } catch (error) {
        console.error(error)
      }
    }
    fetchPosts()
  }, [])

  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost)

  // Function to strip HTML tags from content
  const stripHtmlTags = (html: string) => {
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = html
    return tempDiv.textContent || tempDiv.innerText || ''
  }

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  return (
    <div className="px-5 grid place-content-center place-items-center">
      <h1 className='text-center text-3xl font-bold py-10'>All Posts</h1>
      <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
        {currentPosts.map((post) => (
          <div key={post._id} className="p-5 flex flex-1 w-full">
            <div className="max-w-lg rounded overflow-hidden shadow-lg p-4 grid place-center-center">
              <h1>Kwesukesukela</h1>
              <h2 className="font-bold">{post.title.toUpperCase()}</h2>
              <p className="italic">Cosu</p>
              <p className="italic">Sampheka ngogozwana!</p>
              <p className="italic py-5">By: {post.author}</p>
              <div className="text-gray-800 leading-7 mb-6">
                {stripHtmlTags(post.content).slice(0, 200)}...
              </div>
              <p className="py-4 text-slate-950 font-bold hover:text-slate-500">
                <Link to={`/Post/${post._id}`}>Read more</Link>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-10">
        {[...Array(Math.ceil(posts.length / postsPerPage)).keys()].map(
          (number) => (
            <button
              key={number}
              onClick={() => paginate(number + 1)}
              className={`flex gap-5 items-center justify-center w-10 h-10 mx-2 rounded-full ${currentPage === number + 1
                  ? 'bg-slate-500 text-slate-300'
                  : 'bg-slate-950 text-slate-300'
                }`}
            >
              <span>{number + 1}</span>
            </button>
          )
        )}
      </div>
    </div>
  )
}

export default AllPosts