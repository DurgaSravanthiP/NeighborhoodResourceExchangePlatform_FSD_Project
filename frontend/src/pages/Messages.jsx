import { useEffect, useState, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getConversations, getMessages, sendMessage } from '../services/api'
import { useAuth } from '../context/AuthContext'
import {
  onReceiveMessage, offReceiveMessage,
  sendSocketMessage,
  emitTyping, onTyping, offTyping,
  emitMarkDelivered, emitMarkSeen,
  onMessageStatus, offMessageStatus,
  onMessagesSeen, offMessagesSeen
} from '../services/socket'
import { FiSend, FiMessageSquare, FiArrowLeft, FiSearch } from 'react-icons/fi'

const Messages = () => {
  const { user } = useAuth()
  const { userId } = useParams()
  const navigate = useNavigate()

  const [conversations, setConversations] = useState([])
  const [messages, setMessages] = useState([])
  const [activeUser, setActiveUser] = useState(null)
  const [typingUsers, setTypingUsers] = useState({})
  const [text, setText] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [sending, setSending] = useState(false)
  const [typingMsg, setTypingMsg] = useState('')
  const [loadingMsgs, setLoadingMsgs] = useState(false)
  const messagesEndRef = useRef(null)
  const typingTimeout = useRef(null)
  const typingTimeouts = useRef({})
  const activeUserRef = useRef(null)

  // Keep ref in sync so socket callbacks can access latest activeUser
  useEffect(() => { activeUserRef.current = activeUser }, [activeUser])

  const loadConversations = useCallback(async () => {
    try {
      const { data } = await getConversations()
      setConversations(data)
    } catch { /* silent */ }
  }, [])

  // Load conversations on mount
  useEffect(() => { loadConversations() }, [loadConversations])

  // Load messages when activeUser changes
  useEffect(() => {
    if (!activeUser) { setMessages([]); return }
    setLoadingMsgs(true)
    getMessages(activeUser._id)
      .then(({ data }) => setMessages(data))
      .catch(() => toast.error('Failed to load messages'))
      .finally(() => setLoadingMsgs(false))
  }, [activeUser])

  // Auto-open from URL param after conversations load
  useEffect(() => {
    if (!userId) return
    if (conversations.length > 0) {
      const conv = conversations.find(c => c.user._id === userId)
      if (conv && activeUserRef.current?._id !== conv.user._id) {
        setActiveUser(conv.user)
      }
    } else if (!activeUser) {
      // If no conversations loaded yet, try fetching user info from messages
      getMessages(userId)
        .then(({ data }) => {
          if (data.length > 0) {
            const other = data[0].senderId?._id === user._id ? data[0].receiverId : data[0].senderId
            if (other?._id) { setActiveUser(other); setMessages(data) }
          }
        }).catch(() => { })
    }
  }, [userId, conversations])

  // Socket — real-time incoming messages
  useEffect(() => {
    onReceiveMessage((msg) => {
      const au = activeUserRef.current
      const senderId = msg.senderId?._id || msg.senderId
      const receiverId = msg.receiverId?._id || msg.receiverId
      if (au && (senderId === au._id || receiverId === au._id)) {
        setMessages(prev => {
          if (prev.find(m => m._id && m._id === msg._id)) return prev
          return [...prev, msg]
        })
        if (senderId !== user._id) {
          emitMarkSeen({ senderId, receiverId: user._id })
        }
      } else {
        if (senderId !== user._id) {
          emitMarkDelivered({ messageId: msg._id, senderId })
          setConversations(prev => prev.map(c =>
            c.user._id === senderId
              ? { ...c, unreadCount: (c.unreadCount || 0) + 1, lastMessage: msg.message }
              : c
          ))
        }
      }
      loadConversations()
    })

    onTyping(({ senderName, senderId }) => {
      if (activeUserRef.current && activeUserRef.current._id === senderId) {
        setTypingMsg(`${senderName} is typing...`)
        clearTimeout(typingTimeout.current)
        typingTimeout.current = setTimeout(() => setTypingMsg(''), 2500)
      }
      setTypingUsers(prev => ({ ...prev, [senderId]: true }))
      clearTimeout(typingTimeouts.current[senderId])
      typingTimeouts.current[senderId] = setTimeout(() => {
        setTypingUsers(prev => ({ ...prev, [senderId]: false }))
      }, 2500)
    })

    onMessageStatus(({ messageId, status }) => {
      setMessages(prev => prev.map(m => m._id === messageId ? { ...m, status } : m))
      loadConversations()
    })

    onMessagesSeen(({ receiverId }) => {
      setMessages(prev => prev.map(m =>
        (m.receiverId?._id || m.receiverId) === receiverId && m.status !== 'seen'
          ? { ...m, status: 'seen' }
          : m
      ))
      loadConversations()
    })

    return () => {
      offReceiveMessage()
      offTyping()
      offMessageStatus()
      offMessagesSeen()
    }
  }, [loadConversations])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typingMsg])

  const handleSend = async () => {
    if (!text.trim() || !activeUser || sending) return
    const msgText = text.trim()
    setText('')
    setSending(true)
    try {
      const { data } = await sendMessage({ receiverId: activeUser._id, message: msgText })
      setMessages(prev => [...prev, data])
      sendSocketMessage({
        ...data,
        senderId: user._id,
        receiverId: activeUser._id,
      })
      loadConversations()
    } catch {
      toast.error('Failed to send message')
      setText(msgText)
    } finally {
      setSending(false)
    }
  }

  const handleTyping = (e) => {
    setText(e.target.value)
    if (activeUser) emitTyping({ receiverId: activeUser._id, senderName: user.name, senderId: user._id })
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  const openConversation = (u) => {
    setActiveUser(u)
    setMessages([])
    emitMarkSeen({ senderId: u._id, receiverId: user._id })
    setConversations(prev => prev.map(c => c.user._id === u._id ? { ...c, unreadCount: 0 } : c))
    navigate(`/messages/${u._id}`)
  }

  const formatTime = (ts) => {
    if (!ts) return ''
    return new Date(ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  }

  const getSenderId = (msg) => msg.senderId?._id || msg.senderId

  const filteredConversations = conversations.filter(c =>
    c.user?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalUnread = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0)

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 64px)' }}>
      {/* Page title bar */}
      <div className="px-4 py-3 bg-white border-b border-gray-100 shrink-0 flex items-center gap-2">
        <h1 className="font-display text-xl font-bold text-gray-800">💬 Messages</h1>
        {totalUnread > 0 && (
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-bounce">
            {totalUnread} New
          </span>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden">

        {/* ── SIDEBAR ── */}
        <div className={`w-full md:w-72 lg:w-80 shrink-0 bg-white border-r border-gray-100 flex flex-col
          ${activeUser ? 'hidden md:flex' : 'flex'}`}>
          {/* Search bar */}
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <FiSearch className="absolute left-3 top-2.5 text-gray-400" size={14} />
              <input className="w-full pl-8 pr-3 py-2 text-sm bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                  <FiMessageSquare size={28} className="text-emerald-400" />
                </div>
                <p className="font-semibold text-gray-600 text-sm">No conversations yet</p>
                <p className="text-gray-400 text-xs mt-1">Send a borrow request to start chatting</p>
              </div>
            ) : filteredConversations.length === 0 && searchQuery ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <FiSearch size={28} className="text-gray-400" />
                </div>
                <p className="font-semibold text-gray-600 text-sm">Not available</p>
                <p className="text-gray-400 text-xs mt-1">No user matches "{searchQuery}"</p>
              </div>
            ) : filteredConversations.map((conv) => {
              const u = conv.user;
              const { lastMessage, timestamp, unreadCount, lastMessageStatus, lastMessageSender } = conv;
              return (
                <button key={u._id}
                  onClick={() => openConversation(u)}
                  className={`w-full flex items-center gap-3 px-4 py-4 hover:bg-gray-50 transition-colors text-left border-b border-gray-50
                  ${activeUser?._id === u._id ? 'bg-emerald-50 border-l-[3px] border-l-emerald-500' : ''}`}>
                  <div className="w-11 h-11 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-700 text-sm shrink-0">
                    {u.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm font-semibold truncate ${activeUser?._id === u._id ? 'text-emerald-700' : 'text-gray-800'}`}>
                        {u.name}
                      </p>
                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        {unreadCount > 0 && (
                          <span className="w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                            {unreadCount}
                          </span>
                        )}
                        <p className="text-gray-400 text-xs">{formatTime(timestamp)}</p>
                      </div>
                    </div>
                    {typingUsers[u._id] ? (
                      <p className="text-emerald-500 text-xs mt-0.5 animate-pulse font-medium">Typing...</p>
                    ) : (
                      <p className="text-gray-400 text-xs truncate mt-0.5">
                        {lastMessageStatus && lastMessageSender === user._id && (
                          <span className="text-emerald-500 font-bold mr-1">
                            {lastMessageStatus === 'seen' ? '✓✓' : lastMessageStatus === 'delivered' ? '✓✓' : '✓'}
                          </span>
                        )}
                        {lastMessage || 'Start a conversation'}
                      </p>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* ── CHAT AREA ── */}
        <div className={`flex-1 flex flex-col bg-gray-50 ${!activeUser ? 'hidden md:flex' : 'flex'}`}>
          {!activeUser ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-300">
              <div className="w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
                <FiMessageSquare size={36} className="text-emerald-300" />
              </div>
              <p className="text-gray-500 font-semibold text-lg">Select a conversation</p>
              <p className="text-gray-400 text-sm mt-1">Pick a chat from the left to start messaging</p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="flex items-center gap-3 px-5 py-3.5 bg-white border-b border-gray-100 shadow-sm shrink-0">
                <button onClick={() => { setActiveUser(null); navigate('/messages') }}
                  className="md:hidden p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                  <FiArrowLeft size={18} />
                </button>
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-700">
                  {activeUser.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-800">{activeUser.name}</p>
                  {typingMsg
                    ? <p className="text-xs text-emerald-500 animate-pulse">{typingMsg}</p>
                    : <p className="text-xs text-gray-400">Tap message to reply</p>}
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
                {loadingMsgs ? (
                  <div className="flex justify-center py-10">
                    <span className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full py-16">
                    <div className="text-5xl mb-3">👋</div>
                    <p className="text-gray-500 font-semibold">Say hello to {activeUser.name}!</p>
                    <p className="text-gray-400 text-sm mt-1">This is the beginning of your conversation</p>
                  </div>
                ) : (
                  <>
                    {messages.map((msg, i) => {
                      const isMine = getSenderId(msg) === user._id
                      const showDate = i === 0 || new Date(messages[i - 1].timestamp || messages[i - 1].createdAt).toDateString() !== new Date(msg.timestamp || msg.createdAt).toDateString()
                      return (
                        <div key={msg._id || `msg-${i}`}>
                          {showDate && (
                            <div className="flex items-center gap-3 my-3">
                              <div className="flex-1 h-px bg-gray-200" />
                              <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                                {new Date(msg.timestamp || msg.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                              </span>
                              <div className="flex-1 h-px bg-gray-200" />
                            </div>
                          )}
                          <div className={`flex ${isMine ? 'justify-end' : 'justify-start'} mb-1`}>
                            {!isMine && (
                              <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-700 mr-2 mt-1 shrink-0">
                                {activeUser.name?.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div className={`max-w-[65%] lg:max-w-[55%]`}>
                              <div className={`px-4 py-2.5 rounded-2xl text-sm shadow-sm
                                ${isMine
                                  ? 'bg-emerald-600 text-white rounded-br-none'
                                  : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'}`}>
                                <p className="leading-relaxed break-words">{msg.message}</p>
                              </div>
                              <p className={`text-xs mt-1 flex gap-1 ${isMine ? 'justify-end text-gray-400' : 'justify-start text-gray-400'}`}>
                                {formatTime(msg.timestamp || msg.createdAt)}
                                {isMine && (
                                  <span className="text-[10px] uppercase font-bold text-emerald-500">
                                    {msg.status === 'seen' ? '✓✓ Seen' : msg.status === 'delivered' ? '✓✓ Delivered' : '✓ Sent'}
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </>
                )}
                {/* Typing indicator bubble */}
                {typingMsg && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none px-4 py-2.5 shadow-sm">
                      <div className="flex gap-1 items-center">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="px-4 py-3 bg-white border-t border-gray-100 shrink-0">
                <div className="flex items-end gap-2 bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100 transition-all px-4 py-2">
                  <textarea
                    rows={1}
                    className="flex-1 bg-transparent resize-none focus:outline-none text-sm text-gray-800 placeholder-gray-400 py-1.5 max-h-28"
                    placeholder={`Message ${activeUser.name}...`}
                    value={text}
                    onChange={handleTyping}
                    onKeyDown={handleKeyDown}
                  />
                  <button
                    onClick={handleSend}
                    disabled={sending || !text.trim()}
                    className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center
                      hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 shrink-0 mb-0.5">
                    {sending
                      ? <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      : <FiSend size={14} />}
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1.5 text-center">Press Enter to send · Shift+Enter for new line</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Messages
