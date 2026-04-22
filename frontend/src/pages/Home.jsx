import { Link } from 'react-router-dom'
import { FiArrowRight, FiUsers, FiRefreshCw, FiShield, FiGrid, FiMessageSquare, FiBell, FiUser, FiPackage } from 'react-icons/fi'
import { useState } from 'react'

const heroImages = [
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  'https://images.unsplash.com/photo-1517732306149-e8f829eb588a?w=600&q=80',
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80',
]

const itemShowcase = [
  { img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80', label: 'Fiction Books', tag: 'Books', color: 'bg-blue-100 text-blue-600' },
  { img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80', label: 'Winter Jacket', tag: 'Clothing', color: 'bg-rose-100 text-rose-600' },
  { img: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&q=80', label: 'Acoustic Guitar', tag: 'Hobbies', color: 'bg-amber-100 text-amber-600' },
  { img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80', label: 'Vintage Camera', tag: 'Electronics', color: 'bg-purple-100 text-purple-600' },
  { img: 'https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?w=400&q=80', label: 'Stand Mixer', tag: 'Kitchen', color: 'bg-pink-100 text-pink-600' },
  { img: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&q=80', label: 'Indoor Plant', tag: 'Garden', color: 'bg-lime-100 text-lime-600' },
]

const steps = [
  { num: '01', icon: '📸', title: 'List Your Item', desc: 'Take a photo, add a description, set availability. Takes under 2 minutes.' },
  { num: '02', icon: '🔍', title: 'Browse & Request', desc: 'Search nearby items by category. Send a borrow request with a message.' },
  { num: '03', icon: '💬', title: 'Chat & Coordinate', desc: 'Message the owner in real-time to arrange pickup and return.' },
  { num: '04', icon: '🤝', title: 'Borrow & Return', desc: 'Pick up the item, use it, return it. Owner marks it as returned.' },
]

const testimonials = [
  { name: 'Priya S.', loc: 'Banjara Hills', text: 'Borrowed a pressure washer for my terrace — saved ₹3,000! The owner was so kind.', avatar: 'P' },
  { name: 'Rahul M.', loc: 'Kondapur', text: 'Listed my unused camera and now 4 neighbours have borrowed it. Love this community!', avatar: 'R' },
  { name: 'Sneha K.', loc: 'Madhapur', text: 'Found a cake mixer for my daughter\'s birthday in minutes. Absolutely amazing platform.', avatar: 'S' },
]

const Home = () => {
  const [activeImg, setActiveImg] = useState(0)

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-[#0f4c35] via-[#1a6b4a] to-[#2d9b6f] overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-[-80px] right-[-80px] w-[400px] h-[400px] rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-[-60px] left-[-60px] w-[300px] h-[300px] rounded-full bg-emerald-300/10 blur-2xl" />

        <div className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          {/* Left text */}
          <div className="text-white">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6 border border-white/20">
              🌱 Community-powered sharing platform
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-bold leading-tight mb-6">
              Share More.<br />
              <span className="text-emerald-300">Spend Less.</span><br />
              Live Together.
            </h1>
            <p className="text-emerald-100 text-lg leading-relaxed mb-8 max-w-lg">
              NeighbourShare lets you borrow everyday items from people nearby —
              tools, books, appliances and more. Build community while saving money.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/register"
                className="bg-white text-emerald-800 px-8 py-3.5 rounded-2xl font-bold hover:bg-emerald-50 transition-all shadow-xl flex items-center gap-2 text-base active:scale-95">
                Get Started Free <FiArrowRight />
              </Link>
              <Link to="/login"
                className="border-2 border-white/40 text-white px-8 py-3.5 rounded-2xl font-semibold hover:bg-white/10 transition-all text-base active:scale-95">
                Sign In
              </Link>
            </div>
            {/* Stats row */}
            <div className="flex gap-8 mt-10 pt-8 border-t border-white/20">
              {[['500+', 'Items Listed'], ['200+', 'Neighbours'], ['1000+', 'Borrows Done']].map(([n, l]) => (
                <div key={l}>
                  <p className="font-display text-2xl font-bold text-white">{n}</p>
                  <p className="text-emerald-300 text-sm">{l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right image collage */}
          <div className="relative hidden lg:block">
            <div className="relative w-full aspect-square max-w-[1000px] mx-auto">
              {/* Main image */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20">
                <img
                  src="https://i.pinimg.com/1200x/91/fb/7a/91fb7a956e7e0bdfb1c776789d24c899.jpg"
                  alt="Community sharing"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              {/* Floating card top-left */}
              <div className="absolute -top-6 -left-6 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-3 w-44">
                <img src="https://images.unsplash.com/photo-1504148455328-c376907d081c?w=80&q=80"
                  className="w-10 h-10 rounded-xl object-cover" alt="drill" />
                <div>
                  <p className="text-xs font-bold text-gray-800">Power Drill</p>
                  <p className="text-xs text-emerald-600 font-semibold">✓ Available</p>
                </div>
              </div>
              {/* Floating card bottom-right */}
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-3 w-48">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-lg">💬</div>
                <div>
                  <p className="text-xs font-bold text-gray-800">New Message</p>
                  <p className="text-xs text-gray-500">"Can I borrow it tmrw?"</p>
                </div>
              </div>
              {/* Floating card bottom-left */}
              <div className="absolute -bottom-4 -left-6 bg-white rounded-2xl shadow-xl px-4 py-2.5">
                <p className="text-xs text-gray-500">Request accepted! 🎉</p>
                <p className="text-xs font-bold text-gray-700">Garden Hose — Sneha K.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 40C360 80 1080 0 1440 40V80H0V40Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── ITEM SHOWCASE ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-emerald-600 font-semibold text-sm uppercase tracking-widest">What's available</span>
            <h2 className="font-display text-4xl font-bold text-gray-800 mt-2">Browse from your community</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">From power tools to recipe books — your neighbours have what you need.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {itemShowcase.map(({ img, label, tag, color }) => (
              <div key={label} className="group relative rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                <img src={img} alt={label} className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${color}`}>{tag}</span>
                  <p className="text-white font-bold text-lg mt-1">{label}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/register" className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-2xl font-semibold hover:bg-emerald-700 transition-colors shadow-lg">
              See All Items <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 px-6 bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-emerald-600 font-semibold text-sm uppercase tracking-widest">Simple process</span>
            <h2 className="font-display text-4xl font-bold text-gray-800 mt-2">How NeighbourShare works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map(({ num, icon, title, desc }, i) => (
              <div key={num} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[60%] w-full h-0.5 bg-emerald-200 z-0" />
                )}
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center text-3xl mb-4 border border-emerald-100">
                    {icon}
                  </div>
                  <span className="text-xs font-black text-emerald-400 tracking-widest mb-1">{num}</span>
                  <h3 className="font-display font-bold text-gray-800 text-lg mb-2">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMMUNITY PHOTO SECTION ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* Images */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <img src="https://i.pinimg.com/1200x/67/97/61/679761d400154889c89c86a8f2a6560f.jpg"
                className="rounded-3xl object-cover h-52 w-full shadow-md" alt="neighbours" />
              <img src="https://i.pinimg.com/1200x/33/0e/52/330e52e06d1e3e0d7aaa418df3a63def.jpg"
                className="rounded-3xl object-cover h-52 w-full shadow-md mt-8" alt="handshake" />
              <img src="https://i.pinimg.com/736x/74/48/6d/74486d9ca0563761b58332487d448565.jpg"
                className="rounded-3xl object-cover h-52 w-full shadow-md -mt-4" alt="food" />
              <img src="https://i.pinimg.com/736x/b9/79/d8/b979d8274e1fe67ba018093063cfcda8.jpg"
                className="rounded-3xl object-cover h-52 w-full shadow-md mt-4" alt="laptop" />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center text-white text-2xl shadow-xl">
              🏘️
            </div>
          </div>
          {/* Text */}
          <div>
            <span className="text-emerald-600 font-semibold text-sm uppercase tracking-widest">Why it matters</span>
            <h2 className="font-display text-4xl font-bold text-gray-800 mt-2 mb-6">
              Build real connections with your neighbours
            </h2>
            <div className="space-y-5">
              {[
                { icon: '💰', title: 'Save Money', desc: 'Why buy a ₹5,000 drill for one use? Borrow it for free.' },
                { icon: '🌍', title: 'Reduce Waste', desc: 'Less production demand means less environmental impact.' },
                { icon: '🤝', title: 'Strengthen Community', desc: 'Every borrow is a new neighbourly connection made.' },
                { icon: '🔒', title: 'Safe & Trusted', desc: 'Verified accounts, request-based system, full chat history.' },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-2xl shrink-0">{icon}</div>
                  <div>
                    <p className="font-bold text-gray-800">{title}</p>
                    <p className="text-gray-500 text-sm">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 px-6 bg-gradient-to-br from-gray-50 to-emerald-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-emerald-600 font-semibold text-sm uppercase tracking-widest">Real stories</span>
            <h2 className="font-display text-4xl font-bold text-gray-800 mt-2">Loved by neighbours</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(({ name, loc, text, avatar }) => (
              <div key={name} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => <span key={i} className="text-amber-400">★</span>)}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-5">"{text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold">{avatar}</div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{name}</p>
                    <p className="text-gray-400 text-xs">{loc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-24 px-6 bg-gradient-to-br from-[#0f4c35] to-[#2d9b6f] text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-60 h-60 rounded-full bg-white" />
          <div className="absolute bottom-0 right-20 w-80 h-80 rounded-full bg-white" />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="text-6xl mb-4 animate-float inline-block">🌿</div>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">Start sharing today</h2>
          <p className="text-emerald-200 text-lg mb-10">
            Join hundreds of neighbours already sharing resources and building community.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/register" className="bg-white text-emerald-800 px-10 py-4 rounded-2xl font-bold hover:bg-emerald-50 transition-all shadow-xl text-lg flex items-center gap-2 active:scale-95">
              Create Free Account <FiArrowRight />
            </Link>
            <Link to="/login" className="border-2 border-white/40 text-white px-10 py-4 rounded-2xl font-semibold hover:bg-white/10 transition-all text-lg">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-gray-900 text-gray-400 pt-16 pb-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center text-lg">🏘️</div>
                <span className="text-white font-display font-bold text-xl">NeighbourShare</span>
              </div>
              <p className="text-sm leading-relaxed">A community platform to lend, borrow, and connect with the people next door.</p>
            </div>
            {/* Pages */}
            <div>
              <p className="text-white font-semibold mb-4">Pages</p>
              <ul className="space-y-2.5 text-sm">
                {[
                  ['/register', 'Sign Up'],
                  ['/login', 'Login'],
                  ['/browse', 'Browse Items'],
                  ['/add-item', 'List an Item'],
                ].map(([to, label]) => (
                  <li key={label}><Link to={to} className="hover:text-emerald-400 transition-colors">{label}</Link></li>
                ))}
              </ul>
            </div>
            {/* Dashboard Links */}
            <div>
              <p className="text-white font-semibold mb-4">Your Account</p>
              <ul className="space-y-2.5 text-sm">
                {[
                  ['/dashboard', 'Dashboard'],
                  ['/my-items', 'My Items'],
                  ['/requests', 'Requests'],
                  ['/messages', 'Messages'],
                  ['/profile', 'Profile'],
                ].map(([to, label]) => (
                  <li key={label}><Link to={to} className="hover:text-emerald-400 transition-colors">{label}</Link></li>
                ))}
              </ul>
            </div>
            {/* Categories */}
            <div>
              <p className="text-white font-semibold mb-4">Categories</p>
              <ul className="space-y-2.5 text-sm">
                {['Tools', 'Books', 'Electronics', 'Appliances', 'Sports', 'Garden', 'Kitchen'].map(c => (
                  <li key={c}><Link to="/browse" className="hover:text-emerald-400 transition-colors">{c}</Link></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-3 text-sm">
            <p>© 2024 NeighbourShare. Built with ❤️ using the MERN Stack + Socket.io</p>
            <p className="text-emerald-500 font-medium">Share more. Buy less. Live better. 🌱</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
