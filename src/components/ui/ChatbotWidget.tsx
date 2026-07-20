import { useState, useRef, useEffect } from 'react'
import { X, Send, Bot, Loader2 } from 'lucide-react'
import { askChatbot } from '../../services/chatbot'
import ReactMarkdown from 'react-markdown'

type Message = {
  id: string
  role: 'user' | 'bot'
  content: string
  isTyping?: boolean
}

const TypingMarkdown = ({ content, isTyping, onType }: { content: string, isTyping?: boolean, onType: () => void }) => {
  const [displayedContent, setDisplayedContent] = useState(isTyping ? '' : content)

  useEffect(() => {
    if (!isTyping) {
      setDisplayedContent(content)
      return
    }

    let currentIndex = 0
    const interval = setInterval(() => {
      const increment = 3 // Révèle 3 caractères à la fois pour un effet fluide et rapide
      if (currentIndex < content.length) {
        currentIndex += increment
        setDisplayedContent(content.slice(0, currentIndex))
        onType()
      } else {
        setDisplayedContent(content)
        clearInterval(interval)
      }
    }, 15) 

    return () => clearInterval(interval)
  }, [content, isTyping])

  return <ReactMarkdown>{displayedContent}</ReactMarkdown>
}

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'bot',
      content: "Bonjour ! 👋 Je suis l'assistant IA de LeRéseau. Comment puis-je vous aider aujourd'hui ?"
    },
    {
      id: '2',
      role: 'bot',
      content: "Cherchez-vous une bourse, un mentor, ou de l'aide pour votre orientation universitaire ?"
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scrollToBottomSmooth = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToBottomInstant = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottomSmooth()
  }, [messages, isOpen, isLoading])

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim()
    }

    // Retirer l'état "isTyping" des messages précédents si l'IA tapait encore
    setMessages(prev => [
      ...prev.map(m => ({ ...m, isTyping: false })), 
      userMessage
    ])
    setInputValue('')
    setIsLoading(true)

    try {
      const response = await askChatbot({
        question: userMessage.content,
        history: messages.map(msg => ({
          additionalProp1: msg.role,
          additionalProp2: msg.content,
          additionalProp3: msg.id
        }))
      })

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: response.answer,
        isTyping: true
      }

      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error("Erreur lors de la communication avec l'IA:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: "Désolé, une erreur s'est produite lors de la connexion à l'IA. Veuillez réessayer plus tard.",
        isTyping: true
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-24 md:bottom-6 right-4 md:right-6 h-16 w-16 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-indigo-700 hover:scale-105 transition-all z-50 ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
      >
        <Bot className="h-7 w-7" />
        <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-red-500 border-[3px] border-white"></span>
      </button>

      <div 
        className={`fixed bottom-24 md:bottom-6 right-4 md:right-6 w-[calc(100vw-2rem)] sm:w-[450px] md:w-[480px] h-[600px] max-h-[80vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-[100] origin-bottom-right transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}
      >
        <div className="bg-indigo-600 p-4 text-white flex items-center justify-between shadow-sm shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-base tracking-wide">LeRéseau IA</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="h-2 w-2 rounded-full bg-green-400"></span>
                <p className="text-xs text-indigo-100 font-medium">Assistant en ligne</p>
              </div>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)} 
            className="text-indigo-100 hover:text-white hover:bg-indigo-500 p-1.5 rounded-lg transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div 
          ref={scrollContainerRef}
          className="flex-1 p-5 overflow-y-auto bg-slate-50 dark:bg-slate-900/50 flex flex-col gap-5"
        >
          <div className="text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-white dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">Aujourd'hui</span>
          </div>
          
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-end gap-2.5 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border-[3px] border-white shadow-sm ${msg.role === 'bot' ? 'bg-indigo-100' : 'bg-blue-100'}`}>
                {msg.role === 'bot' ? (
                  <Bot className="h-5 w-5 text-indigo-600" />
                ) : (
                  <span className="text-xs font-bold text-blue-600">Moi</span>
                )}
              </div>
              <div className={`p-3.5 rounded-2xl shadow-sm border text-sm max-w-none ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white border-blue-700 rounded-br-sm' 
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-bl-sm [&_a]:text-indigo-600 dark:[&_a]:text-indigo-400 [&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4 [&_li]:my-1 [&_strong]:font-bold [&_p]:my-1.5 [&_h1]:text-lg [&_h1]:font-bold [&_h2]:text-base [&_h2]:font-bold [&_h3]:text-[15px] [&_h3]:font-semibold'
              }`}>
                {msg.role === 'bot' ? (
                  <TypingMarkdown 
                    content={msg.content} 
                    isTyping={msg.isTyping} 
                    onType={scrollToBottomInstant} 
                  />
                ) : (
                  <span className="whitespace-pre-wrap leading-relaxed">{msg.content}</span>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-end gap-2.5 max-w-[85%]">
              <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 border-[3px] border-white shadow-sm">
                <Bot className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="bg-white dark:bg-slate-800 p-3.5 flex items-center gap-2 rounded-2xl rounded-bl-sm shadow-sm border border-slate-200 dark:border-slate-700 text-sm h-[48px]">
                <Loader2 className="h-5 w-5 text-indigo-600 animate-spin flex-shrink-0" />
                <span className="text-slate-500 font-medium">Réfléchit...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-1.5 py-1.5 pr-2 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all shadow-inner">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend()
              }}
              placeholder="Posez votre question..." 
              className="flex-1 bg-transparent border-none px-4 py-1.5 text-sm focus:outline-none text-slate-700 dark:text-slate-300 placeholder:text-slate-400"
              disabled={isLoading}
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !inputValue.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white h-10 w-10 rounded-full flex items-center justify-center shrink-0 transition-colors shadow-sm"
            >
              <Send className="h-4 w-4 ml-0.5" />
            </button>
          </div>
          <div className="text-center mt-2">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">L'IA de LeRéseau peut faire des erreurs. Considérez vérifier les informations.</span>
          </div>
        </div>
      </div>
    </>
  )
}
