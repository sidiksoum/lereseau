import { apiRequest } from './api'
import type { FeedComment, FeedPost, ToggleLikeResponse } from '../types/api'

export async function getFeedPosts(): Promise<FeedPost[]> {
  return apiRequest('/api/feed/', {
    method: 'GET',
    auth: true,
  })
}

export async function getFeedComments(postId: string): Promise<FeedComment[]> {
  const response = await apiRequest(`/api/feed/${postId}/comments`, {
    method: 'GET',
    auth: true,
  })

  if (Array.isArray(response)) {
    return response
  }

  if (response && typeof response === 'object') {
    if (Array.isArray((response as any).comments)) {
      return (response as any).comments
    }
    if (Array.isArray((response as any).data)) {
      return (response as any).data
    }
  }

  return []
}

export async function postFeedComment(postId: string, content: string): Promise<FeedComment> {
  const response = await apiRequest(`/api/feed/${postId}/comments`, {
    method: 'POST',
    auth: true,
    body: { content },
  })

  if (response && typeof response === 'object') {
    if ((response as any).comment) {
      return (response as any).comment
    }
    if ((response as any).data) {
      return (response as any).data
    }
  }

  return response as FeedComment
}

export async function toggleLikePost(postId: string): Promise<ToggleLikeResponse> {
  return apiRequest(`/api/feed/${postId}/like`, {
    method: 'POST',
    auth: true,
  })
}

export async function repostFeed(postId: string): Promise<unknown> {
  return apiRequest(`/api/feed/${postId}/repost`, {
    method: 'POST',
    auth: true,
  })
}
