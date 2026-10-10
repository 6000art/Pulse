export type RelationshipIntent = 'love' | 'friends' | 'gaming' | 'activities' | 'everything';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName?: string;
  age: number;
  gender: string;
  pronouns?: string;
  avatar: string;
  coverImage?: string;
  role: 'user' | 'admin' | 'moderator';
  isVerified: boolean;
  intent: RelationshipIntent;
  bio: string;
  interests: string[];
  gamingFavorites: string[];
  musicFavorites: string[];
  activityPreferences: string[];
  location: string;
  distanceKm?: number;
  lookingFor: string;
  online: boolean;
  lastActive: string;
  onboardingComplete: boolean;
  aiCompatibilityNote?: string;
  compatibilityScore?: number;
  compatibilityBreakdown?: {
    emotional: number;
    gaming: number;
    lifestyle: number;
  };
  privacy: {
    incognito: boolean;
    showDistance: boolean;
    showAge: boolean;
    allowDirectMessages: boolean;
  };
}

export interface Post {
  id: string;
  userId: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    age: number;
    intent: RelationshipIntent;
    isVerified: boolean;
  };
  content: string;
  mediaType?: 'image' | 'video' | 'gaming_challenge' | 'activity_invite';
  mediaUrl?: string;
  category: 'for_you' | 'love' | 'friends' | 'gaming' | 'activities' | 'live';
  likesCount: number;
  sparksCount: number;
  commentsCount: number;
  userReacted?: 'like' | 'spark' | 'fire' | null;
  createdAt: string;
  challengeData?: {
    gameId: string;
    gameTitle: string;
    gameCategory: string;
  };
  activityData?: {
    activityId: string;
    title: string;
    date: string;
    location: string;
  };
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
}

export interface Match {
  id: string;
  userId: string;
  targetUserId: string;
  targetProfile: User;
  compatibilityScore: number;
  compatibilityReason: string;
  sharedInterests: string[];
  sharedGames: string[];
  status: 'pending' | 'matched' | 'passed';
  createdAt: string;
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  type: 'text' | 'game_invite' | 'activity_invite' | 'image';
  metadata?: {
    gameId?: string;
    gameTitle?: string;
    roomId?: string;
    activityId?: string;
    activityTitle?: string;
  };
  read: boolean;
  createdAt: string;
}

export interface Game {
  id: string;
  title: string;
  category: 'quiz' | 'social' | 'cards';
  description: string;
  iconName: string;
  coverImage: string;
  minPlayers: number;
  maxPlayers: number;
  durationMinutes: number;
  accentColor: string;
  badge: string;
}

export interface GameRoom {
  id: string;
  gameId: string;
  gameTitle: string;
  code: string;
  hostId: string;
  hostName: string;
  hostAvatar: string;
  isPrivate: boolean;
  status: 'waiting' | 'in_progress' | 'completed';
  currentQuestionIndex: number;
  players: {
    userId: string;
    name: string;
    avatar: string;
    score: number;
    isReady: boolean;
    answers?: Record<number, string | number>;
  }[];
  maxPlayers: number;
  createdAt: string;
}

export interface Activity {
  id: string;
  title: string;
  category: 'cooking' | 'music' | 'fitness' | 'art' | 'gaming' | 'social' | 'travel';
  description: string;
  coverImage: string;
  date: string;
  time: string;
  isOnline: boolean;
  location: string;
  capacity: number;
  bookedCount: number;
  organizer: {
    name: string;
    avatar: string;
    role: string;
  };
  attendees: {
    userId: string;
    name: string;
    avatar: string;
  }[];
}

export interface ModerationReport {
  id: string;
  reporterId: string;
  reporterName: string;
  targetType: 'user' | 'post' | 'message';
  targetId: string;
  targetDetails: string;
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
  moderatorNotes?: string;
}

export interface AdminStats {
  totalUsers: number;
  activeToday: number;
  mutualMatches: number;
  gamesPlayedTotal: number;
  activitiesBooked: number;
  retentionRate: number;
  reportsPending: number;
  recentActivity: {
    id: string;
    type: 'match' | 'game' | 'signup' | 'report';
    description: string;
    timestamp: string;
  }[];
}

export interface OnboardingData {
  intent: RelationshipIntent;
  age: number;
  gender: string;
  pronouns: string;
  lookingFor: string;
  interests: string[];
  musicFavorites: string[];
  gamingPreferences: string[];
  activityPreferences: string[];
  communicationStyle: string;
  location: string;
  bio?: string;
}
