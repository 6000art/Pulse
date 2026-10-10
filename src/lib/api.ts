import {
  User,
  Post,
  Comment,
  Match,
  Conversation,
  Message,
  Game,
  GameRoom,
  Activity,
  ModerationReport,
  AdminStats,
} from '../types/index.ts';

const API_BASE = '/api';

export async function fetchCurrentUser(): Promise<User> {
  const res = await fetch(`${API_BASE}/auth/me`);
  const data = await res.json();
  return data.user;
}

export async function loginUser(email?: string, asAdmin?: boolean): Promise<User> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, asAdmin }),
  });
  const data = await res.json();
  return data.user;
}

export async function registerUser(payload: Partial<User>): Promise<User> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  return data.user;
}

export async function switchRole(role: 'user' | 'admin'): Promise<User> {
  const res = await fetch(`${API_BASE}/auth/switch-role`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role }),
  });
  const data = await res.json();
  return data.user;
}

export async function fetchProfiles(intent?: string, search?: string): Promise<User[]> {
  const params = new URLSearchParams();
  if (intent) params.append('intent', intent);
  if (search) params.append('search', search);
  const res = await fetch(`${API_BASE}/profiles?${params.toString()}`);
  const data = await res.json();
  return data.profiles;
}

export async function updateProfile(payload: Partial<User>): Promise<User> {
  const res = await fetch(`${API_BASE}/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  return data.profile;
}

export async function likeProfile(targetUserId: string): Promise<any> {
  const res = await fetch(`${API_BASE}/profiles/${targetUserId}/like`, { method: 'POST' });
  return await res.json();
}

export async function passProfile(targetUserId: string): Promise<any> {
  const res = await fetch(`${API_BASE}/profiles/${targetUserId}/pass`, { method: 'POST' });
  return await res.json();
}

export async function getChemistryAnalysis(targetUserId: string): Promise<any> {
  const res = await fetch(`${API_BASE}/profiles/${targetUserId}/chemistry`, { method: 'POST' });
  const data = await res.json();
  return data.analysis;
}

export async function fetchMatches(): Promise<Match[]> {
  const res = await fetch(`${API_BASE}/matches`);
  const data = await res.json();
  return data.matches;
}

export async function fetchPosts(category?: string): Promise<Post[]> {
  const url = category && category !== 'for_you' ? `${API_BASE}/posts?category=${category}` : `${API_BASE}/posts`;
  const res = await fetch(url);
  const data = await res.json();
  return data.posts;
}

export async function createPost(payload: Partial<Post>): Promise<Post> {
  const res = await fetch(`${API_BASE}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  return data.post;
}

export async function reactToPost(postId: string, type: 'like' | 'spark' | 'fire'): Promise<Post> {
  const res = await fetch(`${API_BASE}/posts/${postId}/react`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type }),
  });
  const data = await res.json();
  return data.post;
}

export async function fetchComments(postId: string): Promise<Comment[]> {
  const res = await fetch(`${API_BASE}/posts/${postId}/comments`);
  const data = await res.json();
  return data.comments;
}

export async function addComment(postId: string, content: string): Promise<Comment> {
  const res = await fetch(`${API_BASE}/posts/${postId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
  const data = await res.json();
  return data.comment;
}

export async function fetchGames(): Promise<Game[]> {
  const res = await fetch(`${API_BASE}/games`);
  const data = await res.json();
  return data.games;
}

export async function fetchGameRooms(gameId?: string): Promise<GameRoom[]> {
  const url = gameId ? `${API_BASE}/rooms?gameId=${gameId}` : `${API_BASE}/rooms`;
  const res = await fetch(url);
  const data = await res.json();
  return data.rooms;
}

export async function createGameRoom(gameId: string, isPrivate?: boolean): Promise<GameRoom> {
  const res = await fetch(`${API_BASE}/rooms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ gameId, isPrivate }),
  });
  const data = await res.json();
  return data.room;
}

export async function joinGameRoom(roomId: string): Promise<GameRoom> {
  const res = await fetch(`${API_BASE}/rooms/${roomId}/join`, { method: 'POST' });
  const data = await res.json();
  return data.room;
}

export async function sendGameAction(roomId: string, payload: any): Promise<GameRoom> {
  const res = await fetch(`${API_BASE}/rooms/${roomId}/action`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  return data.room;
}

export async function fetchActivities(): Promise<Activity[]> {
  const res = await fetch(`${API_BASE}/activities`);
  const data = await res.json();
  return data.activities;
}

export async function bookActivity(activityId: string): Promise<Activity> {
  const res = await fetch(`${API_BASE}/activities/${activityId}/book`, { method: 'POST' });
  const data = await res.json();
  return data.activity;
}

export async function createActivity(payload: Partial<Activity>): Promise<Activity> {
  const res = await fetch(`${API_BASE}/activities`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  return data.activity;
}

export async function fetchConversations(): Promise<Conversation[]> {
  const res = await fetch(`${API_BASE}/conversations`);
  const data = await res.json();
  return data.conversations;
}

export async function fetchMessages(conversationId: string): Promise<Message[]> {
  const res = await fetch(`${API_BASE}/conversations/${conversationId}/messages`);
  const data = await res.json();
  return data.messages;
}

export async function sendMessage(conversationId: string, payload: Partial<Message>): Promise<Message> {
  const res = await fetch(`${API_BASE}/conversations/${conversationId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  return data.message;
}

export async function startConversation(targetUserId: string): Promise<Conversation> {
  const res = await fetch(`${API_BASE}/conversations/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ targetUserId }),
  });
  const data = await res.json();
  return data.conversation;
}

// AI Onboarding & Profile
export async function getAIOnboardingReply(history: { role: string; content: string }[], currentStep: number) {
  const res = await fetch(`${API_BASE}/ai/onboarding-chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ history, currentStep }),
  });
  return await res.json();
}

export async function generateAIProfile(onboardingData: any) {
  const res = await fetch(`${API_BASE}/ai/generate-profile`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ onboardingData }),
  });
  const data = await res.json();
  return data.profile;
}

// Admin
export async function fetchAdminStats(): Promise<AdminStats> {
  const res = await fetch(`${API_BASE}/admin/stats`);
  const data = await res.json();
  return data.stats;
}

export async function fetchAdminReports(): Promise<ModerationReport[]> {
  const res = await fetch(`${API_BASE}/admin/reports`);
  const data = await res.json();
  return data.reports;
}

export async function actOnReport(reportId: string, action: 'resolve' | 'dismiss', notes?: string) {
  const res = await fetch(`${API_BASE}/admin/reports/${reportId}/action`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, notes }),
  });
  return await res.json();
}

export async function fetchAdminUsers(): Promise<User[]> {
  const res = await fetch(`${API_BASE}/admin/users`);
  const data = await res.json();
  return data.users;
}

export async function toggleVerifyUser(userId: string): Promise<User> {
  const res = await fetch(`${API_BASE}/admin/users/${userId}/toggle-verify`, { method: 'POST' });
  const data = await res.json();
  return data.user;
}
