import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FiUsers, FiPackage, FiBell, FiTrash2, FiSearch, FiRefreshCw, FiExternalLink } from 'react-icons/fi'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [search, setSearch] = useState('')

  const fetchData = async (tab) => {
    setLoading(true)
    try {
      const stored = sessionStorage.getItem('neighbourUser')
      const token = stored ? JSON.parse(stored).token : ''
      
      const { data } = await axios.get(`/api/admin/${tab}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setData(data)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData(activeTab)
  }, [activeTab])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record? This action is irreversible.')) return
    
    try {
      const stored = sessionStorage.getItem('neighbourUser')
      const token = stored ? JSON.parse(stored).token : ''

      await axios.delete(`/api/admin/${activeTab}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Record deleted successfully')
      setData(data.filter(item => item._id !== id))
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed')
    }
  }

  const filteredData = data.filter(item => {
    const searchStr = search.toLowerCase()
    if (activeTab === 'users') return item?.name?.toLowerCase().includes(searchStr) || item?.email?.toLowerCase().includes(searchStr)
    if (activeTab === 'items') return item?.title?.toLowerCase().includes(searchStr)
    if (activeTab === 'requests') return item?.itemId?.title?.toLowerCase().includes(searchStr) || item?.borrowerId?.name?.toLowerCase().includes(searchStr)
    return true
  })

  const tabs = [
    { id: 'users', label: 'Users', icon: <FiUsers /> },
    { id: 'items', label: 'Items', icon: <FiPackage /> },
    { id: 'requests', label: 'Requests', icon: <FiBell /> },
  ]

  return (
    <div className="min-h-screen bg-earth-50 pt-8 pb-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-earth-600 mt-1">Manage and moderate the community platform</p>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search..."
                className="input-field pl-10 !py-2 w-64 shadow-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button 
              onClick={() => fetchData(activeTab)}
              className="p-2.5 bg-white border border-gray-200 rounded-xl text-emerald-600 hover:bg-emerald-50 transition-colors shadow-sm"
              title="Refresh data"
            >
              <FiRefreshCw className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 p-1 bg-white rounded-2xl border border-gray-100 shadow-sm mb-6 w-fit">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSearch(''); }}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
                activeTab === tab.id 
                ? 'bg-emerald-600 text-white shadow-md' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="py-20 flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-gray-500 font-medium">Fetching data...</p>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="py-20 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                <FiSearch size={32} />
              </div>
              <p className="text-gray-500 font-medium">No results found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {activeTab === 'users' && (
                      <>
                        <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Joined</th>
                      </>
                    )}
                    {activeTab === 'items' && (
                      <>
                        <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Item</th>
                        <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Owner</th>
                        <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Category</th>
                      </>
                    )}
                    {activeTab === 'requests' && (
                      <>
                        <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Item</th>
                        <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Requester</th>
                        <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Status</th>
                      </>
                    )}
                    <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredData.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50/50 transition-colors">
                      {activeTab === 'users' && (
                        <>
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <img 
                                src={item.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=10b981&color=fff`} 
                                className="w-10 h-10 rounded-full object-cover border border-gray-100 shadow-sm"
                                alt=""
                              />
                              <div>
                                <div className="font-bold text-gray-900">{item.name}</div>
                                <div className="text-sm text-gray-500">{item.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              item.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                              {item.role.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-sm text-gray-600">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </td>
                        </>
                      )}
                      
                      {activeTab === 'items' && (
                        <>
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <img 
                                src={item.image || 'https://via.placeholder.com/150'} 
                                className="w-12 h-12 rounded-xl object-cover border border-gray-100"
                                alt=""
                              />
                              <div className="font-bold text-gray-900">{item.title}</div>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-sm text-gray-600">
                            {item.ownerId?.name || 'Unknown'}
                          </td>
                          <td className="px-6 py-5">
                            <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold">
                              {item.category}
                            </span>
                          </td>
                        </>
                      )}

                      {activeTab === 'requests' && (
                        <>
                          <td className="px-6 py-5 font-bold text-gray-900">
                            {item.itemId?.title || 'Item Deleted'}
                          </td>
                          <td className="px-6 py-5">
                            <div className="text-sm">
                              <div className="font-bold text-gray-900">{item.borrowerId?.name || 'Unknown'}</div>
                              <div className="text-gray-500">{item.borrowerId?.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <span className={`badge-${item.status}`}>
                              {item.status}
                            </span>
                          </td>
                        </>
                      )}

                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                           <button 
                            onClick={() => handleDelete(item._id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                            title="Delete"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
