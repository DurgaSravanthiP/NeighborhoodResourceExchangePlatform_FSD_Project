import { useEffect, useState } from 'react'
import { getItems } from '../services/api'
import ItemCard from '../components/ItemCard'
import { FiSearch, FiFilter } from 'react-icons/fi'

const CATEGORIES = ['All', 'Tools', 'Books', 'Electronics', 'Appliances', 'Sports', 'Garden', 'Kitchen', 'Other']

const Browse = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [status, setStatus] = useState('all')

  const fetchItems = async () => {
    setLoading(true)
    try {
      const params = {}
      if (search) params.search = search
      if (category !== 'All') params.category = category
      if (status !== 'all') params.status = status
      const { data } = await getItems(params)
      setItems(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchItems() }, [category, status])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchItems()
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-earth-800 mb-1">Browse Community Items</h1>
        <p className="text-earth-500">Find what you need from your neighbours</p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-4 mb-8">
        <div className="relative flex-1 group">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
          <input
            type="text"
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white border border-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
            placeholder="Search for something to borrow..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button type="submit" className="bg-emerald-600 text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 active:scale-95 transition-all flex items-center gap-2">
          <FiSearch size={18} /> Search
        </button>
      </form>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        <div className="flex items-center gap-2 text-earth-600 text-sm font-medium">
          <FiFilter size={14} /> Filter:
        </div>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200
              ${category === cat
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-white text-earth-600 border border-earth-200 hover:border-primary-300'}`}
          >
            {cat}
          </button>
        ))}
        <div className="ml-auto flex gap-2">
          {['all', 'available', 'borrowed'].map(s => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all capitalize
                ${status === s ? 'bg-earth-800 text-white' : 'bg-white text-earth-600 border border-earth-200 hover:border-earth-400'}`}
            >
              {s === 'all' ? 'All Status' : s}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      {!loading && (
        <p className="text-earth-500 text-sm mb-5">
          Showing <span className="font-semibold text-earth-700">{items.length}</span> items
        </p>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="card h-64 animate-pulse bg-earth-50" />
          ))}
        </div>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map(item => <ItemCard key={item._id} item={item} />)}
        </div>
      ) : (
        <div className="text-center py-20 text-earth-400">
          <div className="text-6xl mb-4">🔍</div>
          <p className="font-display text-xl text-earth-600">No items found</p>
          <p className="text-sm mt-2">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  )
}

export default Browse
