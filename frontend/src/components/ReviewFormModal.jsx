import { useState } from 'react'
import { FiX } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { createReview } from '../services/api'
import ReviewStars from './ReviewStars'

const ReviewFormModal = ({ isOpen, onClose, requestId, itemTitle, onReviewSuccess }) => {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!comment.trim()) return toast.error('Please add a comment')
    
    setLoading(true)
    try {
      await createReview({ requestId, rating, comment })
      toast.success('Thank you for your feedback! ⭐')
      onReviewSuccess()
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-earth-900/40 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-display text-2xl font-bold text-earth-800">Rate Your Experience</h2>
            <button onClick={onClose} className="p-2 hover:bg-earth-50 rounded-full transition-colors">
              <FiX size={20} className="text-earth-400" />
            </button>
          </div>

          <p className="text-earth-500 mb-6 font-medium">
            How was your experience borrowing <span className="text-emerald-600 font-bold">{itemTitle}</span>?
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center gap-2 py-4 bg-earth-50 rounded-2xl">
              <span className="text-xs font-bold text-earth-400 uppercase tracking-widest">Select Rating</span>
              <ReviewStars rating={rating} setRating={setRating} size={36} />
              <span className="text-sm font-semibold text-amber-600 mt-1">
                {rating === 5 ? 'Excellent!' : rating === 4 ? 'Great' : rating === 3 ? 'Good' : rating === 2 ? 'Fair' : 'Poor'}
              </span>
            </div>

            <div>
              <label className="block text-sm font-bold text-earth-700 mb-2">Your Feedback</label>
              <textarea
                className="input-field min-h-[120px] resize-none"
                placeholder="What did you like? Was the item in good condition? Was the pickup easy?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />
            </div>

            <div className="flex gap-4">
              <button 
                type="button" 
                onClick={onClose}
                className="flex-1 py-3.5 rounded-2xl font-bold text-earth-600 bg-earth-100 hover:bg-earth-200 transition-all active:scale-95"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={loading}
                className="flex-1 py-3.5 rounded-2xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                {loading ? 'Submitting...' : 'Post Review'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ReviewFormModal
