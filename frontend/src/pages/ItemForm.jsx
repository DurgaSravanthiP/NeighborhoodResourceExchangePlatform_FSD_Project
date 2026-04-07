import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { createItem, updateItem, getItemById, uploadImage } from '../services/api'
import { FiImage, FiTag, FiFileText, FiMapPin } from 'react-icons/fi'

const CATEGORIES = ['Tools', 'Books', 'Electronics', 'Appliances', 'Sports', 'Garden', 'Kitchen', 'Other']

const ItemForm = ({ isEdit = false }) => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [form, setForm] = useState({ title: '', description: '', category: 'Tools', location: '', image: '' })
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)

  useEffect(() => {
    if (isEdit && id) {
      getItemById(id).then(({ data }) => {
        setForm({
          title: data.title,
          description: data.description,
          category: data.category,
          location: data.location || '',
          image: data.image || '',
        })
      }).catch(() => toast.error('Failed to load item'))
    }
  }, [isEdit, id])

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    setUploadingImage(true);
    
    try {
      const { data } = await uploadImage(formData);
      setForm(prev => ({ ...prev, image: data.imageUrl }));
      toast.success('Image uploaded! ✅');
    } catch (err) {
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (isEdit) {
        await updateItem(id, form)
        toast.success('Item updated! ✅')
        navigate(`/items/${id}`)
      } else {
        const { data } = await createItem(form)
        toast.success('Item listed successfully! 🎉')
        navigate(`/items/${data._id}`)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save item')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-earth-800 mb-1">
          {isEdit ? 'Edit Item' : 'List a New Item'}
        </h1>
        <p className="text-earth-500">
          {isEdit ? 'Update your item details' : 'Share something useful with your community'}
        </p>
      </div>

      <div className="card p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-earth-700 mb-1.5">Item Title *</label>
            <div className="relative">
              <FiTag className="absolute left-3.5 top-3.5 text-earth-400" />
              <input
                type="text" required
                className="input-field pl-10"
                placeholder="e.g. Power Drill, Mountain Bike..."
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-earth-700 mb-2">Category *</label>
            <div className="grid grid-cols-4 gap-2">
              {CATEGORIES.map(cat => (
                <button
                  type="button" key={cat}
                  onClick={() => setForm({ ...form, category: cat })}
                  className={`py-2 px-2 rounded-xl text-xs font-medium border transition-all
                    ${form.category === cat
                      ? 'bg-primary-600 text-white border-primary-600 shadow-md'
                      : 'bg-white text-earth-600 border-earth-200 hover:border-primary-300'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-earth-700 mb-1.5">Description *</label>
            <div className="relative">
              <FiFileText className="absolute left-3.5 top-3.5 text-earth-400" />
              <textarea
                required rows={4}
                className="input-field pl-10 resize-none"
                placeholder="Describe the item, its condition, usage instructions..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-earth-700 mb-1.5">Pickup Location</label>
            <div className="relative">
              <FiMapPin className="absolute left-3.5 top-3.5 text-earth-400" />
              <input
                type="text"
                className="input-field pl-10"
                placeholder="e.g. Banjara Hills, Block 4"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-earth-700 mb-1.5">Item Image (optional)</label>
            <div className="relative">
              <FiImage className="absolute left-3.5 top-3.5 text-earth-400" />
              <input
                type="file"
                accept="image/*"
                className="input-field pl-10 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                onChange={handleImageUpload}
              />
            </div>
            {uploadingImage && <p className="text-sm text-emerald-500 mt-2 flex items-center gap-2"><span className="w-3 h-3 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" /> Uploading image...</p>}
            {form.image && !uploadingImage && (
              <img src={form.image} alt="Preview" className="mt-3 h-32 w-full object-cover rounded-xl border border-earth-100" />
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={() => navigate(-1)} 
              className="flex-1 px-6 py-3.5 rounded-2xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all active:scale-95">
              Cancel
            </button>
            <button type="submit" disabled={loading} 
              className="flex-1 px-6 py-3.5 rounded-2xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? (
                <><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...</>
              ) : (isEdit ? 'Update Item' : 'List Item')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ItemForm
