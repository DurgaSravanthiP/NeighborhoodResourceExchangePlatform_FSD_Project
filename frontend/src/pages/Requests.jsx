import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getReceivedRequests, getSentRequests, updateRequestStatus } from '../services/api'
import { FiInbox, FiSend, FiCheck, FiX, FiRotateCcw, FiMessageSquare, FiStar } from 'react-icons/fi'
import ReviewFormModal from '../components/ReviewFormModal'

const statusBadge = (status) => {
  const map = { pending: 'badge-pending', approved: 'badge-approved', rejected: 'badge-rejected', returned: 'badge-returned' }
  return <span className={map[status] || 'badge-pending'}>{status}</span>
}

const Requests = () => {
  const navigate = useNavigate()
  const [tab, setTab] = useState('received')
  const [received, setReceived] = useState([])
  const [sent, setSent] = useState([])
  const [loading, setLoading] = useState(true)
  const [reviewTarget, setReviewTarget] = useState(null) // { id, title }

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [r, s] = await Promise.all([getReceivedRequests(), getSentRequests()])
      setReceived(r.data)
      setSent(s.data)
    } catch { toast.error('Failed to load requests') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchAll() }, [])

  const handleStatus = async (id, status) => {
    try {
      await updateRequestStatus(id, status)
      toast.success(`Request ${status}!`)
      fetchAll()
    } catch { toast.error('Failed to update request') }
  }

  const RequestCard = ({ req, isOwner }) => (
    <div className="card p-5 animate-fade-in">
      <div className="flex items-start gap-4">
        {/* Item Image */}
        <div className="w-14 h-14 rounded-xl overflow-hidden bg-earth-50 shrink-0">
          {req.itemId?.image
            ? <img src={req.itemId.image} alt={req.itemId.title} className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center text-xl">📦</div>}
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-earth-800">{req.itemId?.title}</h3>
              <p className="text-earth-500 text-xs mt-0.5">
                {isOwner ? `From: ${req.borrowerId?.name}` : `Owner: ${req.ownerId?.name}`}
              </p>
            </div>
            {statusBadge(req.status)}
          </div>

          {req.message && (
            <p className="text-earth-500 text-sm mt-2 italic bg-earth-50 rounded-lg px-3 py-2">
              "{req.message}"
            </p>
          )}

          <p className="text-earth-400 text-xs mt-2">
            {new Date(req.requestDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>

          <div className="flex flex-wrap gap-2 mt-3">
            <button onClick={() => navigate(`/messages/${isOwner ? req.borrowerId?._id : req.ownerId?._id}`)}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-earth-200 text-earth-700 rounded-lg text-sm font-medium hover:bg-earth-300 transition-colors">
              <FiMessageSquare size={13} /> Chat with {isOwner ? 'Borrower' : 'Owner'}
            </button>

            {isOwner && req.status === 'pending' && (
              <>
                <button onClick={() => handleStatus(req._id, 'approved')}
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
                  <FiCheck size={13} /> Accept
                </button>
                <button onClick={() => handleStatus(req._id, 'rejected')}
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors">
                  <FiX size={13} /> Decline
                </button>
              </>
            )}

            {isOwner && req.status === 'approved' && (
              <button onClick={() => handleStatus(req._id, 'returned')}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
                <FiRotateCcw size={13} /> Mark as Returned
              </button>
            )}

            {!isOwner && (req.status === 'approved' || req.status === 'returned') && !req.reviewed && (
              <button 
                onClick={() => setReviewTarget({ id: req._id, title: req.itemId?.title })}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors shadow-sm"
              >
                <FiStar size={13} className="fill-current" /> Rate Experience
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  const current = tab === 'received' ? received : sent
  const isEmpty = !loading && current.length === 0

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="font-display text-3xl font-bold text-earth-800 mb-6">Borrow Requests</h1>

      {/* Tabs */}
      <div className="flex gap-1 bg-earth-100 p-1 rounded-xl mb-6 w-fit">
        {[
          { key: 'received', icon: <FiInbox />, label: `Received (${received.length})` },
          { key: 'sent', icon: <FiSend />, label: `Sent (${sent.length})` },
        ].map(({ key, icon, label }) => (
          <button key={key} onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all
              ${tab === key ? 'bg-white text-earth-800 shadow-sm' : 'text-earth-500 hover:text-earth-700'}`}>
            {icon} {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="card h-24 animate-pulse bg-earth-50" />)}</div>
      ) : isEmpty ? (
        <div className="text-center py-20 text-earth-400">
          <div className="text-6xl mb-4">{tab === 'received' ? '📬' : '📤'}</div>
          <p className="font-display text-xl text-earth-600">No {tab} requests yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {current.map(req => <RequestCard key={req._id} req={req} isOwner={tab === 'received'} />)}
        </div>
      )}

      {/* Review Modal */}
      <ReviewFormModal
        isOpen={!!reviewTarget}
        onClose={() => setReviewTarget(null)}
        requestId={reviewTarget?.id}
        itemTitle={reviewTarget?.title}
        onReviewSuccess={fetchAll}
      />
    </div>
  )
}

export default Requests
