import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getItems, getMyItems, getSentRequests, getReceivedRequests } from '../services/api'
import ItemCard from '../components/ItemCard'
import { FiPlus, FiArrowRight, FiPackage, FiInbox, FiSend } from 'react-icons/fi'

const Dashboard = () => {
  const { user } = useAuth()
  const [recentItems, setRecentItems] = useState([])
  const [stats, setStats] = useState({ myItems: 0, sent: 0, received: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [items, myItems, sent, received] = await Promise.all([
          getItems(),
          getMyItems(),
          getSentRequests(),
          getReceivedRequests(),
        ])
        setRecentItems(items.data.slice(0, 6))
        setStats({
          myItems: myItems.data.length,
          sent: sent.data.length,
          received: received.data.length,
        })
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const statCards = [
    { icon: <FiPackage />, label: 'My Listed Items', value: stats.myItems, color: 'bg-primary-50 text-primary-700', link: '/my-items' },
    { icon: <FiSend />, label: 'Requests Sent', value: stats.sent, color: 'bg-blue-50 text-blue-700', link: '/requests' },
    { icon: <FiInbox />, label: 'Requests Received', value: stats.received, color: 'bg-amber-50 text-amber-700', link: '/requests' },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero Greeting */}
      <div className="bg-gradient-to-r from-primary-700 to-primary-500 rounded-3xl p-8 mb-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 opacity-10 text-9xl -mt-4 -mr-4">🏘️</div>
        <div className="relative z-10">
          <h1 className="font-display text-3xl font-bold mb-2">
            Good day, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-primary-100 text-lg mb-6">
            Share resources, build community — one borrow at a time.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/browse" className="bg-white text-emerald-700 px-6 py-3 rounded-2xl font-bold hover:bg-emerald-50 transition-all shadow-lg text-sm active:scale-95">
              Browse Items
            </Link>
            <Link to="/add-item" className="bg-emerald-400/30 backdrop-blur-md text-white border border-white/30 px-6 py-3 rounded-2xl font-bold hover:bg-emerald-400/40 transition-all text-sm flex items-center gap-2 active:scale-95">
              <FiPlus size={18} /> List an Item
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {statCards.map(({ icon, label, value, color, link }) => (
          <Link key={label} to={link}
            className="card p-5 flex items-center gap-4 hover:scale-[1.02] transition-transform">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${color}`}>
              {icon}
            </div>
            <div>
              <p className="text-earth-500 text-xs font-medium">{label}</p>
              <p className="text-earth-800 text-2xl font-bold">{value}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Items */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-2xl font-bold text-earth-800">Recent in Community</h2>
        <Link to="/browse" className="text-primary-600 text-sm font-semibold flex items-center gap-1 hover:underline">
          View all <FiArrowRight size={14} />
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card h-64 animate-pulse bg-earth-50" />
          ))}
        </div>
      ) : recentItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {recentItems.map(item => <ItemCard key={item._id} item={item} />)}
        </div>
      ) : (
        <div className="text-center py-16 text-earth-400">
          <div className="text-6xl mb-4">📭</div>
          <p className="font-display text-xl">No items yet in your community</p>
          <Link to="/add-item" className="btn-primary inline-flex items-center gap-2 mt-4 text-sm">
            <FiPlus /> Be the first to list an item
          </Link>
        </div>
      )}
    </div>
  )
}

export default Dashboard
