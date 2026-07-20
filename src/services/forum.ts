import type {
  ForumChannel,
  ForumTopic,
  ForumReply,
  CreateChannelPayload,
  CreateTopicPayload,
  CreateReplyPayload,
  ChannelMembership,
  JoinChannelResponse,
  ReportedReply
} from '../types/forum'
import { apiRequest } from './api'

// Admin endpoints
export async function getAdminChannels(): Promise<ForumChannel[]> {
  return apiRequest<ForumChannel[]>('/api/admin/forum/channels', {
    method: 'GET',
    auth: true,
  })
}

export async function createChannel(payload: CreateChannelPayload): Promise<ForumChannel> {
  return apiRequest<ForumChannel>('/api/admin/forum/channels', {
    method: 'POST',
    auth: true,
    body: payload,
  })
}

export async function updateChannel(channelId: string, payload: CreateChannelPayload): Promise<ForumChannel> {
  return apiRequest<ForumChannel>(`/api/admin/forum/channels/${channelId}`, {
    method: 'PUT',
    auth: true,
    body: payload,
  })
}

export async function deleteChannel(channelId: string): Promise<void> {
  return apiRequest<void>(`/api/admin/forum/channels/${channelId}`, {
    method: 'DELETE',
    auth: true,
  })
}

export async function getReportedTopics(): Promise<ForumTopic[]> {
  return apiRequest<ForumTopic[]>('/api/admin/forum/topics/reported', {
    method: 'GET',
    auth: true,
  })
}

export async function deleteTopic(topicId: string): Promise<void> {
  return apiRequest<void>(`/api/admin/forum/topics/${topicId}`, {
    method: 'DELETE',
    auth: true,
  })
}

export async function authorizeTopic(topicId: string): Promise<void> {
  return apiRequest<void>(`/api/admin/forum/topics/${topicId}/authorize`, {
    method: 'PATCH',
    auth: true,
  })
}

export async function getPendingTopics(): Promise<ForumTopic[]> {
  return apiRequest<ForumTopic[]>('/api/admin/forum/topics', {
    method: 'GET',
    auth: true,
  })
}

export async function getReportedReplies(): Promise<ReportedReply[]> {
  return apiRequest<ReportedReply[]>('/api/admin/forum/replies/reported', {
    method: 'GET',
    auth: true,
  })
}

export async function deleteReply(replyId: string): Promise<void> {
  return apiRequest<void>(`/api/admin/forum/replies/${replyId}`, {
    method: 'DELETE',
    auth: true,
  })
}

export async function ignoreReport(replyId: string): Promise<void> {
  return apiRequest<void>(`/api/admin/forum/replies/${replyId}/ignore-report`, {
    method: 'PATCH',
    auth: true,
  })
}

// User endpoints
export async function getChannels(): Promise<ForumChannel[]> {
  return apiRequest<ForumChannel[]>('/api/forum/channels', {
    method: 'GET',
    auth: true,
  })
}

export async function joinChannel(channelId: string): Promise<JoinChannelResponse> {
  return apiRequest<JoinChannelResponse>(`/api/forum/channels/${channelId}/join`, {
    method: 'POST',
    auth: true,
  })
}

export async function getChannelMembers(channelId: string): Promise<ChannelMembership[]> {
  return apiRequest<ChannelMembership[]>(`/api/forum/channels/${channelId}/memberships`, {
    method: 'GET',
    auth: true,
  })
}

export async function getChannelTopics(channelId: string): Promise<ForumTopic[]> {
  return apiRequest<ForumTopic[]>(`/api/forum/channels/${channelId}/topics`, {
    method: 'GET',
    auth: true,
  })
}

export async function createTopic(channelId: string, payload: CreateTopicPayload): Promise<ForumTopic> {
  return apiRequest<ForumTopic>(`/api/forum/channels/${channelId}/topics`, {
    method: 'POST',
    auth: true,
    body: payload,
  })
}

export async function getTopicReplies(topicId: string): Promise<ForumReply[]> {
  return apiRequest<ForumReply[]>(`/api/forum/topics/${topicId}/replies`, {
    method: 'GET',
    auth: true,
  })
}

export async function createReply(topicId: string, payload: CreateReplyPayload): Promise<ForumReply> {
  return apiRequest<ForumReply>(`/api/forum/topics/${topicId}/replies`, {
    method: 'POST',
    auth: true,
    body: payload,
  })
}

export async function likeReply(replyId: string): Promise<void> {
  return apiRequest<void>(`/api/forum/replies/${replyId}/like`, {
    method: 'POST',
    auth: true,
  })
}

export async function reportReply(replyId: string): Promise<void> {
  return apiRequest<void>(`/api/forum/replies/${replyId}/report`, {
    method: 'POST',
    auth: true,
  })
}

export async function incrementTopicViews(topicId: string): Promise<void> {
  return apiRequest<void>(`/api/forum/topics/${topicId}/view`, {
    method: 'POST',
    auth: true,
  })
}

export async function getTopicById(topicId: string): Promise<ForumTopic> {
  return apiRequest<ForumTopic>(`/api/forum/topics/${topicId}`, {
    method: 'GET',
    auth: true,
  })
}

export async function createNestedReply(replyId: string, payload: CreateReplyPayload): Promise<ForumReply> {
  return apiRequest<ForumReply>(`/api/forum/replies/${replyId}/replies`, {
    method: 'POST',
    auth: true,
    body: payload,
  })
}
