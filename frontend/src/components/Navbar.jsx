import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FiHome, FiGrid, FiPlus, FiMessageSquare, FiUser, FiLogOut, FiBell, FiPackage, FiMenu, FiX } from 'react-icons/fi'
import { useState } from 'react'

const Navbar = () => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = [
    { to: '/dashboard', icon: <FiHome size={16} />, label: 'Home' },
    { to: '/browse', icon: <FiGrid size={16} />, label: 'Browse' },
    { to: '/add-item', icon: <FiPlus size={16} />, label: 'List Item' },
    { to: '/my-items', icon: <FiPackage size={16} />, label: 'My Items' },
    { to: '/requests', icon: <FiBell size={16} />, label: 'Requests' },
    { to: '/messages', icon: <FiMessageSquare size={16} />, label: 'Messages' },
    { to: '/profile', icon: <FiUser size={16} />, label: 'Profile' },
  ]

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/')

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2.5 group shrink-0">
          <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform text-lg">
            🏘️
          </div>
          <span className="font-display font-bold text-xl text-gray-800 hidden sm:block">
            Neighbour<span className="text-emerald-600">Share</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        {user && (
          <div className="hidden lg:flex items-center gap-1.5">
            {navLinks.map(({ to, icon, label }) => {
              const active = isActive(to);
              return (
                <Link key={to} to={to}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200
                    ${active
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200 scale-105'
                      : 'bg-emerald-50/50 text-emerald-800 hover:bg-emerald-100 hover:text-emerald-900 border border-emerald-100/50'}`}>
                  <span className={active ? 'text-white' : 'text-emerald-600'}>{icon}</span>
                  {label}
                </Link>
              );
            })}
            <button onClick={logout}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 transition-all ml-2">
              <FiLogOut size={15} /> Logout
            </button>
          </div>
        )}

        {/* Not logged in */}
        {!user && (
          <div className="flex gap-2">
            <Link to="/login" className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-800 rounded-xl hover:bg-gray-50 transition-all">Login</Link>
            <Link to="/register" className="px-4 py-2 text-sm font-semibold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all shadow-sm">Sign Up</Link>
          </div>
        )}

        {/* Mobile hamburger */}
        {user && (
          <button className="lg:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-50 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        )}
      </div>

      {/* Mobile Menu */}
      {user && menuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-3 py-3 grid grid-cols-2 gap-1 animate-fade-in">
          {navLinks.map(({ to, icon, label }) => (
            <Link key={to} to={to} onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
                ${isActive(to) ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50'}`}>
              {icon} {label}
            </Link>
          ))}
          <button onClick={logout}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 col-span-2 mt-1">
            <FiLogOut size={15} /> Logout
          </button>
        </div>
      )}
    </nav>
  )
}

export default Navbar
