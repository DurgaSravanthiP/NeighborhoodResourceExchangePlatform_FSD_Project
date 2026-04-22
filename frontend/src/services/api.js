import axios from 'axios'

const API = axios.create({ baseURL: '/api' })

// Attach token from storage on every request
API.interceptors.request.use((config) => {
  const user = JSON.parse(sessionStorage.getItem('neighbourUser') || 'null')
  if (user?.token) config.headers.Authorization = `Bearer ${user.token}`
  return config
})

// Auth
export const registerUser = (data) => API.post('/auth/register', data)
export const loginUser = (data) => API.post('/auth/login', data)
export const getProfile = () => API.get('/auth/profile')
export const updateProfile = (data) => API.put('/auth/profile', data)

// Items
export const getItems = (params) => API.get('/items', { params })
export const getItemById = (id) => API.get(`/items/${id}`)
export const getMyItems = () => API.get('/items/my-items')
export const createItem = (data) => API.post('/items', data)
export const updateItem = (id, data) => API.put(`/items/${id}`, data)
export const deleteItem = (id) => API.delete(`/items/${id}`)
export const uploadImage = (formData) => API.post('/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
})

// Borrow Requests
export const createRequest = (data) => API.post('/requests', data)
export const getReceivedRequests = () => API.get('/requests/received')
export const getSentRequests = () => API.get('/requests/sent')
export const updateRequestStatus = (id, status) => API.put(`/requests/${id}/status`, { status })

// Messages
export const getConversations = () => API.get('/messages/conversations')
export const getMessages = (userId) => API.get(`/messages/${userId}`)
export const sendMessage = (data) => API.post('/messages', data)

// Reviews
export const createReview = (data) => API.post('/reviews', data)
export const getItemReviews = (itemId) => API.get(`/reviews/item/${itemId}`)
export const getUserReviews = (userId) => API.get(`/reviews/user/${userId}`)

// Notifications
export const getNotifications = () => API.get('/notifications')
export const markNotificationRead = (id) => API.put(`/notifications/${id}/read`)

export default API
