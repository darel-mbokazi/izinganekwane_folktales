import React from "react"

interface DeletePostProps {
  onConfirm: () => void
  onCancel: () => void
}

const DeleteAccount: React.FC<DeletePostProps> = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-md shadow-md">
        <p>You are about to delete your account</p>
        <div className="flex justify-center gap-7 mt-4">
          <button className="bg-green-600 px-5 rounded-md" onClick={onConfirm}>
            Continue
          </button>
          <button className="bg-red-600 px-5 rounded-md" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteAccount
