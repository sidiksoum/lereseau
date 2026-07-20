import type { NetworkRelationship, User } from '../../types/api'

export function getDisplayName(user: User): string {
  return [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email || 'Membre'
}

export function getProfileTitle(user: User): string {
  if (user.roleType === 'student') {
    return [user.educationLevel, user.studyDomain].filter(Boolean).join(' • ') || 'Étudiant'
  }
  if (user.roleType === 'professional') {
    return [user.jobTitle, user.workDomain].filter(Boolean).join(' • ') || 'Professionnel'
  }
  if (user.roleType === 'institution') {
    return [user.institutionType, user.institutionDetails].filter(Boolean).join(' • ') || 'Institution'
  }
  return 'Membre LeRéseau'
}

export function getProfileMeta(user: User): string {
  return user.location || user.company || 'Localisation indisponible'
}

export function getConnectionUser(connection: NetworkRelationship, currentUserId?: string): User | null {
  if (connection.user) {
    return connection.user
  }

  const fromUser = connection.fromUser
  const toUser = connection.toUser

  if (fromUser && toUser) {
    if (currentUserId && fromUser.id === currentUserId) {
      return toUser
    }
    if (currentUserId && toUser.id === currentUserId) {
      return fromUser
    }
    return toUser
  }

  if (connection.requester) {
    return connection.requestedTo?.id === currentUserId ? connection.requester : connection.requestedTo ?? null
  }

  return null
}

export function getConnectionType(connection: NetworkRelationship): string {
  if (connection.type) {
    return connection.type.toLowerCase()
  }

  if (connection.status) {
    return connection.status.toLowerCase()
  }

  return ''
}

export function getConnectionRequestType(user: User): 'FRIEND' | 'MENTORSHIP' | 'FOLLOWING' {
  if (user.roleType === 'professional') {
    return 'MENTORSHIP'
  }

  if (user.roleType === 'institution') {
    return 'FOLLOWING'
  }

  return 'FRIEND'
}

export function isReceivedRequest(connection: NetworkRelationship, currentUserId?: string): boolean {
  if (!currentUserId) return false

  const isPending = connection.status?.toLowerCase() === 'pending'
  if (!isPending) return false

  // Vérifier si currentUser est le destinataire
  if (connection.toUser?.id === currentUserId) {
    return true
  }

  // Si requester existe, vérifier si requestedTo est currentUser
  if (connection.requester && connection.requester.id !== currentUserId) {
    return true
  }

  return false
}

export function isSentRequest(connection: NetworkRelationship, currentUserId?: string): boolean {
  if (!currentUserId) return false

  const isPending = connection.status?.toLowerCase() === 'pending'
  if (!isPending) return false

  // Vérifier si currentUser est l'expéditeur
  if (connection.fromUser?.id === currentUserId) {
    return true
  }

  // Si requester existe et c'est currentUser
  if (connection.requester?.id === currentUserId) {
    return true
  }

  return false
}
