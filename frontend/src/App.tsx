import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Account from './pages/Account'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import AllPosts from './pages/AllPosts'
import CreatePost from './pages/CreatePost'
import MyPosts from './pages/MyPosts'
import Favorites from './pages/Favorites'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import EditPost from './pages/EditPost'
import Post from './pages/Post'
import Footer from './components/Footer'
import axios from 'axios'

function App() {
  axios.defaults.baseURL = 'https://izinganekwane-folktales-backend.vercel.app'
  axios.defaults.withCredentials = true

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Account" element={<Account />} />
          <Route path="/Sign-In" element={<SignIn />} />
          <Route path="/Sign-Up" element={<SignUp />} />
          <Route path="/All-Posts" element={<AllPosts />} />
          <Route path="/Post/:postId" element={<Post />} />
          <Route path="/Create-Post" element={<CreatePost />} />
          <Route path="/Edit-Post/:postId" element={<EditPost />} />
          <Route path="/My-Posts" element={<MyPosts />} />
          <Route path="/Favorites" element={<Favorites />} />
          <Route path="/Forgot-Password" element={<ForgotPassword />} />
          <Route path="/Reset-Password/:resetToken"element={<ResetPassword />}
          />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  )
}

export default App
