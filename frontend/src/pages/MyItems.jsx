import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getMyItems, deleteItem } from '../services/api'
import { FiPlus, FiEdit2, FiTrash2, FiPackage } from 'react-icons/fi'

const MyItems = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const fetch = async () => {
    try {
      const { data } = await getMyItems()
      setItems(data)
    } catch (e) {
      toast.error('Failed to load items')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetch() }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this item from the community?')) return
    try {
      await deleteItem(id)
      toast.success('Item removed')
      setItems(items.filter(i => i._id !== id))
    } catch {
      toast.error('Failed to delete item')
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-earth-800">My Listed Items</h1>
          <p className="text-earth-500 text-sm mt-1">{items.length} items in the community</p>
        </div>
        <Link to="/add-item" className="btn-primary flex items-center gap-2 text-sm">
          <FiPlus /> Add Item
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => <div key={i} className="card h-20 animate-pulse bg-earth-50" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20">
          <FiPackage className="mx-auto text-6xl text-earth-200 mb-4" />
          <p className="font-display text-xl text-earth-600 mb-2">No items listed yet</p>
          <p className="text-earth-400 text-sm mb-6">Share something with your community!</p>
          <Link to="/add-item" className="btn-primary inline-flex items-center gap-2">
            <FiPlus /> List Your First Item
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map(item => (
            <div key={item._id} className="card p-5 flex items-center gap-4 animate-fade-in">
              {/* Image/Icon */}
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-earth-50 shrink-0">
                {item.image
                  ? <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-earth-800 truncate">{item.title}</h3>
                <p className="text-earth-500 text-xs mt-0.5">{item.category}</p>
                <span className={`text-xs mt-1 inline-block ${item.availabilityStatus === 'available' ? 'badge-available' : 'badge-borrowed'}`}>
                  {item.availabilityStatus}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <Link to={`/edit-item/${item._id}`}
                  className="p-2 rounded-lg text-earth-500 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                  <FiEdit2 size={16} />
                </Link>
                <button onClick={() => handleDelete(item._id)}
                  className="p-2 rounded-lg text-earth-500 hover:bg-red-50 hover:text-red-500 transition-colors">
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyItems
