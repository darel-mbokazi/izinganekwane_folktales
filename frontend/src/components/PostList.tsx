import { Posts } from '../models/Post'
import { Link } from 'react-router-dom'

interface PostProps {
  post: Posts
}

const PostList = ({ post }: PostProps) => {
  const { title, author, content, createdAt, updatedAt } = post

  const stripHtmlTags = (html: string) => {
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = html
    return tempDiv.textContent || tempDiv.innerText || ''
  }

  const dateFormat = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const postCreatedOrUpdated =
    createdAt >= updatedAt
      ? 'Created: ' + dateFormat(createdAt)
      : 'Updated: ' + dateFormat(updatedAt)

  const capitalizeWords = (str: string) => {
    return str
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }

  return (
    <div className="p-2">
      <h1 className="text-2xl font-semibold text-center pb-7 max-sm:text-xl">
        {title.toUpperCase()}
      </h1>
      <h1>Kwesukesukela</h1>
      <p className="italic">Cosu</p>
      <h2 className="font-bold">{title.toUpperCase()}</h2>
      <p className="italic">Sampheka ngogozwana!</p>
      <p className="pb-5 pt-1">
        By:{' '}
        <span className="text-slate-950 font-semibold">
          {capitalizeWords(author)}
        </span>
      </p>
      <p>{stripHtmlTags(content).slice(0, 300)}...</p>
      <p className="py-4 text-slate-950 font-bold hover:text-slate-500">
        <Link to={`/Post/${post._id}`}>Read more</Link>
      </p>
      <p>{postCreatedOrUpdated}</p>
    </div>
  )
}

export default PostList
