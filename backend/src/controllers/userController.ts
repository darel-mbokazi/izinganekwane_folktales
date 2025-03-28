import { RequestHandler } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import UserModel from '../models/User'

interface userInfo {
  name: string
  email: string
  password: string
}

const signUp: RequestHandler<unknown, unknown, userInfo, unknown> = async (
  req,
  res,
  next
) => {
  const name = req.body.name
  const email = req.body.email
  const pwd = req.body.password

  try {
    if (!name || !email || !pwd) {
      res.status(400).json({ fieldRequiredError: 'All field are required' })
    }

    if (name.trim().length < 5) {
      return res
        .status(400)
        .json({ nameError: 'Name must be 5 characters or more' })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ emailError: 'Invalid email format' })
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    if (!passwordRegex.test(pwd)) {
      return res.status(400).json({
        passwordError:
          'Your password must be at least 8 characters long and include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character',
      })
    }

    const existingUser = await UserModel.findOne({ email }).exec()

    if (existingUser) {
      res.status(409).json({ emailExistsError: 'Email already exists' })
    }

    const hashedPassword = await bcrypt.hash(pwd, 10)

    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
    })

    res.status(201).json({ newUser, message: 'User created successfully' })

  } catch (error) {
    next()
  }
}

const signIn: RequestHandler<unknown, unknown, userInfo, unknown> = async (
  req,
  res,
  next
) => {
  const { email, password } = req.body

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ fieldRequiredError: 'All fields are required' })
    }

    const findUser = await UserModel.findOne({ email })
      .select('+password')
      .exec()

    if (!findUser) {
      return res
        .status(401)
        .json({ emailExistsError: 'Incorrect email or password' })
    }

    const passwordMatch = await bcrypt.compare(password, findUser.password)

    if (!passwordMatch) {
      return res
        .status(401)
        .json({ passwordMatchError: 'Incorrect email or password' })
    }

    const token = jwt.sign(
      { userId: findUser._id, email: findUser.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' }
    )

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    })


    res.status(200).json({
      message: 'Sign-In Successful',
      user: {
        userId: findUser.id,
        name: findUser.name,
        email: findUser.email,
      },
      token: token,
    })


  } catch (error) {
    next(error)
  } 
}

const getUser: RequestHandler = async (req, res, next) => {
  const userId = req.params.userId

  try {
    const user = await UserModel.findById(userId).exec()

    if (!user) {
      return res.status(404).json({ gettingUserError: 'User not found' })
    }

    res.status(200).json(user)

  } catch (error) {
    next(error)
  }
}


const updateUserDetails: RequestHandler<
  { userId: string },
  unknown,
  userInfo,
  unknown
> = async (req, res, next) => {
  const userId = req.params.userId
  const { name, email, password } = req.body

  try {

    if (name && name.length < 5) {
      return res
        .status(400)
        .json({ nameError: 'Name must be 5 characters or more' })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (email && !emailRegex.test(email)) {
      return res.status(400).json({ emailError: 'Invalid email format' })
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    if (password && !passwordRegex.test(password)) {
      return res.status(400).json({
        passwordError:
          'Your password must be at least 8 characters long and include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character',
      })
    }

    const user = await UserModel.findById(userId)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (name) user.name = name
    if (email) user.email = email
    if (password) user.password = await bcrypt.hash(password, 10)

    const updatedUser = await user.save()

    res.status(200).json({
      updatedUser,
      updatedUserSuccess: 'Updated successfully',
    })

    if (!updatedUser) {
      return res
        .status(404)
        .json({ updatingUserError: 'There was an error updating user details' })
    }

  } catch (error) {
    next(error)
  }
}

const forgotPassword: RequestHandler = async (req, res, next) => {
  const { email } = req.body

  try {
    const oldUser = await UserModel.findOne({ email }).exec()
    if (!oldUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    const secret = process.env.JWT_SECRET + oldUser.password
    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
      expiresIn: '1hr',
    })

    const resetUrl = `https://izinganekwane-folktales-backend.vercel.app/api/users/reset-password/${oldUser._id}/${token}`

    res.status(200).json({ resetUrl, message: 'Password reset link sent' })
  } catch (error) {
    next(error)
  }
}

const resetPassword: RequestHandler = async (req, res, next) => {
  const { id, token } = req.params
  console.log(req.params)

  const oldUser = await UserModel.findOne({ _id: id }).exec()
  if (!oldUser) {
    return res.status(404).json({ message: 'User not found' })
  }

  const secret = process.env.JWT_SECRET +
    oldUser.password
  try {
    const tokenIsValid = jwt.verify(token, secret)

    if (!tokenIsValid) {
      return res.status(400).json({ message: 'Not Verified' })
    }

    res.status(200).json({ message: 'Verified' })
  } catch (error) {
    next(error)
  }
}

const deleteUser: RequestHandler = async (req, res, next) => {
  const userId = req.params.userId

  try {
    const user = await UserModel.findByIdAndDelete(userId)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.clearCookie('token')
    res.status(200).json({ message: 'User deleted successfully' })
  } catch (error) {
    next(error)
  }
}

const signout: RequestHandler = (req, res, next) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  })
  res.status(200).json({ message: 'Logout successful' })
}

export {
  signUp,
  signIn,
  getUser,
  updateUserDetails,
  forgotPassword,
  resetPassword,
  deleteUser,
  signout,
}
