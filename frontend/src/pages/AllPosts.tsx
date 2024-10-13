import { useEffect, useState } from 'react'
import { Posts } from '../models/Post'
import PostList from '../components/PostList'

const AllPosts = () => {
  const [posts, setPosts] = useState<Posts[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 10

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          'https://izinganekwane-folktales-backend.vercel.app/api/posts/',
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        )
        const post = await response.json()
        post.sort((a: Posts, b: Posts) => {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
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

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  return (
    <div className="px-5">
      <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
        {currentPosts.map((post) => (
          <div
            className="border p-4 mt-5 hover:transition hover:ease-in-out hover:transform hover:skew-y-1 hover:bg-slate-50"
            key={post._id}>
            <PostList post={post} />
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-10">
        {[...Array(Math.ceil(posts.length / postsPerPage)).keys()].map(
          (number) => (
            <button
              key={number}
              onClick={() => paginate(number + 1)}
              className={`flex gap-5 items-center justify-center w-10 h-10 mx-2 rounded-full ${
                currentPage === number + 1
                  ? 'bg-slate-500 text-slate-300'
                  : 'bg-slate-950 text-slate-300'
              }`}>
              <span>{number + 1}</span>
            </button>
          )
        )}
      </div>
    </div>
  )
}

export default AllPosts
