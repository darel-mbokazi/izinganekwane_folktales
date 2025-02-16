import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { AxiosError } from 'axios'

const SignUp: React.FC = () => {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
  })

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    general: '', // for backend errors 
  })

  // Field validation functions
  const validateName = (name: string) => {
    if (!name) return 'Name is required'
    if (name.length < 5) return 'Name must be 5 characters or more'
    return ''
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) return 'Email is required'
    if (!emailRegex.test(email)) return 'Invalid email format'
    return ''
  }

  const validatePassword = (password: string) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    if (!password) return 'Password is required'
    if (!passwordRegex.test(password))
      return 'Password must have 8 characters, 1 uppercase, 1 number, and 1 special character'
    return ''
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setData({ ...data, [name]: value })

    if (name === 'name') {
      setErrors({ ...errors, name: validateName(value) })
    } else if (name === 'email') {
      setErrors({ ...errors, email: validateEmail(value) })
    } else if (name === 'password') {
      setErrors({ ...errors, password: validatePassword(value) })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const nameError = validateName(data.name)
    const emailError = validateEmail(data.email)
    const passwordError = validatePassword(data.password)

    setErrors({
      ...errors,
      name: nameError,
      email: emailError,
      password: passwordError,
    })

    // Don't submit if there are validation errors
    if (nameError || emailError || passwordError) {
      return 
    }

try {
  await register(data.name, data.email, data.password)
  navigate('/Sign-In')
} catch (error) {
  if (error instanceof AxiosError && error.response) {
    setErrors({
      ...errors,
      general: error.response.data?.emailExistsError || 'Registration failed',
    })
  } else {
    setErrors({
      ...errors,
      general: 'An unexpected error occurred. Please try again later.',
    })
  }
}
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 text-slate-950">
            <label className="block text-sm font-bold mb-2" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className={`w-full px-3 py-2 border rounded ${
                errors.name
                  ? 'border-red-500'
                  : data.name
                  ? 'border-green-500'
                  : 'border-gray-300'
              }`}
              placeholder="Full Name"
              value={data.name}
              onChange={handleChange}
            />
            {errors.name && <p className="text-red-500">{errors.name}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={`w-full px-3 py-2 border rounded ${
                errors.email
                  ? 'border-red-500'
                  : data.email
                  ? 'border-green-500'
                  : 'border-gray-300'
              }`}
              placeholder="Email"
              value={data.email}
              onChange={handleChange}
            />
            {errors.email && <p className="text-red-500">{errors.email}</p>}
          </div>
          <div className="mb-6">
            <label className="block text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className={`w-full px-3 py-2 border rounded ${
                errors.password
                  ? 'border-red-500'
                  : data.password
                  ? 'border-green-500'
                  : 'border-gray-300'
              }`}
              placeholder="Password"
              value={data.password}
              onChange={handleChange}
            />
            {errors.password && (
              <p className="text-red-500">{errors.password}</p>
            )}
          </div>
          {errors.general && <p className="text-red-500">{errors.general}</p>}
          <div className="flex items-center justify-center ">
            <button
              type="submit"
              className="bg-slate-950 text-slate-300 py-2 px-10 rounded-md mt-2 w-fit hover:bg-slate-500 font-bold focus:outline-none focus:shadow-outline">
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignUp
