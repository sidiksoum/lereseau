export type TopicStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface ForumChannel {
  id: string
  name: string
  slug: string
  description: string
  createdAt?: string
}

export interface ForumTopic {
  id: string
  channelId: string
  title: string
  content: string
  status: TopicStatus
  authorId: string
  authorDetails?: {
    firstName: string
    lastName: string
    avatarUrl: string | null
  }
  viewsCount: number
  likesCount: number
  repliesCount: number
  reportsCount: number
  createdAt: string
}

export interface ForumReply {
  id: string
  topicId: string
  parentId: string | null
  content: string
  authorId: string
  authorDetails?: {
    firstName: string
    lastName: string
    avatarUrl: string | null
  }
  likesCount: number
  createdAt: string
}

export interface ReportedReply {
  id: string
  topicId: string
  authorId: string
  content: string
  reportsCount: number
  parentId: string | null
  likesCount: number
  createdAt: string
}

export interface CreateChannelPayload {
  name: string
  slug: string
  description: string
}

export interface CreateTopicPayload {
  title: string
  content: string
}

export interface CreateReplyPayload {
  content: string
}

export interface ChannelMembership {
  userId: string
  channelId: string
  joinedAt: string
  userDetails?: {
    firstName: string
    lastName: string
    avatarUrl: string | null
  }
}

export interface JoinChannelResponse {
  joined: boolean
}
