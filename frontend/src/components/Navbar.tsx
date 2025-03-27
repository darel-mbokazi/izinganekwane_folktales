import { useState } from 'react'
import logo from '../assets/logo.png'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { CiMenuBurger } from 'react-icons/ci'
import { MdCancel } from 'react-icons/md'
import { IoIosArrowDropup, IoIosArrowDropdown } from 'react-icons/io'
import { useAuth } from '../context/AuthContext'

const Navbar: React.FC = () => {
  const { user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false) 
  const [showAllLinks, setShowAllLinks] = useState(false) 
  const navigate = useNavigate()
  const location = useLocation()

  const links = [
    { path: '/', label: 'Home' },
    { path: '/All-Posts', label: 'All Posts' },
    ...(user
      ? [
          { path: '/Create-Post', label: 'Create Post' },
          { path: '/My-Posts', label: 'My Posts' },
          { path: '/Favorites', label: 'Favorites' },
        ]
      : []),
  ]

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev) 
  }

  const closeMenu = () => {
    setIsMenuOpen(false) 
  }

  const navigateAndCloseMenu = (path: string) => {
    navigate(path)
    setIsMenuOpen(false) 
  }

  const toggleShowAllLinks = () => {
    setShowAllLinks((prev: boolean) => !prev)
  }

  const activeLink = links.find((link) => location.pathname === link.path) || {
    path: '/',
    label: 'Home',
  }

  const handleLogout = () => {
    logout()
    navigate('/Sign-In')
  }

  return (
    <div className="bg-gray-950 text-slate-300 py-5">
      <div className="flex justify-between px-5 place-items-center">
        <div onClick={() => (window.location.href = '/')}>
          <img src={logo} alt="Logo" className="w-40" />
        </div>
        <div className="flex gap-3 text-slate-300 max-sm:hidden">
          {user ? (
            <>
              <Link to="/Account">
                <button className="border-solid border-slate-300 border-2 px-2 rounded-md">
                  Account
                </button>
              </Link>
              <button
                onClick={handleLogout}
                className="border-solid border-slate-300 border-2 px-2 rounded-md">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/Sign-In">
                <button className="border-solid border-slate-300 border-2 px-2 rounded-md">
                  Sign-In
                </button>
              </Link>
              <Link to="/Sign-Up">
                <button className="border-solid border-slate-300 border-2 px-2 rounded-md">
                  Sign-Up
                </button>
              </Link>
            </>
          )}
        </div>
        {/* for mobile view */}
        <div className="sm:hidden">
          <CiMenuBurger className="text-2xl" onClick={toggleMenu} />
        </div>
      </div>

      <div className="flex place-content-center max-sm:hidden">
        <ul className="flex gap-5 text-slate-300">
          {links.map(
            (link) =>
              location.pathname !== link.path && (
                <li
                  key={link.path}
                  className="hover:underline underline-offset-8 decoration-2 decoration-slate-500">
                  <Link to={link.path}>{link.label}</Link>
                </li>
              )
          )}
        </ul>
      </div>

      {/* for mobile view */}
      <div className="sm:hidden max-sm:flex max-sm:mx-auto max-sm:bg-slate-300 max-sm:text-black max-sm:px-3 max-sm:rounded-sm max-sm:w-3/4 max-sm:mt-5">
        <button
          className="max-sm:flex max-sm:items-center max-sm:justify-between max-sm:w-full max-sm:text-xl"
          onClick={toggleShowAllLinks}>
          {activeLink.label}
          {showAllLinks ? (
            <IoIosArrowDropup className="ml-2" />
          ) : (
            <IoIosArrowDropdown className="ml-2" />
          )}
        </button>
      </div>
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="max-sm:absolute max-sm:bg-slate-300 max-sm:text-black max-sm:p-5 max-sm:w-3/4 max-sm:grid max-sm:mx-11 max-sm:mt-5 max-sm:z-50">
          <div className="max-sm:mb-10">
            <MdCancel onClick={closeMenu} className="text-3xl" />
          </div>
          {user ? (
            <>
              <button
                onClick={() => navigateAndCloseMenu('/Account')}
                className="max-sm:border-solid max-sm:bg-slate-950 max-sm:text-slate-300 max-sm:border-2 max-sm:p-2 max-sm:rounded-md">
                Account
              </button>
              <button
                onClick={handleLogout}
                className="max-sm:border-solid max-sm:bg-slate-950 max-sm:text-slate-300 max-sm:border-2 max-sm:p-2 max-sm:rounded-md">
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigateAndCloseMenu('/Sign-In')}
                className="max-sm:border-solid max-sm:bg-slate-950 max-sm:text-slate-300 max-sm:border-2 max-sm:p-2 max-sm:rounded-md">
                Sign-In
              </button>
              <button
                onClick={() => navigateAndCloseMenu('/Sign-Up')}
                className="max-sm:border-solid max-sm:bg-slate-950 max-sm:text-slate-300 max-sm:border-2 max-sm:p-2 max-sm:rounded-md">
                Sign-Up
              </button>
            </>
          )}
        </div>
      )}

      {/* Links Dropdown */}
      {showAllLinks && (
        <div className="max-sm:absolute max-sm:flex max-sm:m-11 max-sm:flex-col max-sm:bg-slate-300 max-sm:items-center max-sm:w-3/4 max-sm:space-y-3 max-sm:mt-5 max-sm:p-5 max-sm:z-10">
          {links.map((link) => (
            <button
              key={link.path}
              onClick={() => navigateAndCloseMenu(link.path)}
              className={`w-full py-2 text-center bg-slate-950 rounded-lg text-slate-300 ${
                location.pathname === link.path ? 'font-bold' : ''
              }`}>
              {link.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default Navbar
