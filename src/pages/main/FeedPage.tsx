import { Card } from "../../components/ui/Card"
import { Link } from "react-router-dom"
import { Button } from "../../components/ui/Button"
import { FileText, Image as ImageIcon, ThumbsUp, MessageSquare, Share2, ShieldCheck, Check, Briefcase, ExternalLink, X, Video } from "lucide-react"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useAuth } from "../../contexts/AuthContext"
import { getFeedPosts, getFeedComments, postFeedComment, toggleLikePost, repostFeed } from "../../services/feed"
import type { FeedComment, FeedPost } from "../../types/api"
import ReactPlayer from "react-player"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import "katex/dist/katex.min.css"

const ExpandableText = ({ content }: { content: string }) => {
  const [expanded, setExpanded] = useState(false);
  const MAX_LENGTH = 150;

  if (!content) return null;

  const isLong = content.length > MAX_LENGTH;

  return (
    <div className="mt-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
      <div className={!expanded && isLong ? "line-clamp-4" : ""}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex]}
          components={{
            a: ({ node, ...props }) => <a className="text-blue-600 dark:text-blue-400 hover:underline break-words" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} {...props} />,
            p: ({ node, ...props }) => <p className="mb-2 last:mb-0 whitespace-pre-wrap break-words" {...props} />,
            strong: ({ node, ...props }) => <strong className="font-bold text-slate-900 dark:text-slate-100" {...props} />,
            em: ({ node, ...props }) => <em className="italic" {...props} />,
            ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-2" {...props} />,
            ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-2" {...props} />,
            blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-slate-300 dark:border-slate-600 pl-3 italic my-2" {...props} />,
            h1: ({ node, ...props }) => <h1 className="text-lg font-bold text-slate-900 dark:text-white mt-4 mb-2" {...props} />,
            h2: ({ node, ...props }) => <h2 className="text-base font-bold text-slate-900 dark:text-white mt-3 mb-2" {...props} />,
            h3: ({ node, ...props }) => <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-2 mb-1" {...props} />,
            code: ({ node, className, children, ...props }) => {
              const match = /language-(\w+)/.exec(className || '')
              return !match ? (
                <code className="bg-slate-100 dark:bg-slate-800 rounded px-1.5 py-0.5 text-blue-600 dark:text-blue-400 text-xs font-mono" {...props}>
                  {children}
                </code>
              ) : (
                <pre className="bg-slate-900 text-slate-50 rounded-lg p-3 overflow-x-auto text-xs my-2 font-mono">
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
              )
            }
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
      {isLong && (
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setExpanded(!expanded); }}
          className="mt-1 text-blue-600 dark:text-blue-400 font-semibold hover:underline inline-block"
        >
          {expanded ? "Voir moins" : "Voir plus"}
        </button>
      )}
    </div>
  );
};
export function FeedPage() {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false)
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>([])
  const [loadingFeed, setLoadingFeed] = useState(true)
  const [feedError, setFeedError] = useState<string | null>(null)
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({})
  const [openComments, setOpenComments] = useState<Record<string, boolean>>({})
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({})
  const [commentsByPost, setCommentsByPost] = useState<Record<string, FeedComment[]>>({})
  const [commentsLoading, setCommentsLoading] = useState<Record<string, boolean>>({})
  const [commentsError, setCommentsError] = useState<Record<string, string>>({})
  const { t } = useTranslation()
  const { user } = useAuth()

  const profileName = user ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.email : 'Utilisateur'
  const profileAvatar = user?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileName)}&background=cbd5e1&color=64748b`

  useEffect(() => {
    async function loadFeed() {
      setLoadingFeed(true)
      setFeedError(null)
      try {
        const posts = await getFeedPosts()
        setFeedPosts(posts)
        
        // Initialiser l'état des likes à partir du serveur
        const initialLikes: Record<string, boolean> = {}
        posts.forEach(post => {
          initialLikes[post.id] = (post as any).liked ?? false
        })
        setLikedPosts(initialLikes)
      } catch (error) {
        setFeedError(error instanceof Error ? error.message : 'Impossible de récupérer le fil.')
      } finally {
        setLoadingFeed(false)
      }
    }

    loadFeed()
  }, [])

  const handleLike = async (postId: string) => {
    try {
      const response = await toggleLikePost(postId)
      setFeedPosts((current) => current.map((post) => post.id === postId ? { ...post, likesCount: response.likesCount } : post))
      setLikedPosts((current) => ({ ...current, [postId]: response.liked }))
    } catch (error) {
      console.error('Impossible de liker le post.', error)
    }
  }

  const loadComments = async (postId: string) => {
    setCommentsLoading((current) => ({ ...current, [postId]: true }))
    setCommentsError((current) => ({ ...current, [postId]: '' }))
    try {
      const comments = await getFeedComments(postId)
      setCommentsByPost((current) => ({ ...current, [postId]: comments }))
    } catch (error) {
      setCommentsError((current) => ({
        ...current,
        [postId]: error instanceof Error ? error.message : 'Impossible de charger les commentaires.',
      }))
    } finally {
      setCommentsLoading((current) => ({ ...current, [postId]: false }))
    }
  }

  const handleToggleComments = async (postId: string) => {
    const willOpen = !openComments[postId]
    setOpenComments((current) => ({ ...current, [postId]: willOpen }))

    if (willOpen && !commentsByPost[postId]) {
      await loadComments(postId)
    }
  }

  const handleCommentChange = (postId: string, content: string) => {
    setCommentDrafts((current) => ({ ...current, [postId]: content }))
  }

  const handleSubmitComment = async (postId: string) => {
    const content = commentDrafts[postId]?.trim()
    if (!content) {
      return
    }

    setCommentsLoading((current) => ({ ...current, [postId]: true }))
    setCommentsError((current) => ({ ...current, [postId]: '' }))

    try {
      const newComment = await postFeedComment(postId, content)
      setOpenComments((current) => ({ ...current, [postId]: true }))
      setCommentsByPost((current) => ({
        ...current,
        [postId]: [newComment, ...(current[postId] ?? [])],
      }))
      setCommentDrafts((current) => ({ ...current, [postId]: '' }))
      setFeedPosts((current) => current.map((post) =>
        post.id === postId ? { ...post, commentsCount: post.commentsCount + 1 } : post
      ))
    } catch (error) {
      setCommentsError((current) => ({
        ...current,
        [postId]: error instanceof Error ? error.message : 'Impossible de publier le commentaire.',
      }))
    } finally {
      setCommentsLoading((current) => ({ ...current, [postId]: false }))
    }
  }

  const handleRepost = async (postId: string) => {
    try {
      await repostFeed(postId)
    } catch (error) {
      console.error('Impossible de repartager le post.', error)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Create Post Trigger */}
      <Card className="p-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <div className="flex gap-4">
          <Link to="/profile" className="shrink-0 h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:opacity-80 transition-opacity overflow-hidden">
            <img src={profileAvatar} className="w-full h-full object-cover" alt="Me" />
          </Link>
          <button onClick={() => setIsCreatePostOpen(true)} className="flex-1 rounded-full border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-4 text-left text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            {t('feed.create_post_placeholder')}
          </button>
        </div>
        <div className="mt-4 flex gap-2 border-t border-slate-100 dark:border-slate-800 pt-3">
          <Button onClick={() => setIsCreatePostOpen(true)} variant="ghost" size="sm" className="text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            <FileText className="mr-2 h-4 w-4 text-blue-500 dark:text-blue-400" />
            {t('feed.pdf_doc')}
          </Button>
          <Button onClick={() => setIsCreatePostOpen(true)} variant="ghost" size="sm" className="text-slate-600 dark:text-slate-300 hover:bg-green-50 dark:hover:bg-green-900/30 hover:text-green-600 dark:hover:text-green-400 transition-colors">
            <ImageIcon className="mr-2 h-4 w-4 text-green-500 dark:text-green-400" />
            {t('feed.media')}
          </Button>
        </div>
      </Card>

      {/* --- CREATE POST MODAL --- */}
      {isCreatePostOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0 bg-slate-900/60 backdrop-blur-sm transition-all animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="relative flex items-center justify-center p-4 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t('feed.create_post_title')}</h2>
              <button onClick={() => setIsCreatePostOpen(false)} className="absolute right-4 h-8 w-8 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 flex-1 overflow-y-auto">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 shrink-0 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <img src="https://ui-avatars.com/api/?name=Utilisateur&background=cbd5e1&color=64748b" className="w-full h-full object-cover" alt="Me" />
                </div>
                <div>
                  <p className="font-bold text-sm text-slate-900 dark:text-white">Utilisateur (Vous)</p>
                  <span className="text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded flex items-center gap-1 mt-0.5 w-max">{t('common.public')} <Check className="w-3 h-3" /></span>
                </div>
              </div>
              <textarea autoFocus placeholder={t('feed.create_post_placeholder')} className="w-full min-h-30 text-lg bg-transparent border-none outline-none text-slate-900 dark:text-white placeholder:text-slate-500 resize-none font-medium"></textarea>
            </div>

            {/* Attachments & Footer */}
            <div className="p-4">
              <div className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-xl mb-4 bg-slate-50 dark:bg-slate-800/50 shadow-sm">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t('feed.add_to_post')}</span>
                <div className="flex gap-1">
                  <button className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-green-500"><ImageIcon className="h-5 w-5" /></button>
                  <button className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-blue-500"><Video className="h-5 w-5" /></button>
                  <button className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-orange-500"><FileText className="h-5 w-5" /></button>
                </div>
              </div>
              <button onClick={() => setIsCreatePostOpen(false)} className="w-full font-bold text-base bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 shadow-sm transition-colors active:scale-[0.98]">
                {t('common.publish')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Offre / Annonce Admin */}
      <Card className="overflow-hidden border-2 border-indigo-100 dark:border-indigo-900/40 bg-white dark:bg-slate-900 shadow-md relative group">
        <div className="absolute top-4 right-4 bg-indigo-600 dark:bg-indigo-500 text-white text-[10px] uppercase font-bold px-2.5 py-1 rounded-full z-10 flex items-center gap-1 shadow-sm">
          <Briefcase className="w-3 h-3" /> Officiel
        </div>

        {/* En-tête de l'annonce */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 bg-indigo-50/30 dark:bg-indigo-900/10">
          <div className="h-12 w-12 shrink-0 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center border-2 border-indigo-200 dark:border-indigo-500/30 shadow-sm">
            <ShieldCheck className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1">
              L'Équipe LeRéseau
              <span className="bg-blue-500 text-white rounded-full p-0.5 shadow-sm"><Check className="h-2.5 w-2.5" /></span>
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Mise à jour Plateforme • À l'instant</p>
          </div>
        </div>

        {/* Contenu textuel */}
        <div className="p-5">
          <h3 className="font-bold text-xl text-slate-900 dark:text-slate-50 mb-2 leading-tight">🚀 Lancement du nouveau portail Bourses & Bibliothèque</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Poussés par notre volonté d'excellence, nous débloquons aujourd'hui de **nouveaux modules CMS publics**. Retrouvez toutes les publications officielles de documents certifiés ainsi que le système d'alerte Premium dans vos onglets dédiés. N'oubliez pas de mettre à jour votre profil !
          </p>
        </div>

        {/* Image / Visuel */}
        <div className="aspect-2/1 w-full relative bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <img src="https://cloudfront-eu-central-1.images.arcpublishing.com/le360/L7NDKJFDA5HYPPC3HYG7RU5G7M.jpeg" alt="Campus Universitaire" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out" />
          <div className="absolute inset-0 bg-linear-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
          <div className="absolute bottom-4 left-5 right-5 text-white">
            <p className="font-bold text-xl line-clamp-1 drop-shadow-md">Campus International - Partenariat exclusif</p>
            <p className="text-sm opacity-90 font-medium drop-shadow-md mt-1 text-slate-200">Soutenu par le réseau des anciens</p>
          </div>
        </div>

        {/* Pied de page et Boutons */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="flex w-full sm:w-auto gap-2">
            <Button variant="ghost" size="sm" className="flex-1 sm:flex-none text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors font-medium">
              <ThumbsUp className="mr-2 h-4 w-4 text-slate-400 dark:text-slate-500 group-hover/btn:text-blue-500" /> J'aime
            </Button>
            <Button variant="ghost" size="sm" className="flex-1 sm:flex-none text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors font-medium">
              <MessageSquare className="mr-2 h-4 w-4 text-slate-400 dark:text-slate-500" /> Commenter
            </Button>
            <Button variant="ghost" size="sm" className="flex-1 sm:flex-none text-slate-600 dark:text-slate-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors font-medium">
              <Share2 className="mr-2 h-4 w-4 text-slate-400 dark:text-slate-500" /> Partager
            </Button>
          </div>

          <div className="flex w-full sm:w-auto gap-2">
            <Button variant="outline" size="sm" className="flex-1 sm:flex-none font-medium bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
              <ExternalLink className="mr-1.5 h-4 w-4 text-slate-400 dark:text-slate-500" /> Site Officiel
            </Button>
            <Button size="sm" className="flex-1 sm:flex-none font-semibold bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white shadow-sm transition-all focus:ring-2 focus:ring-indigo-500">
              <Briefcase className="mr-1.5 h-4 w-4" /> Postuler
            </Button>
          </div>
        </div>
      </Card>

      {/* Video Post */}
      <Card className="overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm mb-6 bg-white dark:bg-slate-900">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 shrink-0 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center border border-indigo-200 dark:border-indigo-800">
              <ShieldCheck className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1">LeRéseau Admin <span className="bg-blue-500 text-white rounded-full p-0.5"><Check className="h-2.5 w-2.5" /></span></p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Tutoriel Officiel • Il y a 4h</p>
            </div>
          </div>
        </div>
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <p className="text-sm text-slate-700 dark:text-slate-300">Découvrez comment optimiser votre profil pour attirer l'attention des mentors ! 🚀👇</p>
        </div>
        <div className="w-full bg-black relative">
          <video controls className="w-full max-h-125" poster="https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/5eeea355389655.59822ff824b72.gif">
            <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
            Votre navigateur ne supporte pas la lecture vidéo.
          </video>
        </div>
        <div className="flex gap-2 p-2 px-4 bg-slate-50 dark:bg-slate-800/50">
          <Button variant="ghost" size="sm" className="flex-1 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30"><ThumbsUp className="mr-2 h-4 w-4" /> J'aime</Button>
          <Button variant="ghost" size="sm" className="flex-1 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30"><MessageSquare className="mr-2 h-4 w-4" /> Commenter</Button>
          <Button variant="ghost" size="sm" className="flex-1 text-slate-600 dark:text-slate-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30"><Share2 className="mr-2 h-4 w-4" /> Partager</Button>
        </div>
      </Card>

      {/* Multi-image Scrollable Post */}
      <Card className="overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm mb-6 relative bg-white dark:bg-slate-900">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 shrink-0 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center border border-emerald-200 dark:border-emerald-800/50">
              <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1">LeRéseau Admin <span className="bg-blue-500 text-white rounded-full p-0.5"><Check className="h-2.5 w-2.5" /></span></p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Événement • Il y a 1j</p>
            </div>
          </div>
        </div>
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <p className="text-sm text-slate-700 dark:text-slate-300">Retour en images sur notre dernier forum des métiers ! Faites défiler vers le bas pour voir toutes les photos. 📸👇</p>
        </div>
        <div className="relative w-full h-125 bg-slate-900 overflow-hidden group/gallery border-b border-slate-100 dark:border-slate-800">
          <div className="w-full h-full flex overflow-x-auto snap-x snap-mandatory hide-scrollbar">
            <div className="snap-center snap-always min-w-full h-full flex items-center justify-center bg-black relative">
              <img src="https://thumbs.dreamstime.com/b/groupe-riant-joyeux-d-%C3%A9tudiants-d-afro-am%C3%A9ricain-97882886.jpg" className="object-cover h-full w-full" alt="Forum 1" />
              <div className="absolute top-4 right-4 bg-black/60 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-md">1/3</div>
            </div>
            <div className="snap-center snap-always min-w-full h-full flex items-center justify-center bg-black relative">
              <img src="https://img.freepik.com/photos-premium/etudiante-diplomee-heureuse-montrant-geste-accord_380164-288708.jpg?semt=ais_hybrid&w=740&q=80" className="object-cover h-full w-full" alt="Forum 2" />
              <div className="absolute top-4 right-4 bg-black/60 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-md">2/3</div>
            </div>
            <div className="snap-center snap-always min-w-full h-full flex items-center justify-center bg-black relative">
              <img src="https://img.freepik.com/photos-premium/vue-frontale-gratuite-etudiant-etudiante-portant-sac-dos-noir-tenant-cahiers-fichiers_1283069-4785.jpg" className="object-cover h-full w-full" alt="Forum 3" />
              <div className="absolute top-4 right-4 bg-black/60 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-md">3/3</div>
            </div>
          </div>
          {/* Floating Indicator */}
          <div className="absolute top-1/2 right-4 -translate-y-1/2 flex justify-center pointer-events-none animate-pulse">
            <div className="bg-black/40 text-white rounded-full p-2 backdrop-blur-md">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </div>
          </div>
        </div>
        <div className="flex gap-2 p-2 px-4 bg-slate-50 dark:bg-slate-800/50">
          <Button variant="ghost" size="sm" className="flex-1 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30"><ThumbsUp className="mr-2 h-4 w-4" /> J'aime</Button>
          <Button variant="ghost" size="sm" className="flex-1 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30"><MessageSquare className="mr-2 h-4 w-4" /> Commenter</Button>
          <Button variant="ghost" size="sm" className="flex-1 text-slate-600 dark:text-slate-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30"><Share2 className="mr-2 h-4 w-4" /> Partager</Button>
        </div>
      </Card>

      {/* Feed from API */}
      {loadingFeed ? (
        <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm text-slate-500 dark:text-slate-400">
          Chargement du fil d'actualité...
        </Card>
      ) : feedError ? (
        <Card className="p-6 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-700 shadow-sm text-rose-700 dark:text-rose-200">
          {feedError}
        </Card>
      ) : feedPosts.length === 0 ? (
        <Card className="p-6 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm text-slate-500 dark:text-slate-400">
          Aucun post disponible pour le moment.
        </Card>
      ) : (
        feedPosts.map((post) => {
          const liked = likedPosts[post.id] ?? false
          const authorDetails = post.authorDetails ?? { firstName: '', lastName: '', avatarUrl: '' }
          const authorName = `${authorDetails.firstName ?? ''} ${authorDetails.lastName ?? ''}`.trim() || 'Auteur'
          const createdDate = new Date(post.createdAt).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' })

          const isAdmin = post.authorDetails?.role === 'ADMIN' || post.authorDetails?.role === 'SUPER_ADMIN' || authorName.toLowerCase().includes('admin') || authorName.toLowerCase().includes("équipe") || authorName.toLowerCase().includes("equipe")

          return (
            <Card key={post.id} className={`overflow-hidden p-0 bg-white dark:bg-slate-900 shadow-sm relative group ${isAdmin ? 'border-2 border-indigo-100 dark:border-indigo-900/40' : 'border border-slate-200 dark:border-slate-800'}`}>
              {isAdmin && (
                <div className="absolute top-4 right-4 bg-indigo-600 dark:bg-indigo-500 text-white text-[10px] uppercase font-bold px-2.5 py-1 rounded-full z-10 flex items-center gap-1 shadow-sm">
                  <Briefcase className="w-3 h-3" /> Officiel
                </div>
              )}

              {isAdmin ? (
                <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 bg-indigo-50/30 dark:bg-indigo-900/10">
                  <div className="h-12 w-12 shrink-0 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center border-2 border-indigo-200 dark:border-indigo-500/30 shadow-sm">
                    <ShieldCheck className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1">
                      L'Équipe LeRéseau
                      <span className="bg-blue-500 text-white rounded-full p-0.5 shadow-sm"><Check className="h-2.5 w-2.5" /></span>
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">{post.title} • {createdDate}</p>
                  </div>
                </div>
              ) : (
                <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <Link to="/profile" className="h-10 w-10 shrink-0 rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden flex items-center justify-center hover:opacity-80 transition-opacity">
                      <img src={authorDetails.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=cbd5e1&color=64748b`} className="w-full h-full object-cover" alt={authorName} />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <p className="block text-sm font-bold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{authorName}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{createdDate}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className={`p-4 ${isAdmin ? 'pt-5' : 'pt-4'}`}>
                {isAdmin ? (
                  <h3 className="font-bold text-xl text-slate-900 dark:text-slate-50 mb-2 leading-tight">🚀 {post.title}</h3>
                ) : (
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{post.title}</h3>
                )}
                <ExpandableText content={post.content} />
              </div>

              {(() => {
                const attachmentsArray = Array.isArray(post.attachments) ? post.attachments : [];
                const images: string[] = post.imageUrls ? post.imageUrls.split(',').map(u => u.trim()).filter(Boolean) : attachmentsArray.map((a: any) => typeof a === 'string' ? a : a.url).filter((u: string) => u && !u.match(/\.(mp4|webm|ogg)$/i) && !u.includes('youtube.com') && !u.includes('youtu.be') && !u.includes('vimeo.com') && !u.includes('tiktok.com'));
                const hasImages = images.length > 0;

                const videoAttachment = attachmentsArray.find((a: any) =>
                  (a && a.type === 'video/external') ||
                  (a && a.url && (a.url.match(/\.(mp4|webm|ogg)$/i) || a.url.includes('youtube.com') || a.url.includes('youtu.be') || a.url.includes('vimeo.com') || a.url.includes('tiktok.com'))) ||
                  (typeof a === 'string' && (a.match(/\.(mp4|webm|ogg)$/i) || a.includes('youtube.com') || a.includes('youtu.be') || a.includes('vimeo.com') || a.includes('tiktok.com')))
                );

                const extractedVideoUrl = post.videoUrl || (typeof videoAttachment === 'string' ? videoAttachment : videoAttachment?.url);
                const isExternalVideo = videoAttachment?.type === 'video/external' || (extractedVideoUrl && (extractedVideoUrl.includes('youtube.com') || extractedVideoUrl.includes('youtu.be') || extractedVideoUrl.includes('vimeo.com') || extractedVideoUrl.includes('tiktok.com')));

                if (extractedVideoUrl) {
                  if (isExternalVideo) {
                    return (
                      <div className="w-full relative bg-slate-900 flex items-center justify-center overflow-hidden aspect-video">
                        <ReactPlayer
                          src={extractedVideoUrl}
                          width="100%"
                          height="100%"
                          controls={true}
                          playing={true}
                          muted={true}
                        />
                      </div>
                    );
                  } else {
                    return (
                      <div className="w-full bg-black relative">
                        <video controls autoPlay muted className="w-full max-h-125">
                          <source src={extractedVideoUrl} type="video/mp4" />
                          Votre navigateur ne supporte pas la lecture vidéo.
                        </video>
                      </div>
                    );
                  }
                } else if (hasImages && images.length === 1 && (post.mediaType === 'image' || !post.mediaType)) {
                  return (
                    <div className="w-full relative bg-slate-100 dark:bg-slate-800">
                      <img
                        src={images[0]}
                        className="w-full max-h-125 object-cover"
                        alt="Publication"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  );
                } else if (hasImages && (images.length > 1 || post.mediaType === 'gallery')) {
                  return (
                    <div className="relative w-full h-125 bg-slate-900 overflow-hidden group/gallery">
                      <div className="w-full h-full flex overflow-x-auto snap-x snap-mandatory hide-scrollbar">
                        {images.map((url: string, idx: number) => (
                          <div key={idx} className="snap-center snap-always min-w-full h-full flex items-center justify-center bg-black relative">
                            <img
                              src={url}
                              className="object-cover h-full w-full"
                              alt={`Gallery ${idx}`}
                              onError={(e) => {
                                e.currentTarget.parentElement!.style.display = 'none';
                              }}
                            />
                            <div className="absolute top-4 right-4 bg-black/60 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-md">{idx + 1}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                } else if (post.attachments === true || (Array.isArray(post.attachments) && post.attachments.length > 0)) {
                  return (
                    <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-4">
                      <p className="text-sm text-slate-600 dark:text-slate-300">Pièce jointe disponible. Cliquez pour prévisualiser.</p>
                    </div>
                  );
                }
                return null;
              })()}

              <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="text-sm text-slate-500 dark:text-slate-400">{post.likesCount} J'aime • {post.commentsCount} commentaires</div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-2 ${liked ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-300'} hover:bg-slate-100 dark:hover:bg-slate-800/60`}>
                    <ThumbsUp className="h-4 w-4" /> {liked ? 'J\'aime' : 'Aimer'}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleComments(post.id)}
                    className={`flex items-center gap-2 ${openComments[post.id] ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-300'} hover:bg-slate-100 dark:hover:bg-slate-800/60`}
                  >
                    <MessageSquare className="h-4 w-4" /> Commenter
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRepost(post.id)}
                    className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                  >
                    <Share2 className="h-4 w-4" /> Repartager
                  </Button>
                </div>
              </div>

              {openComments[post.id] ? (
                <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 p-4 space-y-4">
                  <div className="space-y-3">
                    <textarea
                      value={commentDrafts[post.id] ?? ''}
                      onChange={(event) => handleCommentChange(post.id, event.target.value)}
                      placeholder="Écrire un commentaire..."
                      className="w-full min-h-23 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-500/30 outline-none p-3 resize-none"
                    />
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <span className="text-xs text-slate-500 dark:text-slate-400">{commentsByPost[post.id]?.length ?? 0} commentaire(s)</span>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleSubmitComment(post.id)}
                        disabled={!commentDrafts[post.id]?.trim() || commentsLoading[post.id]}
                        className="font-semibold"
                      >
                        {commentsLoading[post.id] ? 'Envoi...' : 'Envoyer'}
                      </Button>
                    </div>
                    {commentsError[post.id] ? (
                      <p className="text-sm text-rose-600 dark:text-rose-400">{commentsError[post.id]}</p>
                    ) : null}
                  </div>

                  {commentsLoading[post.id] ? (
                    <p className="text-sm text-slate-500 dark:text-slate-400">Chargement des commentaires...</p>
                  ) : commentsByPost[post.id]?.length ? (
                    <div className="space-y-3">
                      {commentsByPost[post.id].map((comment) => {
                        const commentAuthorDetails = comment.authorDetails ?? { firstName: '', lastName: '', avatarUrl: '' }
                        const commentAuthor = `${commentAuthorDetails.firstName ?? ''} ${commentAuthorDetails.lastName ?? ''}`.trim() || 'Utilisateur'
                        return (
                          <div key={comment.id} className="rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4">
                            <div className="flex items-start gap-3">
                              <div className="h-9 w-9 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800">
                                <img
                                  src={commentAuthorDetails.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(commentAuthor)}&background=cbd5e1&color=64748b`}
                                  alt={commentAuthor}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between gap-3">
                                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{commentAuthor}</p>
                                  <span className="text-xs text-slate-500 dark:text-slate-400">
                                    {new Date(comment.createdAt).toLocaleString('fr-FR', {
                                      dateStyle: 'short',
                                      timeStyle: 'short',
                                    })}
                                  </span>
                                </div>
                                <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{comment.content}</p>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 dark:text-slate-400">Aucun commentaire pour le moment. Soyez le premier !</p>
                  )}
                </div>
              ) : null}
            </Card>
          )
        })
      )}

    </div>
  )
}
