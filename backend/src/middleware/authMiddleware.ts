import { RequestHandler } from 'express'
import jwt from 'jsonwebtoken'

const authenticate: RequestHandler = (req, res, next) => {
  console.log('Cookies:', req.cookies)
  const token = req.cookies.token

  if (!token) {
    return res.status(401).json({ message: 'Access Denied' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string)

    req.user = decoded 
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid Token' })
  }
}

export { authenticate }
