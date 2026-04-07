import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getItemById, createRequest } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { FiMapPin, FiUser, FiCalendar, FiMessageSquare, FiArrowLeft } from 'react-icons/fi'

const categoryEmoji = {
  Tools: '🔧', Books: '📚', Electronics: '💻', Appliances: '🏠',
  Sports: '⚽', Garden: '🌿', Kitchen: '🍳', Other: '📦'
}

const ItemDetail = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [requesting, setRequesting] = useState(false)

  useEffect(() => {
    getItemById(id)
      .then(({ data }) => setItem(data))
      .catch(() => toast.error('Item not found'))
      .finally(() => setLoading(false))
  }, [id])

  const handleRequest = async () => {
    setRequesting(true)
    try {
      await createRequest({ itemId: id, message })
      toast.success('Borrow request sent! 🎉')
      setMessage('')
      navigate('/requests')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send request')
    } finally {
      setRequesting(false)
    }
  }

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
    </div>
  )

  if (!item) return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <p className="text-earth-500 text-xl">Item not found.</p>
    </div>
  )

  const isOwner = user?._id === item.ownerId?._id

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <button onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-earth-500 hover:text-earth-800 mb-6 text-sm font-medium transition-colors">
        <FiArrowLeft /> Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image */}
        <div className="card overflow-hidden">
          {item.image ? (
            <img src={item.image} alt={item.title} className="w-full h-72 object-cover" />
          ) : (
            <div className="w-full h-72 bg-earth-50 flex items-center justify-center">
              <span className="text-8xl opacity-30">{categoryEmoji[item.category]}</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <div className="flex items-start justify-between gap-3 mb-3">
            <h1 className="font-display text-3xl font-bold text-earth-800">{item.title}</h1>
            <span className={item.availabilityStatus === 'available' ? 'badge-available' : 'badge-borrowed'}>
              {item.availabilityStatus === 'available' ? '✓ Available' : '● Borrowed'}
            </span>
          </div>

          <span className="inline-block bg-earth-100 text-earth-600 text-xs px-3 py-1 rounded-full mb-4">
            {categoryEmoji[item.category]} {item.category}
          </span>

          <p className="text-earth-600 leading-relaxed mb-6">{item.description}</p>

          {/* Owner Info */}
          <div className="bg-earth-50 rounded-2xl p-4 mb-6">
            <p className="text-xs text-earth-400 font-medium uppercase tracking-wide mb-3">Listed By</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                {item.ownerId?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-earth-800">{item.ownerId?.name}</p>
                {item.ownerId?.location && (
                  <p className="text-xs text-earth-400 flex items-center gap-1 mt-0.5">
                    <FiMapPin size={11} /> {item.ownerId.location}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          {!isOwner && item.availabilityStatus === 'available' && (
            <div className="space-y-3">
              <textarea
                className="input-field resize-none"
                rows={3}
                placeholder="Add a message to the owner (optional)..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button
                onClick={handleRequest}
                disabled={requesting}
                className="w-full py-4 rounded-2xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {requesting ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending Request...
                  </>
                ) : (
                  <><FiMessageSquare size={18} /> Send Borrow Request</>
                )}
              </button>
            </div>
          )}

          {isOwner && (
            <div className="flex gap-3">
              <Link to={`/edit-item/${item._id}`} className="btn-secondary flex-1 text-center">Edit Item</Link>
            </div>
          )}

          {!isOwner && item.availabilityStatus === 'borrowed' && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-700 text-sm">
              This item is currently borrowed. Check back later!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ItemDetail
