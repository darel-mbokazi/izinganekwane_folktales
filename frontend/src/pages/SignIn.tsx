import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

const SignIn: React.FC = () => {
  const [data, setData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<{
    email: string
    password: string
    general: string
  }>({
    email: '',
    password: '',
    general: '',
  })
  const navigate = useNavigate()
  const { login } = useAuth()

  // Validation functions
  const validateEmail = (email: string): string => {
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
    setData({
      ...data,
      [name]: value,
    })

    if (name === 'email') {
      setErrors({
        ...errors,
        email: validateEmail(value),
        general: '',
      })
    } else if (name === 'password') {
      setErrors({
        ...errors,
        password: validatePassword(value),
        general: '',
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all fields before submission
    const emailError = validateEmail(data.email)
    const passwordError = validatePassword(data.password)

    setErrors({
      ...errors,
      email: emailError,
      password: passwordError,
      general: '',
    })

    if (emailError || passwordError) {
      return 
    }

    try {
      const loginInfo = await login(data.email, data.password)
      console.log(loginInfo)

      navigate('/')

    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setErrors({
          ...errors,
          general:
            error.response.data?.message || 'An unexpected error occurred.',
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
        <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
        <form onSubmit={handleSubmit}>
          {errors.general && (
            <p className="mb-4 text-red-600 text-center">{errors.general}</p>
          )}

          <div className="mb-4 text-slate-950">
            <label className="block text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
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
            {errors.email && (
              <p className="mt-1 text-red-500 text-sm">{errors.email}</p>
            )}
          </div>
          <div className="mb-6">
            <label className="block text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
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
              <p className="mt-1 text-red-500 text-sm">{errors.password}</p>
            )}
          </div>
          <p className="mb-5 text-red-600 hover:text-slate-300">
            <Link to="/Forgot-Password">Forgot Password?</Link>
          </p>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-slate-950 text-slate-300 py-2 px-10 rounded-md mt-2 w-fit hover:bg-slate-500 font-bold focus:outline-none focus:shadow-outline">
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignIn
