import { io } from 'socket.io-client'

const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
})

export const connectSocket = (userId) => {
  if (!socket.connected) socket.connect()
  socket.emit('userOnline', userId)
}

export const disconnectSocket = () => {
  socket.disconnect()
}

export const sendSocketMessage = (data) => {
  socket.emit('sendMessage', data)
}

export const onReceiveMessage = (callback) => {
  socket.off('receiveMessage')
  socket.on('receiveMessage', callback)
}

export const offReceiveMessage = () => {
  socket.off('receiveMessage')
}

export const emitTyping = (data) => socket.emit('typing', data)
export const onTyping = (cb) => { socket.off('typing'); socket.on('typing', cb) }
export const offTyping = () => socket.off('typing')

export const emitMarkDelivered = (data) => socket.emit('markDelivered', data)
export const emitMarkSeen = (data) => socket.emit('markSeen', data)

export const onMessageStatus = (cb) => { socket.off('messageStatus'); socket.on('messageStatus', cb) }
export const offMessageStatus = () => socket.off('messageStatus')

export const onMessagesSeen = (cb) => { socket.off('messagesSeen'); socket.on('messagesSeen', cb) }
export const offMessagesSeen = () => socket.off('messagesSeen')

export const getSocket = () => socket

export default socket
