export type RoleType = 'student' | 'professional' | 'institution'
export type Role = 'USER' | 'ADMIN' | 'SUPERADMIN' | 'SUPER_ADMIN' | string

export interface UserExperience {
  id: number
  title: string
  company: string
  startDate: string
  endDate: string
  description: string
  user_id?: string
}

export interface UserEducation {
  id: number
  school: string
  degree: string
  startDate: string
  endDate: string
  description: string
  user_id?: string
}

export interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  role?: Role
  roleType?: RoleType
  avatarUrl?: string
  coverUrl?: string
  status?: string
  about?: string
  company?: string
  educationLevel?: string
  studyDomain?: string
  jobTitle?: string
  workDomain?: string
  institutionType?: string
  institutionDetails?: string
  nineaUploaded?: boolean
  points?: number
  reportsCount?: number
  isPremium?: boolean
  kycDocumentUrl?: string
  premiumReceiptUrl?: string
  premiumPaymentMethod?: string
  premiumAmount?: string
  skills?: string[]
  location?: string
  linkedin?: string
  settings?: string
  lastActive?: string
  createdAt?: string
  experiences?: UserExperience[]
  educations?: UserEducation[]
}

export interface RegisterPayload {
  email: string
  firstName: string
  lastName: string
  phone: string
  roleType: RoleType
  password: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
  refresh_token: string
  token_type: string
  user: User
}

export interface RefreshResponse {
  access_token: string
  token_type: string
}

export interface ToggleLikeResponse {
  liked: boolean
  likesCount: number
}

export interface NetworkRelationship {
  id: string
  status?: string
  type?: string
  message?: string
  user?: User
  fromUser?: User
  toUser?: User
  requester?: User
  requestedTo?: User
}

export interface OutgoingRequest {
  id: string
  requesterId: string
  addresseeId: string
  status: string
  type: string
  createdAt: string
  addresseeDetails: User
}

export interface IncomingRequest {
  id: string
  requesterId: string
  addresseeId: string
  status: string
  type: string
  createdAt: string
  requesterDetails: User
}

export interface AcceptedConnection {
  id: string
  requesterId: string
  addresseeId: string
  status: string
  type: string
  createdAt: string
  targetUser: User
}

export interface FeedComment {
  id: string
  authorDetails: {
    firstName: string
    lastName: string
    avatarUrl: string
  }
  content: string
  createdAt: string
}

export interface FeedPost {
  id: string
  authorDetails: {
    firstName: string
    lastName: string
    avatarUrl: string
    role?: string
  }
  title: string
  content: string
  attachments?: any[] | boolean | null
  mediaType?: string
  mediaUrl?: string
  imageUrls?: string
  galleryUrls?: string
  videoUrl?: string
  likesCount: number
  commentsCount: number
  viewCount?: number
  createdAt: string
}

export interface Document {
  id: string
  title: string
  description: string
  category: string
  tags: string[]
  price: number
  pagesCount: number
  downloadsCount: number
  authorDetails: {
    name: string
  } | null
  language: string
  rating: number
  publicationYear: number
  format: string
  status: string
  publisher: string
  tableOfContents: string[] | null
  createdAt: string
  authorId: string
  edition: string
  fileUrl: string
  referenceKey: string
  previewUrl?: string | null
  imageUrl?: string | null
  associatedCourse: string
  isPremium: boolean
}

export interface Opportunity {
  id: string
  type: string
  title: string
  organization: string
  fundingSource: string
  targetAudience: string
  attachments: any[] | null
  location: string | null
  amount: string
  duration: string | null
  description: string
  missions: string | null
  benefits: string | null
  fundingDetails: string | null
  eligibilityRequirements: {
    text: string
  } | null
  selectionCriteria: {
    text: string
  } | null
  applicationProcess: {
    text: string
  } | null
  importantDates: any[] | null
  contactPerson: {
    name: string
    email: string
  }
  requiredDocuments: any[] | null
  requirements: any[] | null
  domain: string | null
  category: string | null
  tags: any[] | null
  deadline: string | null
  contactInfo: string
  applyUrl: string | null
  authorId: string
  imageUrl?: string | null
  bannerUrl?: string | null
  isPremiumOnly: boolean
  isBoosted: boolean
  isActive: boolean
  createdAt: string
  aiMatchScore: number | null
}

// Chat Types
export interface ChatParticipant {
  id: string
  firstName: string
  lastName: string
  avatarUrl: string
  roleType?: RoleType
}

export interface ChatConversation {
  id: string
  participants: string[]
  lastMessageAt: string | null
  lastMessageText: string | null
  unreadCount: Record<string, number>
  otherParticipants: ChatParticipant[]
  myUnreadCount: number
}

export interface ChatMessage {
  id?: string
  content?: string | null
  message?: string | null
  text?: string | null
  body?: string | null
  messageText?: string | null
  senderDetails: ChatParticipant
  createdAt?: string
}

export interface SendMessagePayload {
  content: string
  recipientId: string
}

export interface SendMessageResponse {
  message: {
    senderDetails: ChatParticipant
  }
  conversation: {
    otherParticipants: ChatParticipant[]
  }
}

export interface ConversationMessagesResponse {
  conversation: ChatConversation
  messages: ChatMessage[]
}
