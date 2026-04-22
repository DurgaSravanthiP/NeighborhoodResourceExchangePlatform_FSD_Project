import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiBell, FiCheckCircle, FiStar, FiMessageSquare } from 'react-icons/fi'
import { getNotifications, markNotificationRead } from '../services/api'
import { getSocket } from '../services/socket'

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const dropdownRef = useRef(null)

  useEffect(() => {
    fetchNotifications()
    
    // Listen for real-time notifications
    const socket = getSocket()
    if (socket) {
      socket.on('newNotification', (newNotif) => {
        setNotifications(prev => [newNotif, ...prev])
        setUnreadCount(prev => prev + 1)
      })
    }

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      if (socket) socket.off('newNotification')
    }
  }, [])

  const fetchNotifications = async () => {
    try {
      const { data } = await getNotifications()
      setNotifications(data)
      setUnreadCount(data.filter(n => !n.isRead).length)
    } catch (err) {
      console.error('Failed to fetch notifications')
    }
  }

  const handleRead = async (id, link) => {
    try {
      await markNotificationRead(id)
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n))
      setUnreadCount(prev => Math.max(0, prev - 1))
      setIsOpen(false)
      navigate(link)
    } catch (err) {
      console.error('Failed to mark read')
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2.5 rounded-xl bg-earth-50 text-earth-600 hover:bg-earth-100 transition-all relative"
      >
        <FiBell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-white rounded-3xl shadow-2xl border border-earth-100 overflow-hidden z-50 animate-slide-up">
          <div className="p-4 border-b border-earth-50 flex justify-between items-center bg-earth-50/50">
            <h3 className="font-display font-bold text-earth-800">Notifications</h3>
            {unreadCount > 0 && <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">{unreadCount} New</span>}
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-10 text-center">
                <p className="text-earth-400 text-sm">No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => (
                <button
                  key={n._id}
                  onClick={() => handleRead(n._id, n.link)}
                  className={`w-full p-4 flex gap-3 text-left hover:bg-earth-50 transition-colors border-b border-earth-50 last:border-0
                    ${!n.isRead ? 'bg-primary-50/30' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 
                    ${!n.isRead ? 'bg-primary-100 text-primary-600' : 'bg-earth-100 text-earth-400'}`}>
                    {n.type === 'REQUEST_NEW' ? <FiBell size={18} /> : 
                     n.type === 'REQUEST_STATUS' ? <FiCheckCircle size={18} /> : 
                     n.type === 'MESSAGE_NEW' ? <FiMessageSquare size={18} /> :
                     <FiStar size={18} />}
                  </div>
                  <div>
                    <p className={`text-sm ${!n.isRead ? 'text-earth-900 font-semibold' : 'text-earth-600'}`}>
                      {n.message}
                    </p>
                    <p className="text-[10px] text-earth-400 mt-1 font-medium">
                      {new Date(n.createdAt).toLocaleDateString()} at {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
          
          <div className="p-3 bg-earth-50/50 text-center">
            <button className="text-xs font-bold text-primary-600 hover:text-primary-700">View All activity</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationBell
