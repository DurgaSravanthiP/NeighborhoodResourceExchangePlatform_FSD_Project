import { FiStar } from 'react-icons/fi'

const ReviewStars = ({ rating, setRating = null, size = 18, color = 'text-amber-400' }) => {
  const stars = [1, 2, 3, 4, 5]

  return (
    <div className="flex items-center gap-1">
      {stars.map((s) => (
        <button
          key={s}
          type="button"
          disabled={!setRating}
          onClick={() => setRating && setRating(s)}
          className={`transition-all duration-200 ${setRating ? 'hover:scale-110 active:scale-90' : ''}`}
        >
          <FiStar
            size={size}
            className={`${
              s <= rating ? `${color} fill-current` : 'text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  )
}

export default ReviewStars
