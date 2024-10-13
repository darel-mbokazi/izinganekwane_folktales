import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Account: React.FC = () => {
  const { user, updateUser, deleteUser } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [isChanged, setIsChanged] = useState(false)
  const [deleteAccountPopUp, setDeleteAccountPopUp] = useState<boolean>(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setEmail(user.email || '')
    }            
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === 'name') {
      setName(value)
    } else if (name === 'email') {
      setEmail(value)
    }
    setIsChanged(true)
  }

  const handleSaveChanges = async () => {
    if (user?._id) {
      try {
        await updateUser(user._id, name, email)
        setIsChanged(false)
  
      } catch (error) {
        console.error('Failed to update user', error)
      }
    } else {
      console.error('User ID is missing')
    }
  }

  const handleDeleteAccount = async () => {
    if (user?._id) {
      try {
        await deleteUser(user._id)
        navigate('/Sign-In')
      } catch (error) {
        console.error('Failed to delete user', error)
      }
    } else {
      console.error('User ID is missing')
    }
  }


  return (
    <div className="container mx-auto p-10 h-screen">
      <h1 className="text-2xl font-bold mb-7 text-center">Account Details</h1>
      <div className="mb-4">
        <label className="block mb-2">Name</label>
        <input
          type="text"
          name="name"
          value={name}
          onChange={handleChange}
          className="w-1/4 max-sm:w-full px-3 py-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Email</label>
        <input
          type="email"
          name="email"
          value={email}
          onChange={handleChange}
          className="w-1/4 max-sm:w-full px-3 py-2 border rounded"
        />
      </div>
      <button
        onClick={handleSaveChanges}
        disabled={!isChanged}
        className={`bg-slate-950 text-slate-300 py-2 px-10 rounded-md mt-10 w-fit hover:bg-slate-500 ${
          !isChanged && 'opacity-50 cursor-not-allowed'
        }`}>
        Save Changes
      </button>
      <p
        className="pt-20 text-red-600 hover:text-slate-950 cursor-pointer"
        onClick={() => setDeleteAccountPopUp(true)}>
        Delete Account
      </p>

      {deleteAccountPopUp && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 shadow-lg rounded max-sm:w-5/6">
          <p className="text-center text-lg font-bold mb-4">
            Are you sure you want to delete your account?
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={handleDeleteAccount}
              className="bg-red-600 text-white py-2 px-6 rounded-md hover:bg-red-700">
              Yes, Delete
            </button>
            <button
              onClick={() => setDeleteAccountPopUp(false)}
              className="bg-gray-600 text-white py-2 px-6 rounded-md hover:bg-gray-700">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Account
