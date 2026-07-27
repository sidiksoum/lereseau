import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "react-router-dom"
import { Search, Info, Phone, Video, MoreVertical, Send, Smile, Paperclip, ArrowLeft, User, MessageSquare } from "lucide-react"
import EmojiPicker from 'emoji-picker-react'
import { useAuth } from "../../contexts/AuthContext"
import { getConversations, sendMessage, getConversationMessages } from "../../services/chat"
import { getAcceptedConnections } from "../../services/network"
import { getPremiumMentors } from "../../services/user"
import { getSocket } from "../../services/socket"
import type { ChatConversation, ChatMessage, SendMessagePayload, User as UserType } from "../../types/api"

export function ChatPage() {
  const { user: currentUser } = useAuth()
  const [searchParams] = useSearchParams()
  const [conversations, setConversations] = useState<ChatConversation[]>([])
  const [friends, setFriends] = useState<UserType[]>([])
  const [mentors, setMentors] = useState<UserType[]>([])
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const emojiPickerRef = useRef<HTMLDivElement>(null)

  // Charger les conversations et amis au montage
  useEffect(() => {
    loadConversationsAndFriends()
    loadMentors()
  }, [])

  const loadMentors = async () => {
    try {
      const premiumMentors = await getPremiumMentors()
      setMentors(premiumMentors)
    } catch (error) {
      console.error('Error loading mentors:', error)
    }
  }

  // Gérer le paramètre userId pour démarrer une conversation
  useEffect(() => {
    const userId = searchParams.get('userId')
    if (userId) {
      // Trouver une conversation existante avec cet utilisateur
      const existingConversation = conversations.find(conv =>
        conv.otherParticipants.some(p => p.id === userId)
      )
      if (existingConversation) {
        selectConversation(existingConversation)
      } else {
        // Chercher l'ami et créer une conversation virtuelle
        const friend = friends.find(f => f.id === userId)
        if (friend) {
          startNewConversation(friend)
        } else {
          // Chercher le mentor et créer une conversation virtuelle
          const mentor = mentors.find(m => m.id === userId)
          if (mentor) {
            startNewConversation(mentor)
          }
        }
      }
    }
  }, [searchParams, conversations, friends, mentors])

  // Scroll vers le bas quand de nouveaux messages arrivent
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Fermer le sélecteur d'emojis au clic en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false)
      }
    }

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showEmojiPicker])

  // Écouter les messages en temps réel via Socket.IO
  useEffect(() => {
    const socket = getSocket()
    if (!socket) return

    const handleNewMessage = (data: { conversationId: string; message: string; senderId: string }) => {
      console.log('📨 [Socket.IO] Nouveau message reçu :', data)
      
      // 1. Mettre à jour la liste des conversations (dernier message, badge non lu)
      setConversations((prevConvs) => {
        const index = prevConvs.findIndex(c => c.id === data.conversationId)
        let updatedConvs = [...prevConvs]
        
        if (index !== -1) {
          const conv = { ...prevConvs[index] }
          conv.lastMessageText = data.message
          conv.lastMessageAt = new Date().toISOString()
          
          // Incrémenter le compteur non lu si la conversation n'est pas celle actuellement ouverte
          if (!selectedConversation || selectedConversation.id !== data.conversationId) {
            conv.myUnreadCount = (conv.myUnreadCount || 0) + 1
          }
          
          updatedConvs[index] = conv
          // Placer au sommet
          updatedConvs = [conv, ...updatedConvs.filter(c => c.id !== data.conversationId)]
        } else {
          // Si la conversation n'existe pas encore dans la liste, on la recharge entièrement
          loadConversationsAndFriends()
        }
        return updatedConvs
      })

      // 2. Si c'est la conversation ouverte actuelle, ajouter le message en temps réel
      if (selectedConversation && selectedConversation.id === data.conversationId) {
        const otherParticipant = selectedConversation.otherParticipants[0]
        const newMessageObj: ChatMessage = {
          id: `msg-${Date.now()}`,
          conversationId: data.conversationId,
          senderId: data.senderId,
          content: data.message,
          createdAt: new Date().toISOString(),
          senderDetails: {
            id: otherParticipant.id,
            firstName: otherParticipant.firstName,
            lastName: otherParticipant.lastName,
            avatarUrl: otherParticipant.avatarUrl
          }
        }
        setMessages((prevMessages) => [...prevMessages, newMessageObj])
      }
    }

    socket.on('new_message', handleNewMessage)
    return () => {
      socket.off('new_message', handleNewMessage)
    }
  }, [selectedConversation, currentUser])


  const sortConversationsByActivity = (convs: ChatConversation[]) => {
    return convs.slice().sort((a, b) => {
      const aTime = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0
      const bTime = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0
      return bTime - aTime
    })
  }

  const loadConversationsAndFriends = async () => {
    try {
      const [convs, acceptedConnections] = await Promise.all([
        getConversations(),
        getAcceptedConnections()
      ])

      const sortedConversations = sortConversationsByActivity(convs)
      setConversations(sortedConversations)

      const friendsList = acceptedConnections
        .map(conn => conn.targetUser)
        .filter((user): user is UserType => Boolean(user))
      setFriends(friendsList)
      return sortedConversations
    } catch (error) {
      console.error('Erreur lors du chargement des conversations et amis:', error)
      return []
    } finally {
      setLoading(false)
    }
  }

  const ensureConversationIsTop = (convs: ChatConversation[], conversationId: string) => {
    const index = convs.findIndex(conv => conv.id === conversationId)
    if (index <= 0) return convs
    const selected = convs[index]
    return [selected, ...convs.slice(0, index), ...convs.slice(index + 1)]
  }

  const findUpdatedConversation = (convs: ChatConversation[], current: ChatConversation) => {
    if (current.id.startsWith('new-')) {
      const friendId = current.otherParticipants[0]?.id
      return convs.find((conv) => conv.otherParticipants.some((p) => p.id === friendId))
    }
    return convs.find((conv) => conv.id === current.id)
  }

  const startNewConversation = (friend: UserType) => {
    const virtualConversation: ChatConversation = {
      id: `new-${friend.id}`,
      participants: [currentUser?.id || '', friend.id],
      lastMessageAt: null,
      lastMessageText: null,
      unreadCount: {},
      otherParticipants: [
        {
          id: friend.id,
          firstName: friend.firstName || '',
          lastName: friend.lastName || '',
          avatarUrl: friend.avatarUrl || '',
          roleType: friend.roleType
        }
      ],
      myUnreadCount: 0
    }
    setSelectedConversation(virtualConversation)
    setMessages([])
  }

  const normalizeMessages = (messages: ChatMessage[], fallbackText: string | null) => {
    return messages.map((message) => ({
      ...message,
      content: message.content ?? message.message ?? message.text ?? message.body ?? message.messageText ?? fallbackText ?? undefined,
    }))
  }

  const selectConversation = async (conversation: ChatConversation) => {
    setSelectedConversation(conversation)
    
    // Si c'est une conversation virtuelle (nouvellement créée), ne pas charger de messages
    if (conversation.id.startsWith('new-')) {
      setMessages([])
      return
    }

    try {
      const response = await getConversationMessages(conversation.id)
      const fallbackText = response.conversation?.lastMessageText ?? conversation.lastMessageText ?? null
      // Trier les messages par date (du plus ancien au plus récent)
      const sortedMessages = normalizeMessages(response.messages, fallbackText).sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
        return dateA - dateB
      })
      setMessages(sortedMessages)
      setSelectedConversation(response.conversation)
    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error)
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || sending) return

    setSending(true)
    const originalMessage = newMessage.trim()
    try {
      const payload: SendMessagePayload = {
        content: originalMessage,
        recipientId: selectedConversation.otherParticipants[0].id
      }

      const res = await sendMessage(payload)
      setNewMessage("")

      // Ajouter le message envoyé instantanément à l'état local
      if (res && res.message) {
        const sentMessage = {
          ...res.message,
          content: res.message.content || res.message.message || originalMessage,
          senderDetails: {
            id: currentUser?.id || '',
            firstName: currentUser?.firstName || '',
            lastName: currentUser?.lastName || '',
            avatarUrl: currentUser?.avatarUrl || ''
          }
        }
        setMessages((prev) => [...prev, sentMessage])
      }

      // Mettre à jour l'ordre et le contenu de la conversation dans le menu latéral
      if (res && res.conversation) {
        setConversations((prevConvs) => {
          const filtered = prevConvs.filter(c => c.id !== selectedConversation.id && c.id !== res.conversation.id)
          return [res.conversation, ...filtered]
        })
        setSelectedConversation(res.conversation)
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error)
    } finally {
      setSending(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleEmojiClick = (emojiObject: any) => {
    setNewMessage((prevMessage) => prevMessage + emojiObject.emoji)
    setShowEmojiPicker(false)
  }

  const formatTimeOnly = (dateString: string | null) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  }

  const formatDateSeparator = (dateString: string | null) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Aujourd'hui"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Hier"
    } else {
      return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
    }
  }

  const getConversationDisplayName = (conversation: ChatConversation) => {
    if (conversation.otherParticipants.length > 0) {
      const participant = conversation.otherParticipants[0]
      return `${participant.firstName} ${participant.lastName}`
    }
    return "Conversation"
  }

  const getConversationAvatar = (conversation: ChatConversation) => {
    if (conversation.otherParticipants.length > 0) {
      return conversation.otherParticipants[0].avatarUrl
    }
    return null
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden h-[calc(100vh-8rem)] flex shadow-sm">
        <div className="w-full md:w-80 border-r border-slate-200 dark:border-slate-800 flex items-center justify-center">
          <div className="text-slate-500 dark:text-slate-400">Chargement...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden h-[calc(100vh-8rem)] flex shadow-sm relative">
      {/* Sidebar de conversation */}
      <div className={`w-full md:w-80 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50/50 dark:bg-slate-800/50 shrink-0 ${selectedConversation ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input type="text" placeholder="Rechercher..." className="w-full pl-9 pr-4 py-2 bg-slate-100 border-transparent rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto hide-scrollbar">
          {conversations.map((conversation) => {
            const displayName = getConversationDisplayName(conversation)
            const avatarUrl = getConversationAvatar(conversation)
            const isSelected = selectedConversation?.id === conversation.id

            return (
              <div
                key={conversation.id}
                onClick={() => selectConversation(conversation)}
                className={`flex items-center gap-3 p-4 border-b border-slate-100 dark:border-slate-800 cursor-pointer transition-colors ${isSelected ? 'bg-blue-50 dark:bg-blue-900/30 relative' : 'hover:bg-slate-100 dark:hover:bg-slate-800 bg-white dark:bg-slate-900'}`}
              >
                {conversation.myUnreadCount > 0 && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600"></div>}
                <div className="relative">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="avatar" className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                      <User className="h-6 w-6 text-slate-500 dark:text-slate-400" />
                    </div>
                  )}
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`text-sm font-semibold truncate ${conversation.myUnreadCount > 0 ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                      {displayName}
                    </h3>
                    <span className={`text-xs ${conversation.myUnreadCount > 0 ? 'text-blue-600 font-bold' : 'text-slate-400'}`}>
                      {conversation.lastMessageAt ? formatTimeOnly(conversation.lastMessageAt) : ''}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className={`text-sm truncate ${conversation.myUnreadCount > 0 ? 'text-slate-900 dark:text-white font-medium' : 'text-slate-500 dark:text-slate-400'}`}>
                      {conversation.lastMessageText || 'Aucun message'}
                    </p>
                    {conversation.myUnreadCount > 0 && (
                      <span className="flex items-center justify-center w-5 h-5 bg-blue-600 text-white text-[10px] font-bold rounded-full">
                        {conversation.myUnreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}

          {/* Amis sans conversation */}
          {friends
            .filter(friend => !conversations.some(conv => conv.otherParticipants.some(p => p.id === friend.id)))
            .map((friend) => {
              const isSelected = selectedConversation?.id === `new-${friend.id}`
              const avatarUrl = friend.avatarUrl
              const displayName = `${friend.firstName} ${friend.lastName}`

              return (
                <div
                  key={`friend-${friend.id}`}
                  onClick={() => startNewConversation(friend)}
                  className={`flex items-center gap-3 p-4 border-b border-slate-100 dark:border-slate-800 cursor-pointer transition-colors ${isSelected ? 'bg-blue-50 dark:bg-blue-900/30 relative' : 'hover:bg-slate-100 dark:hover:bg-slate-800 bg-white dark:bg-slate-900'}`}
                >
                  <div className="relative">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="avatar" className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                        <User className="h-6 w-6 text-slate-500 dark:text-slate-400" />
                      </div>
                    )}
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-semibold truncate text-slate-700 dark:text-slate-300">
                        {displayName}
                      </h3>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm truncate text-slate-500 dark:text-slate-400 italic">
                        Nouvelle conversation
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}

          {conversations.length === 0 && friends.length === 0 && (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400">
              Aucune conversation pour le moment
            </div>
          )}
        </div>
      </div>

      {/* Zone de discussion */}
      <div className={`flex-1 flex flex-col bg-[#F8FAFC] dark:bg-slate-950 ${!selectedConversation ? 'hidden md:flex' : 'flex'}`}>
        {selectedConversation ? (
          <>
            {/* Header du Chat */}
            <div className="h-16 px-4 md:px-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedConversation(null)}
                  className="md:hidden p-2 -ml-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                {getConversationAvatar(selectedConversation) ? (
                  <img
                    src={getConversationAvatar(selectedConversation)!}
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                    <User className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                  </div>
                )}
                <div>
                  <h2 className="font-bold text-slate-900 dark:text-white text-sm">
                    {getConversationDisplayName(selectedConversation)}
                  </h2>
                  <p className="text-xs text-green-600 font-medium">En ligne</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <button className="p-2 hover:bg-slate-100 rounded-lg hover:text-blue-600 transition-colors">
                  <Phone className="h-5 w-5" />
                </button>
                <button className="p-2 hover:bg-slate-100 rounded-lg hover:text-blue-600 transition-colors">
                  <Video className="h-5 w-5" />
                </button>
                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <Info className="h-5 w-5" />
                </button>
                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Historique des messages */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
              {messages.length === 0 ? (
                <div className="text-center text-slate-400 font-medium my-8">
                  Aucun message dans cette conversation
                </div>
              ) : (
                messages.map((message, index) => {
                  const isCurrentUser = message.senderDetails.id === currentUser?.id
                  const isFirstMessage = index === 0
                  const previousMessage = messages[index - 1]

                  // Vérifier si on doit afficher un séparateur de date
                  const showDateSeparator = isFirstMessage ||
                    (previousMessage && new Date(message.createdAt || '').toDateString() !== new Date(previousMessage.createdAt || '').toDateString())

                  return (
                    <div key={message.id || index} className="mb-4">
                      {/* Séparateur de date */}
                      {showDateSeparator && message.createdAt && (
                        <div className="text-center text-xs text-slate-400 font-medium my-4">
                          {formatDateSeparator(message.createdAt)}
                        </div>
                      )}

                      {/* Message */}
                      <div className={`flex gap-3 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                        {/* Avatar pour les autres utilisateurs */}
                        {!isCurrentUser && (
                          <div className="flex-shrink-0">
                            {message.senderDetails.avatarUrl ? (
                              <img
                                src={message.senderDetails.avatarUrl}
                                alt={message.senderDetails.firstName}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                                <User className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                              </div>
                            )}
                          </div>
                        )}

                        {/* Conteneur du message */}
                        <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'} max-w-[70%]`}>
                          {/* Nom de l'expéditeur (seulement pour les autres utilisateurs) */}
                          {!isCurrentUser && (
                            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 px-1">
                              {message.senderDetails.firstName} {message.senderDetails.lastName}
                            </div>
                          )}

                          {/* Bulle de message */}
                          <div className={`px-4 py-3 text-base break-words min-h-[44px] flex items-center shadow-sm ${
                            isCurrentUser
                              ? 'bg-blue-600 text-white rounded-2xl rounded-br-sm'
                              : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-2xl rounded-bl-sm'
                          }`}>
                            <span className="leading-relaxed">
                              {message.content ?? message.message ?? message.text ?? message.body ?? message.messageText ?? 'Contenu indisponible.'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
              <div className="flex items-center gap-3">
                <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                  <Paperclip className="h-5 w-5" />
                </button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Tapez votre message..."
                    className="w-full pl-4 pr-12 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    disabled={sending}
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <button 
                      type="button"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    >
                      <Smile className="h-4 w-4" />
                    </button>
                    {showEmojiPicker && (
                      <div 
                        ref={emojiPickerRef}
                        className="absolute bottom-12 right-0 z-50"
                      >
                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || sending}
                  className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-full transition-colors flex items-center justify-center"
                >
                  {sending ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-500 dark:text-slate-400">
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8" />
              </div>
              <p>Sélectionnez une conversation pour commencer</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
