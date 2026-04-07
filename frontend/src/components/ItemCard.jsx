import { Link } from 'react-router-dom'
import { FiMapPin, FiTag } from 'react-icons/fi'

const categoryEmoji = {
  Tools: '🔧', Books: '📚', Electronics: '💻', Appliances: '🏠',
  Sports: '⚽', Garden: '🌿', Kitchen: '🍳', Other: '📦'
}

const ItemCard = ({ item }) => {
  return (
    <Link to={`/items/${item._id}`} className="card group block animate-fade-in">
      {/* Image */}
      <div className="relative h-44 bg-earth-50 overflow-hidden">
        {item.image ? (
          <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl opacity-40">{categoryEmoji[item.category] || '📦'}</span>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span className={item.availabilityStatus === 'available' ? 'badge-available' : 'badge-borrowed'}>
            {item.availabilityStatus === 'available' ? '✓ Available' : '● Borrowed'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-display font-semibold text-earth-800 text-lg leading-tight line-clamp-1">
            {item.title}
          </h3>
          <span className="text-xs bg-earth-100 text-earth-600 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
            <FiTag size={10} /> {item.category}
          </span>
        </div>
        <p className="text-earth-500 text-sm line-clamp-2 mb-3">{item.description}</p>

        <div className="flex items-center justify-between pt-3 border-t border-earth-50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center text-xs font-bold text-primary-700">
              {item.ownerId?.name?.charAt(0).toUpperCase()}
            </div>
            <span className="text-xs text-earth-500 font-medium">{item.ownerId?.name}</span>
          </div>
          {item.location && (
            <span className="text-xs text-earth-400 flex items-center gap-1">
              <FiMapPin size={11} /> {item.location}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

export default ItemCard
