import React, { createContext, useState, useEffect } from 'react'
import axios from 'axios'
import { User } from '../models/User'

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  updateUser: (userId: string, name: string, email: string) => Promise<void>
  deleteUser: (userId: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Fetch the authenticated user 
    const fetchUser = async () => {
      try {
        const authResponse = await axios.get(
          'https://izinganekwane-folktales-backend.vercel.app/api/users',
          {
            withCredentials: true,
          }
        )
        const userId = authResponse.data.user.userId

        // Fetch the full user details using the GetUserById endpoint
        const fullUserResponse = await axios.get(
          `https://izinganekwane-folktales-backend.vercel.app/api/users/${userId}`,
          { withCredentials: true }
        )
        setUser(fullUserResponse.data)
      } catch (error) {
        console.error('User not authenticated:', error)
      }
    }
    fetchUser()
  }, [])

  const register = async (name: string, email: string, password: string) => {
    try {
      await axios.post('https://izinganekwane-folktales-backend.vercel.app/api/users/sign-up', {
        name,
        email,
        password,
      })
    } catch (error) {
      console.error('Registration error:', error)
    }
  }

const login = async (email: string, password: string) => {
  try {
    const authResponse = await axios.post(
      'https://izinganekwane-folktales-backend.vercel.app/api/users/sign-in',
      { email, password },
      { withCredentials: true }
    )

    console.log('Login response:', authResponse.data)

    if (!authResponse.data.user) {
      throw new Error('User data is not available in the response')
    }

    const userId = authResponse.data.user.userId

    const fullUserResponse = await axios.get(
      `https://izinganekwane-folktales-backend.vercel.app/api/users/${userId}`,
      { withCredentials: true }
    )
    setUser(fullUserResponse.data)
  } catch (error) {
    console.error('Login error:', error)
  }
}


  const logout = async () => {
    try {
      await axios.get('https://izinganekwane-folktales-backend.vercel.app/api/users/sign-out', {
        withCredentials: true,
      })
      console.log('Logout Successfully')
      setUser(null)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const updateUser = async (userId: string, name: string, email: string) => {
    try {
      const response = await axios.put(
        `https://izinganekwane-folktales-backend.vercel.app/api/users/${userId}`,
        { name, email },
        { withCredentials: true }
      )
      setUser(response.data.updatedUser)
    } catch (error) {
      console.error('Update user error:', error)
    }
  }

  const deleteUser = async (userId: string) => {
    try {
      await axios.delete(`https://izinganekwane-folktales-backend.vercel.app/api/users/${userId}`, {
        withCredentials: true,
      })
      setUser(null)
    } catch (error) {
      console.error('Delete user error:', error)
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, register, login, logout, updateUser, deleteUser }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
