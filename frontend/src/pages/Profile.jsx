import { useState } from 'react'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import { updateProfile, getUserReviews } from '../services/api'
import { FiUser, FiMail, FiMapPin, FiEdit3, FiSave, FiX, FiFileText, FiStar } from 'react-icons/fi'
import ReviewStars from '../components/ReviewStars'
import { useEffect } from 'react'

const Profile = () => {
  const { user, updateUser } = useAuth()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    name: user?.name || '',
    location: user?.location || '',
    bio: user?.bio || '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [reviews, setReviews] = useState([])
  const [fetchingReviews, setFetchingReviews] = useState(true)

  useEffect(() => {
    if (user?._id) {
      getUserReviews(user._id)
        .then(({ data }) => setReviews(data))
        .catch(() => console.error('Failed to load reviews'))
        .finally(() => setFetchingReviews(false))
    }
  }, [user?._id])

  const handleSave = async () => {
    setLoading(true)
    try {
      const payload = { name: form.name, location: form.location, bio: form.bio }
      if (form.password) payload.password = form.password
      const { data } = await updateProfile(payload)
      updateUser(data)
      toast.success('Profile updated! ✅')
      setEditing(false)
      setForm(f => ({ ...f, password: '' }))
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  const avatar = user?.name?.charAt(0).toUpperCase()

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="font-display text-3xl font-bold text-earth-800 mb-8">My Profile</h1>

      <div className="card overflow-hidden">
        {/* Header Banner */}
        <div className="h-28 bg-gradient-to-r from-primary-600 to-primary-400 relative">
          <div className="absolute -bottom-8 left-8">
            <div className="w-16 h-16 rounded-2xl bg-white border-4 border-white shadow-lg
              flex items-center justify-center text-2xl font-bold text-primary-600 font-display">
              {avatar}
            </div>
          </div>
        </div>

        <div className="pt-12 pb-8 px-8">
          {!editing ? (
            <>
              {/* View Mode */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="font-display text-2xl font-bold text-earth-800">{user?.name}</h2>
                  {user?.bio && <p className="text-earth-500 text-sm mt-1 max-w-sm">{user.bio}</p>}
                </div>
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 btn-secondary text-sm">
                  <FiEdit3 size={14} /> Edit Profile
                </button>
              </div>

              <div className="space-y-4">
                {[
                  { icon: <FiMail />, label: 'Email', value: user?.email },
                  { icon: <FiMapPin />, label: 'Location', value: user?.location || 'Not set' },
                  { icon: <FiFileText />, label: 'Bio', value: user?.bio || 'No bio added yet' },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3 py-3 border-b border-earth-50 last:border-0">
                    <span className="text-earth-400 mt-0.5">{icon}</span>
                    <div>
                      <p className="text-xs text-earth-400 font-medium">{label}</p>
                      <p className="text-earth-700 mt-0.5">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Edit Mode */}
              <h2 className="font-display text-xl font-bold text-earth-800 mb-6">Edit Your Profile</h2>
              <div className="space-y-5">
                {[
                  { key: 'name', label: 'Full Name', icon: <FiUser />, type: 'text', placeholder: 'Your name' },
                  { key: 'location', label: 'Neighbourhood / Area', icon: <FiMapPin />, type: 'text', placeholder: 'e.g. Banjara Hills' },
                ].map(({ key, label, icon, type, placeholder }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-earth-700 mb-1.5">{label}</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-3.5 text-earth-400">{icon}</span>
                      <input type={type} className="input-field pl-10"
                        placeholder={placeholder}
                        value={form[key]}
                        onChange={e => setForm({ ...form, [key]: e.target.value })} />
                    </div>
                  </div>
                ))}

                <div>
                  <label className="block text-sm font-medium text-earth-700 mb-1.5">Bio</label>
                  <div className="relative">
                    <FiFileText className="absolute left-3.5 top-3.5 text-earth-400" />
                    <textarea className="input-field pl-10 resize-none" rows={3}
                      placeholder="Tell your neighbours about yourself..."
                      value={form.bio}
                      onChange={e => setForm({ ...form, bio: e.target.value })} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-earth-700 mb-1.5">
                    New Password <span className="text-earth-400 font-normal">(leave blank to keep current)</span>
                  </label>
                  <input type="password" className="input-field"
                    placeholder="New password (min. 6 chars)"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })} />
                </div>

                <div className="flex gap-3 pt-2">
                  <button onClick={() => setEditing(false)} className="btn-secondary flex-1 flex items-center justify-center gap-2">
                    <FiX size={14} /> Cancel
                  </button>
                  <button onClick={handleSave} disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
                    {loading
                      ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</>
                      : <><FiSave size={14} /> Save Changes</>}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Trust & Reviews Section */}
      <div className="mt-12">
        <h2 className="font-display text-2xl font-bold text-earth-800 mb-6 flex items-center gap-3">
          Trust & Community Feedback
          {reviews.length > 0 && (
            <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
              <FiStar className="text-amber-500 fill-current" size={14} />
              <span className="text-sm font-bold text-amber-700">
                {(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)}
              </span>
            </div>
          )}
        </h2>

        {fetchingReviews ? (
          <div className="flex justify-center p-12">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="card bg-earth-50 p-10 text-center border-dashed border-2 border-earth-200 shadow-none">
            <p className="text-earth-400 italic">No reviews received yet. Share more items to build your community reputation!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="card p-6 bg-white border border-earth-100">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold overflow-hidden text-sm">
                      {review.reviewerId?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-earth-800 text-sm">{review.reviewerId?.name}</p>
                      <p className="text-[10px] text-earth-400 font-bold uppercase tracking-widest">
                        Borrowed: <span className="text-emerald-600">{review.itemId?.title}</span>
                      </p>
                    </div>
                  </div>
                  <ReviewStars rating={review.rating} size={14} />
                </div>
                <p className="text-earth-600 text-sm leading-relaxed">"{review.comment}"</p>
                <p className="text-[10px] text-earth-400 mt-3 font-medium">
                  {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
