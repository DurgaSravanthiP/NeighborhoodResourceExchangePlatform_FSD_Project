import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import { loginUser } from '../services/api'
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowLeft } from 'react-icons/fi'

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await loginUser(form)
      login(data)
      toast.success(`Welcome back, ${data.name}! 👋`)
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 relative">
      {/* Desktop Back button */}
      <div className="hidden lg:block absolute top-8 left-8">
        <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-emerald-600 text-sm font-semibold shadow-sm transition-all">
          <FiArrowLeft size={16} /> Back to Home
        </Link>
      </div>

      <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">

        {/* Left Image Panel */}
        <div className="hidden lg:flex flex-1 justify-end items-center">
          <img
            src="https://i.pinimg.com/1200x/90/46/15/90461543644b83ede93f66548e906648.jpg"
            alt="Community"
            className="w-full max-w-[600px] object-contain mix-blend-multiply"
          />
        </div>

        {/* Right Form Panel */}
        <div className="w-full max-w-md">
          {/* Back to Home Mobile */}
          <Link to="/" className="inline-flex lg:hidden items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-emerald-600 text-sm font-semibold mb-8 shadow-sm transition-all">
            <FiArrowLeft size={16} /> Back to Home
          </Link>

          <div className="mb-7 text-center">
            <h2 className="font-display text-4xl font-bold text-gray-900 mb-2">Sign in</h2>
            <p className="text-gray-500">Access your account to browse and borrow</p>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-7">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email address</label>
                <div className="relative">
                  <FiMail className="absolute left-3.5 top-3.5 text-gray-400" />
                  <input type="email" required className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all bg-gray-50 focus:bg-white text-gray-800 placeholder-gray-400"
                    placeholder="you@example.com"
                    value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-3.5 text-gray-400" />
                  <input type={showPw ? 'text' : 'password'} required
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all bg-gray-50 focus:bg-white text-gray-800 placeholder-gray-400"
                    placeholder="••••••••"
                    value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600">
                    {showPw ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-emerald-600 text-white py-3.5 rounded-xl font-semibold hover:bg-emerald-700 active:scale-[0.98] transition-all shadow-md mt-2 disabled:opacity-60">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : 'Sign In'}
              </button>
            </form>
          </div>

          <p className="text-center mt-5 text-gray-500 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-emerald-600 font-bold hover:underline">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
