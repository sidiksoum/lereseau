import { useState, useRef } from 'react'
import { X, Upload, Loader2, Video, Image as ImageIcon, Images } from 'lucide-react'
import { createPremiumFeed } from '../../services/publishing'

interface PublishFeedModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function PublishFeedModal({ isOpen, onClose, onSuccess }: PublishFeedModalProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [postType, setPostType] = useState<'image' | 'gallery' | 'video'>('image')
  const [videoUrl, setVideoUrl] = useState('')
  const [mediaFile, setMediaFile] = useState<File | null>(null)
  const [mediaPreview, setMediaPreview] = useState<string | null>(null)
  const [galleryFiles, setGalleryFiles] = useState<File[]>([])
  const [imageUrls, setImageUrls] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setMediaFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setMediaPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      setGalleryFiles(prev => [...prev, ...files])
    }
  }

  const removeGalleryFile = (index: number) => {
    setGalleryFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || (!content.trim() && !mediaFile && !videoUrl.trim() && galleryFiles.length === 0 && !imageUrls.trim())) {
      setError("Veuillez remplir le titre et le contenu ou un média.")
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('content', content)
      formData.append('mediaType', postType)

      if (postType === 'video' && videoUrl.trim()) formData.append('videoUrl', videoUrl.trim())
      if (postType === 'image' && mediaFile) {
        formData.append('image', mediaFile)
      } else if (postType === 'image' && imageUrls.trim()) {
        formData.append('imageUrls', imageUrls.trim())
      }
      if (postType === 'gallery' && galleryFiles.length > 0) {
        galleryFiles.forEach((file) => formData.append('galleryImages[]', file))
      } else if (postType === 'gallery' && imageUrls.trim()) {
        formData.append('imageUrls', imageUrls.trim())
      }

      await createPremiumFeed(formData)
      onSuccess()
      onClose()
      
      // Reset form
      setTitle('')
      setContent('')
      setPostType('image')
      setVideoUrl('')
      setMediaFile(null)
      setMediaPreview(null)
      setGalleryFiles([])
      setImageUrls('')
    } catch (err: any) {
      setError(err.message || "Erreur lors de la publication")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center shrink-0">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Publier une annonce</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm border border-red-100 dark:border-red-900/30">
              {error}
            </div>
          )}

          <form id="feed-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg w-max">
              <button
                type="button"
                onClick={() => setPostType('image')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${postType === 'image' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
              >
                <ImageIcon className="h-4 w-4" /> Image
              </button>
              <button
                type="button"
                onClick={() => setPostType('gallery')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${postType === 'gallery' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
              >
                <Images className="h-4 w-4" /> Galerie
              </button>
              <button
                type="button"
                onClick={() => setPostType('video')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${postType === 'video' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
              >
                <Video className="h-4 w-4" /> Vidéo
              </button>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Titre de la publication</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-600 focus:ring-blue-600 p-2.5 text-sm outline-none"
                placeholder="Ex: Rentrée solennelle 2026..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Contenu de la publication</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-600 focus:ring-blue-600 p-3 text-sm outline-none"
                placeholder="Partagez une opportunité, une annonce ou une réflexion..."
                required
              ></textarea>
            </div>

            {postType === 'video' && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">URL d'une vidéo YouTube / Vimeo</label>
                <div className="relative">
                  <Video className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-600 focus:ring-blue-600 p-2.5 pl-10 text-sm outline-none"
                    placeholder="https://..."
                  />
                </div>
              </div>
            )}

            {postType === 'image' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Joindre une image</label>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept="image/*" 
                    className="hidden" 
                  />
                  
                  {!mediaPreview ? (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-1 flex justify-center rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 px-6 py-8 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <div className="text-center">
                        <ImageIcon className="mx-auto h-8 w-8 text-slate-400 dark:text-slate-500" />
                        <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                          <span className="font-semibold text-blue-600 dark:text-blue-400">Sélectionner une photo</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                      <img src={mediaPreview} alt="Preview" className="w-full h-48 object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setMediaFile(null)
                          setMediaPreview(null)
                          if (fileInputRef.current) fileInputRef.current.value = ''
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">URL de l'image (Alternative)</label>
                  <input
                    type="url"
                    value={imageUrls}
                    onChange={(e) => setImageUrls(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-600 focus:ring-blue-600 p-2.5 text-sm outline-none"
                    placeholder="https://..."
                  />
                </div>
              </div>
            )}

            {postType === 'gallery' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Galerie (Plusieurs images)</label>
                  <input type="file" accept="image/*" multiple onChange={handleGalleryChange} ref={galleryInputRef} className="hidden" />
                  <div
                    onClick={() => galleryInputRef.current?.click()}
                    className="mt-1 flex justify-center rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 px-6 py-8 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <div className="text-center">
                      <Images className="mx-auto h-8 w-8 text-slate-400 dark:text-slate-500" />
                      <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        <span className="font-semibold text-blue-600 dark:text-blue-400">Ajouter des images</span>
                      </div>
                    </div>
                  </div>
                  {galleryFiles.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {galleryFiles.map((file, idx) => (
                        <div key={idx} className="relative bg-slate-100 dark:bg-slate-800 p-2 rounded-lg text-xs flex items-center gap-2">
                          <span className="truncate max-w-[100px]">{file.name}</span>
                          <button type="button" onClick={() => removeGalleryFile(idx)} className="text-red-500 hover:text-red-700"><X className="h-3 w-3" /></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">URLs des images (Séparées par des virgules)</label>
                  <input
                    type="text"
                    value={imageUrls}
                    onChange={(e) => setImageUrls(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-600 focus:ring-blue-600 p-2.5 text-sm outline-none"
                    placeholder="https://img1.jpg, https://img2.jpg..."
                  />
                </div>
              </div>
            )}
          </form>
        </div>

        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            Annuler
          </button>
          <button
            form="feed-form"
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-xl font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-70 flex items-center gap-2 shadow-sm"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            Publier l'annonce
          </button>
        </div>
      </div>
    </div>
  )
}
