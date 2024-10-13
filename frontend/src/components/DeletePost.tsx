import React from 'react'

interface DeletePostProps {
  onConfirm: () => void
  onCancel: () => void
}

const DeletePost: React.FC<DeletePostProps> = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-md shadow-md">
        <p>Are you sure you want to delete this post?</p>
        <div className="flex justify-center gap-7 mt-4">
          <button className="bg-green-600 px-5 rounded-md" onClick={onConfirm}>
            Yes
          </button>
          <button className="bg-red-600 px-5 rounded-md" onClick={onCancel}>
            No
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeletePost
