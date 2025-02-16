import React, { useEffect, useState, SyntheticEvent, useRef } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { Posts } from '../models/Post'
import { AiFillLike, AiOutlineLike } from 'react-icons/ai'
import { BiSolidDislike, BiDislike } from 'react-icons/bi'
import { MdDeleteForever, MdFavorite, MdFavoriteBorder } from 'react-icons/md'
import { CiShare1 } from 'react-icons/ci'
import { FaTwitter, FaFacebook, FaInstagram } from 'react-icons/fa'
import EmojiClickData from 'emoji-picker-react'
import { useAuth } from '../context/AuthContext'
import { API_URL } from '../config.ts';

interface Comment {
  _id: string
  content: string
  authorId: string
  authorName: string 
  replies: Reply[]
}

interface Reply {
  _id: string
  content: string
  authorId: string
  authorName: string 
}

const Post: React.FC = () => {
  const { postId } = useParams<{ postId: string }>()
  const [post, setPost] = useState<Posts | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [liked, setLiked] = useState<boolean>(false)
  const [disliked, setDisliked] = useState<boolean>(false)
  const [favorited, setFavorited] = useState<boolean>(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState<string>('')
  const [reply, setReply] = useState<{ [key: string]: string }>({})
  const [sharing, setSharing] = useState<boolean>(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false) 
  const emojiPickerRef = useRef<HTMLDivElement>(null); // Ref for the emoji picker div
  const { user } = useAuth()

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/posts/${postId}`
        )
        setPost(response.data)
        setLiked(response.data.likes.includes(user?._id))
        setDisliked(response.data.dislikes.includes(user?._id))
        setFavorited(response.data.favorites.includes(user?._id))
        setComments(response.data.comments)
        setLoading(false)
      } catch (err) {
        setError('Error fetching post')
        setLoading(false)
      }
    }

    fetchPost()
  }, [postId, user])

  const handleLike = async () => {
    if (!user) return
    try {
      console.log('Liking/Unliking post...')
      await axios.post(
        `${API_URL}/posts/reactions/${postId}/like`,
        {},
        {
          withCredentials: true,
        }
      )
      setLiked(!liked)
      setDisliked(false)
    } catch (err) {
      console.error('Error liking post:', err)
    }
  }

  const handleDislike = async () => {
    if (!user) return
    try {
      console.log('Disliking post...')
      await axios.post(
        `${API_URL}/posts/reactions/${postId}/dislike`,
        {},
        {
          withCredentials: true,
        }
      )
      setDisliked(!disliked)
      setLiked(false)
    } catch (err) {
      console.error('Error disliking post:', err)
    }
  }

  const handleFavorite = async () => {
    if (!user) return
    try {
      console.log('Adding/removing favorite...')
      await axios.post(
        `${API_URL}/posts/reactions/${postId}/favorite`,
        {},
        {
          withCredentials: true,
        }
      )
      setFavorited(!favorited)
    } catch (err) {
      console.error('Error adding/removing favorite:', err)
    }
  }

  const handleCommentSubmit = async (e: SyntheticEvent) => {
    e.preventDefault()
    if (!user || !newComment.trim()) return

    console.log('Submitting comment:', newComment)

    try {
      const response = await axios.post(
        `${API_URL}/posts/comments/${postId}/add-comment`,
        { content: newComment },
        { withCredentials: true }
      )
      console.log('Comment added:', response.data)
      setComments([...comments, response.data])
      setNewComment('')

    } catch (err) {
      console.error('Error adding comment:', err)
    }
  }

  const handleReplySubmit = async (commentId: string) => {
    if (!user || !reply[commentId]?.trim()) return

    console.log('Submitting reply:', reply[commentId])

    try {
      const response = await axios.post(
        `${API_URL}/posts/comments/${postId}/comment/${commentId}/add-reply`,
        { content: reply[commentId] },
        { withCredentials: true }
      )
      setComments(response.data.comments)
      setReply((prev) => ({ ...prev, [commentId]: '' }))

      console.log('Reply added:', response.data)
      
    } catch (err) {
      console.error('Error adding reply:', err)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!user) return

    console.log('Deleting comment:', commentId)

    try {
      await axios.delete(
        `${API_URL}/posts/comments/${postId}/comment/${commentId}/delete-comment`,
        { withCredentials: true }
      )
      setComments((prevComments) =>
        prevComments.filter((comment) => comment._id !== commentId)
      )
      console.log('Comment deleted')
    } catch (err) {
      console.error('Error deleting comment:', err)
    }
  }

  const handleDeleteReply = async (commentId: string, replyId: string) => {
    if (!user) return

    console.log('Deleting reply:', replyId)

    try {
      await axios.delete(
        `${API_URL}/posts/comments/${postId}/comment/${commentId}/reply/${replyId}/delete-reply`,
        { withCredentials: true }
      )

      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === commentId
            ? {
                ...comment,
                replies: comment.replies.filter(
                  (reply) => reply._id !== replyId
                ),
              }
            : comment
        )
      )
      console.log('Reply deleted')
    } catch (err) {
      console.error('Error deleting reply:', err)
    }
  }

  const handleShare = () => {
    console.log('Toggling share modal')
    setSharing(!sharing)
  }

  // Function to handle emoji click
  const handleEmojiClick = (emojiObject: { emoji: string }) => {
    setNewComment((prevComment) => prevComment + emojiObject.emoji);
  };

  // Function to handle clicks outside the emoji picker
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false); 
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (loading) {
    console.log('Loading post data...')
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    )
  }

  if (error) {
    console.log('Error fetching post:', error)
    return (
      <div className="flex justify-center items-center h-screen">{error}</div>
    )
  }

  if (!post) {
    console.log('No post found')
    return (
      <div className="flex justify-center items-center h-screen">
        No post found
      </div>
    )
  }

  return (
    <div className="container overflow-x-hidden mx-auto p-5 md:p-10 grid place-content-center w-4/5 max-sm:w-full">
      <div className="bg-slate-950 text-slate-300 shadow-md rounded-lg p-6 md:p-12 max-sm:p-3 max-sm:bg-transparent max-sm:text-slate-950">
        <h1 className="text-3xl font-bold mb-16 text-center max-sm:text-2xl">
          {post.title.toUpperCase()}
        </h1>
        <h2>Kwesukesukela</h2>
        <p className="italic">Cosu</p>
        <p className="italic">Sampheka ngogozwana!</p>
        <div className="text-slate-300 leading-7 my-6 max-sm:text-slate-950">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
        <p className="italic">Cosi, Cosi Iyaphela! </p>
        <p className="italic py-5">Written By: <span className='text-slate-500'>{post.author}</span></p>
        <div className="flex justify-between my-auto place-items-center mt-8">
          <div className="flex items-center space-x-4">
            <button onClick={handleLike}>
              {liked ? (
                <AiFillLike className="text-2xl" />
              ) : (
                <AiOutlineLike className="text-2xl" />
              )}
            </button>
            <button onClick={handleDislike}>
              {disliked ? (
                <BiSolidDislike className="text-2xl" />
              ) : (
                <BiDislike className="text-2xl" />
              )}
            </button>
            <button onClick={handleFavorite}>
              {favorited ? (
                <MdFavorite className="text-2xl text-red-700" />
              ) : (
                <MdFavoriteBorder className="text-2xl" />
              )}
            </button>
          </div>
          <div className="relative">
            <button onClick={handleShare}>
              <CiShare1 className="text-2xl" />
            </button>
          </div>
        </div>

        {/* Share Popup */}
        {sharing && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white text-slate-950 p-5 rounded-lg w-2/4 flex flex-col items-center space-y-4 max-sm:w-fit max-sm:p-4 max-sm:bg-slate-200">
              <h3 className="text-xl font-bold">Share this post</h3>

              {/* Social Media Icons */}
              <div className="flex space-x-4">
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    post.title
                  )}&url=${window.location.href}`}
                  target="_blank"
                  rel="noopener noreferrer">
                  <FaTwitter className="text-blue-500" size={24} />
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    window.location.href
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer">
                  <FaFacebook className="text-blue-700" size={24} />
                </a>
                <a
                  href={`https://www.instagram.com/?url=${encodeURIComponent(
                    window.location.href
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer">
                  <FaInstagram className="text-pink-500" size={24} />
                </a>
              </div>

              {/* Copy Link Section */}
              <div className="flex items-center space-x-2 border p-2 rounded-lg w-full">
                <input
                  type="text"
                  value={window.location.href}
                  readOnly
                  className="flex-grow p-2 border-none focus:outline-none"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href)
                    alert('Link copied to clipboard!')
                  }}
                  className="bg-slate-950 hover:bg-slate-500 text-slate-200 px-4 py-2 rounded-lg">
                  Copy
                </button>
              </div>

              <button
                onClick={handleShare}
                className="mt-4 bg-slate-950 hover:bg-slate-500 text-white px-4 py-2 rounded-lg">
                Close
              </button>
            </div>
          </div>
        )}

        {/* Comment Section */}
        <div className="mt-8">
          <h3 className="text-xl font-bold pb-5">Comments</h3>
          <ul>
            {comments.map((comment) => (
              <li key={comment._id} className="mb-4 ">
                <div className="border p-4 rounded-lg">
                  <p className="flex justify-between">
                    <span>
                      <strong>{comment.authorName}</strong>: {comment.content}
                    </span>
                    {comment.authorId === user?._id && (
                      <span>
                        <MdDeleteForever
                          className="hover:text-red-700 text-xl cursor-pointer"
                          onClick={() => handleDeleteComment(comment._id)}
                        />
                      </span>
                    )}
                  </p>
                  {comment.replies.length > 0 && (
                    <ul className="ml-4 mt-4">
                      {comment.replies.map((reply) => (
                        <li
                          key={reply._id}
                          className="border p-2 rounded-lg mb-2">
                          <p className="flex justify-between">
                            <span>
                              <strong>{reply.authorName}</strong>: {reply.content}
                            </span>
                            {reply.authorId === user?._id && (
                              <span>
                                <MdDeleteForever
                                  className="hover:text-red-700 text-xl cursor-pointer"
                                  onClick={() =>
                                    handleDeleteReply(comment._id, reply._id)
                                  }
                                />
                              </span>
                            )}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                  {/* Reply input */}
                  {user && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault()
                        handleReplySubmit(comment._id)
                      }}
                      className="mt-4 relative">
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          value={reply[comment._id] || ''}
                          onChange={(e) =>
                            setReply((prev) => ({
                              ...prev,
                              [comment._id]: e.target.value,
                            }))
                          }
                          placeholder="Write a reply..."
                          className="border p-2 rounded-lg w-full text-slate-950 pr-10"
                        />
                      </div>

                      <button
                        type="submit"
                        className="bg-slate-600 hover:bg-slate-500 text-slate-200 px-4 py-2 rounded-lg mt-2">
                        Reply
                      </button>
                    </form>
                  )}
                </div>
              </li>
            ))}
          </ul>

          {/* New Comment Input */}
          {user ? (
            <form onSubmit={handleCommentSubmit} className="mt-4 relative">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewComment(e.target.value)
                  }
                  placeholder="Write a comment..."
                  className="border p-2 rounded-lg w-full text-slate-950 pr-10"
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  😊
                </button>
              </div>
              {showEmojiPicker && (
                <div
                  ref={emojiPickerRef} // Attach the ref to the emoji picker div
                  className="fixed inset-0 flex items-center m-auto z-50 w-fit max-sm:w-3/4"
                >
                  <EmojiClickData onEmojiClick={handleEmojiClick} />
                </div>
              )}
              <button
                type="submit"
                className="bg-slate-600 hover:bg-slate-500 text-slate-200 px-4 py-2 rounded-lg mt-2"
              >
                Comment
              </button>
            </form>
          ) : (
            <p className="mt-4 text-gray-500">
              You must be logged in to comment.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Post
