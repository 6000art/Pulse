import { Router } from 'express';
import {
  users,
  posts,
  comments,
  matches,
  conversations,
  messages,
  games,
  gameRooms,
  activities,
  moderationReports,
  adminStats,
} from './db.ts';
import {
  generateOnboardingReply,
  generateSynthesizedProfile,
  generateChemistryAnalysis,
} from './ai.ts';
import {
  generateDynamicAvatar,
  generateDynamicBanner,
} from '../src/lib/avatarGenerator.ts';

const router = Router();

// Utilisateur actif de la session (Alex par défaut)
let currentUserId = 'user-current';

// ----------------- ROUTES AUTH -----------------
router.get('/auth/me', (req, res) => {
  const user = users.find(u => u.id === currentUserId) || users[0];
  res.json({ user });
});

router.post('/auth/login', (req, res) => {
  const { email, asAdmin } = req.body;
  if (asAdmin) {
    currentUserId = 'user-admin';
    const adminUser = users.find(u => u.id === 'user-admin')!;
    return res.json({ user: adminUser });
  }

  const existing = users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
  if (existing) {
    currentUserId = existing.id;
    return res.json({ user: existing });
  }

  const user = users.find(u => u.id === currentUserId) || users[0];
  res.json({ user });
});

router.post('/auth/register', (req, res) => {
  const { email, firstName, age, gender, intent } = req.body;

  if (age && Number(age) < 18) {
    return res.status(400).json({ error: 'PULSE est strictement réservé aux adultes de 18 ans et plus.' });
  }

  const newUser = {
    id: `user-${Date.now()}`,
    email: email || `user_${Date.now()}@pulse.social`,
    firstName: firstName || 'Nouvel Explorateur',
    age: Number(age) || 22,
    gender: gender || 'Non-binaire',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    role: 'user' as const,
    isVerified: true,
    intent: intent || 'everything',
    bio: '',
    interests: [],
    gamingFavorites: [],
    musicFavorites: [],
    activityPreferences: [],
    location: 'Paris, France',
    lookingFor: 'Des connexions authentiques à travers le jeu et les expériences',
    online: true,
    lastActive: 'À l’instant',
    onboardingComplete: false,
    privacy: {
      incognito: false,
      showDistance: true,
      showAge: true,
      allowDirectMessages: true,
    },
  };

  users.unshift(newUser);
  currentUserId = newUser.id;
  adminStats.totalUsers += 1;
  adminStats.activeToday += 1;

  res.json({ user: newUser });
});

router.post('/auth/switch-role', (req, res) => {
  const { role } = req.body;
  if (role === 'admin') {
    currentUserId = 'user-admin';
  } else {
    currentUserId = 'user-current';
  }
  const user = users.find(u => u.id === currentUserId)!;
  res.json({ user });
});

// ----------------- PROFILS & DÉCOUVERTE -----------------
router.get('/profiles', (req, res) => {
  const { intent, search } = req.query;
  let result = users.filter(u => u.id !== currentUserId);

  if (intent && intent !== 'everything') {
    result = result.filter(u => u.intent === intent || u.intent === 'everything');
  }

  if (search) {
    const q = String(search).toLowerCase();
    result = result.filter(
      u =>
        u.firstName.toLowerCase().includes(q) ||
        u.bio.toLowerCase().includes(q) ||
        u.interests.some(i => i.toLowerCase().includes(q))
    );
  }

  res.json({ profiles: result });
});

router.get('/profiles/:id', (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'Profil introuvable' });
  res.json({ profile: user });
});

router.put('/profile', (req, res) => {
  const userIndex = users.findIndex(u => u.id === currentUserId);
  if (userIndex === -1) return res.status(404).json({ error: 'Utilisateur introuvable' });

  users[userIndex] = {
    ...users[userIndex],
    ...req.body,
    onboardingComplete: true,
  };

  res.json({ profile: users[userIndex] });
});

router.post('/profiles/:id/like', (req, res) => {
  const targetUser = users.find(u => u.id === req.params.id);
  if (!targetUser) return res.status(404).json({ error: 'Utilisateur introuvable' });

  const existingMatch = matches.find(m => m.targetUserId === targetUser.id && m.userId === currentUserId);
  if (!existingMatch) {
    const newMatch = {
      id: `match-${Date.now()}`,
      userId: currentUserId,
      targetUserId: targetUser.id,
      targetProfile: targetUser,
      compatibilityScore: Math.floor(Math.random() * 15) + 84,
      compatibilityReason: 'Alchimie mutuelle débloquée par vos passions communes et votre énergie de jeu.',
      sharedInterests: targetUser.interests.slice(0, 3),
      sharedGames: targetUser.gamingFavorites.slice(0, 2),
      status: 'matched' as const,
      createdAt: 'À l’instant',
    };
    matches.unshift(newMatch);
    adminStats.mutualMatches += 1;
    adminStats.recentActivity.unshift({
      id: `act-${Date.now()}`,
      type: 'match',
      description: `Nouvelle étincelle mutuelle : ${users.find(u => u.id === currentUserId)?.firstName} & ${targetUser.firstName}`,
      timestamp: 'À l’instant',
    });
  }

  res.json({ success: true, matched: true, targetUser });
});

router.post('/profiles/:id/pass', (req, res) => {
  res.json({ success: true, passed: true });
});

router.post('/profiles/:id/chemistry', async (req, res) => {
  const currentUser = users.find(u => u.id === currentUserId) || users[0];
  const targetUser = users.find(u => u.id === req.params.id);
  if (!targetUser) return res.status(404).json({ error: 'Utilisateur introuvable' });

  const analysis = await generateChemistryAnalysis(currentUser, targetUser);
  res.json({ analysis });
});

router.get('/matches', (req, res) => {
  res.json({ matches });
});

// ----------------- FIL D'ACTUALITÉ / POSTS -----------------
router.get('/posts', (req, res) => {
  const { category } = req.query;
  let result = posts;
  if (category && category !== 'for_you') {
    result = posts.filter(p => p.category === category);
  }
  res.json({ posts: result });
});

router.post('/posts', (req, res) => {
  const currentUser = users.find(u => u.id === currentUserId) || users[0];
  const { content, mediaType, mediaUrl, category, challengeData, activityData } = req.body;

  const newPost = {
    id: `post-${Date.now()}`,
    userId: currentUser.id,
    author: {
      id: currentUser.id,
      name: `${currentUser.firstName} ${currentUser.lastName || ''}`.trim(),
      avatar: currentUser.avatar,
      age: currentUser.age,
      intent: currentUser.intent,
      isVerified: currentUser.isVerified,
    },
    content,
    mediaType: mediaType || 'image',
    mediaUrl: mediaUrl || 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1000&q=80',
    category: category || 'for_you',
    likesCount: 0,
    sparksCount: 0,
    commentsCount: 0,
    createdAt: 'À l’instant',
    challengeData,
    activityData,
  };

  posts.unshift(newPost);
  res.json({ post: newPost });
});

router.post('/posts/:id/react', (req, res) => {
  const { type } = req.body;
  const post = posts.find(p => p.id === req.params.id);
  if (!post) return res.status(404).json({ error: 'Post introuvable' });

  if (post.userReacted === type) {
    post.userReacted = null;
    if (type === 'like') post.likesCount = Math.max(0, post.likesCount - 1);
    if (type === 'spark') post.sparksCount = Math.max(0, post.sparksCount - 1);
  } else {
    post.userReacted = type;
    if (type === 'like') post.likesCount += 1;
    if (type === 'spark' || type === 'fire') post.sparksCount += 1;
  }

  res.json({ post });
});

router.get('/posts/:id/comments', (req, res) => {
  const list = comments[req.params.id] || [];
  res.json({ comments: list });
});

router.post('/posts/:id/comments', (req, res) => {
  const currentUser = users.find(u => u.id === currentUserId) || users[0];
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: 'Commentaire vide' });

  const post = posts.find(p => p.id === req.params.id);
  if (post) post.commentsCount += 1;

  if (!comments[req.params.id]) comments[req.params.id] = [];
  const newComment = {
    id: `c-${Date.now()}`,
    postId: req.params.id,
    userId: currentUser.id,
    authorName: `${currentUser.firstName} ${currentUser.lastName || ''}`.trim(),
    authorAvatar: currentUser.avatar,
    content,
    createdAt: 'À l’instant',
  };

  comments[req.params.id].push(newComment);
  res.json({ comment: newComment });
});

// ----------------- GAMING HUB -----------------
router.get('/games', (req, res) => {
  res.json({ games });
});

router.get('/games/:id', (req, res) => {
  const game = games.find(g => g.id === req.params.id);
  if (!game) return res.status(404).json({ error: 'Jeu introuvable' });
  res.json({ game });
});

router.get('/rooms', (req, res) => {
  const { gameId } = req.query;
  let list = gameRooms;
  if (gameId) {
    list = list.filter(r => r.gameId === gameId);
  }
  res.json({ rooms: list });
});

router.post('/rooms', (req, res) => {
  const currentUser = users.find(u => u.id === currentUserId) || users[0];
  const { gameId, isPrivate } = req.body;
  const game = games.find(g => g.id === gameId);
  if (!game) return res.status(404).json({ error: 'Jeu introuvable' });

  const newRoom: any = {
    id: `room-${Date.now()}`,
    gameId: game.id,
    gameTitle: game.title,
    code: `PULSE-${Math.floor(10 + Math.random() * 90)}`,
    hostId: currentUser.id,
    hostName: currentUser.firstName,
    hostAvatar: currentUser.avatar,
    isPrivate: !!isPrivate,
    status: 'waiting',
    currentQuestionIndex: 0,
    players: [
      {
        userId: currentUser.id,
        name: currentUser.firstName,
        avatar: currentUser.avatar,
        score: 0,
        isReady: true,
        answers: {},
      },
    ],
    maxPlayers: game.maxPlayers,
    createdAt: new Date().toISOString(),
  };

  gameRooms.unshift(newRoom);
  adminStats.gamesPlayedTotal += 1;
  res.json({ room: newRoom });
});

router.get('/rooms/:roomId', (req, res) => {
  const room = gameRooms.find(r => r.id === req.params.roomId);
  if (!room) return res.status(404).json({ error: 'Salon introuvable' });
  res.json({ room });
});

router.post('/rooms/:roomId/join', (req, res) => {
  const currentUser = users.find(u => u.id === currentUserId) || users[0];
  const room = gameRooms.find(r => r.id === req.params.roomId);
  if (!room) return res.status(404).json({ error: 'Salon introuvable' });

  const existingPlayer = room.players.find(p => p.userId === currentUser.id);
  if (!existingPlayer) {
    if (room.players.length >= room.maxPlayers) {
      return res.status(400).json({ error: 'Le salon est déjà complet' });
    }
    room.players.push({
      userId: currentUser.id,
      name: currentUser.firstName,
      avatar: currentUser.avatar,
      score: 0,
      isReady: true,
      answers: {},
    });
  }

  res.json({ room });
});

router.post('/rooms/:roomId/action', (req, res) => {
  const currentUser = users.find(u => u.id === currentUserId) || users[0];
  const room = gameRooms.find(r => r.id === req.params.roomId);
  if (!room) return res.status(404).json({ error: 'Salon introuvable' });

  const { action, questionIndex, answer, status } = req.body;

  if (action === 'answer') {
    const player = room.players.find(p => p.userId === currentUser.id);
    if (player) {
      if (!player.answers) player.answers = {};
      player.answers[questionIndex] = answer;
      player.score += 20;
    }
  }

  if (action === 'next_question') {
    room.currentQuestionIndex += 1;
  }

  if (status) {
    room.status = status;
  }

  res.json({ room });
});

// ----------------- ACTIVITÉS -----------------
router.get('/activities', (req, res) => {
  res.json({ activities });
});

router.get('/activities/:id', (req, res) => {
  const activity = activities.find(a => a.id === req.params.id);
  if (!activity) return res.status(404).json({ error: 'Activité introuvable' });
  res.json({ activity });
});

router.post('/activities/:id/book', (req, res) => {
  const currentUser = users.find(u => u.id === currentUserId) || users[0];
  const act = activities.find(a => a.id === req.params.id);
  if (!act) return res.status(404).json({ error: 'Activité introuvable' });

  const alreadyBooked = act.attendees.some(att => att.userId === currentUser.id);
  if (!alreadyBooked) {
    if (act.bookedCount >= act.capacity) {
      return res.status(400).json({ error: 'L’activité est complète' });
    }
    act.bookedCount += 1;
    act.attendees.push({
      userId: currentUser.id,
      name: `${currentUser.firstName} ${currentUser.lastName || ''}`.trim(),
      avatar: currentUser.avatar,
    });
    adminStats.activitiesBooked += 1;
  }

  res.json({ activity: act, success: true });
});

router.post('/activities', (req, res) => {
  const currentUser = users.find(u => u.id === currentUserId) || users[0];
  const { title, category, description, coverImage, date, time, isOnline, location, capacity } = req.body;

  const newActivity = {
    id: `act-${Date.now()}`,
    title,
    category: category || 'social',
    description,
    coverImage: coverImage || 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
    date,
    time,
    isOnline: !!isOnline,
    location: location || 'Paris, France',
    capacity: Number(capacity) || 12,
    bookedCount: 1,
    organizer: {
      name: `${currentUser.firstName} ${currentUser.lastName || ''}`.trim(),
      avatar: currentUser.avatar,
      role: 'Membre Hôte',
    },
    attendees: [
      {
        userId: currentUser.id,
        name: currentUser.firstName,
        avatar: currentUser.avatar,
      },
    ],
  };

  activities.unshift(newActivity);
  res.json({ activity: newActivity });
});

// ----------------- MESSAGERIE -----------------
router.get('/conversations', (req, res) => {
  res.json({ conversations });
});

router.get('/conversations/:id/messages', (req, res) => {
  const list = messages[req.params.id] || [];
  res.json({ messages: list });
});

router.post('/conversations/start', (req, res) => {
  const currentUser = users.find(u => u.id === currentUserId) || users[0];
  const { targetUserId } = req.body;
  const targetUser = users.find(u => u.id === targetUserId);
  if (!targetUser) return res.status(404).json({ error: 'Destinataire introuvable' });

  let existing = conversations.find(c => c.participants.some(p => p.id === targetUser.id));
  if (!existing) {
    const convId = `conv-${targetUser.id}`;
    existing = {
      id: convId,
      participants: [currentUser, targetUser],
      unreadCount: 0,
      updatedAt: new Date().toISOString(),
    };
    conversations.unshift(existing);
    messages[convId] = [
      {
        id: `m-init-${Date.now()}`,
        conversationId: convId,
        senderId: currentUser.id,
        senderName: currentUser.firstName,
        senderAvatar: currentUser.avatar,
        content: `Salut ${targetUser.firstName} ! J'ai beaucoup aimé ton profil sur PULSE.`,
        type: 'text',
        read: true,
        createdAt: 'À l’instant',
      },
    ];
  }

  res.json({ conversation: existing });
});

router.post('/conversations/:id/messages', (req, res) => {
  const currentUser = users.find(u => u.id === currentUserId) || users[0];
  const { content, type, metadata } = req.body;
  const conv = conversations.find(c => c.id === req.params.id);
  if (!conv) return res.status(404).json({ error: 'Conversation introuvable' });

  const newMessage: any = {
    id: `m-${Date.now()}`,
    conversationId: conv.id,
    senderId: currentUser.id,
    senderName: currentUser.firstName,
    senderAvatar: currentUser.avatar,
    content,
    type: type || 'text',
    metadata,
    read: false,
    createdAt: 'À l’instant',
  };

  if (!messages[conv.id]) messages[conv.id] = [];
  messages[conv.id].push(newMessage);
  conv.lastMessage = newMessage;
  conv.updatedAt = new Date().toISOString();

  // Réponse simulée en français
  const otherParticipant = conv.participants.find(p => p.id !== currentUser.id);
  if (otherParticipant && otherParticipant.id !== 'user-admin') {
    setTimeout(() => {
      const automatedReplies = [
        `J'adore ton énergie ! Prêt(e) pour une manche de Quiz Alchimie ? ✨`,
        `C'est trop chouette ! Tu as regardé les prochaines activités sur PULSE ?`,
        `Haha tellement d'accord. Qu'est-ce que tu écoutes comme musique en ce moment ?`,
      ];
      const reply = {
        id: `m-auto-${Date.now()}`,
        conversationId: conv.id,
        senderId: otherParticipant.id,
        senderName: otherParticipant.firstName,
        senderAvatar: otherParticipant.avatar,
        content: automatedReplies[Math.floor(Math.random() * automatedReplies.length)],
        type: 'text' as const,
        read: false,
        createdAt: 'À l’instant',
      };
      messages[conv.id]?.push(reply);
      conv.lastMessage = reply;
      conv.unreadCount += 1;
    }, 2500);
  }

  res.json({ message: newMessage });
});

// ----------------- ENDPOINTS IA -----------------
router.post('/ai/onboarding-chat', async (req, res) => {
  const { history, currentStep } = req.body;
  const reply = await generateOnboardingReply(history || [], currentStep || 1);
  res.json(reply);
});

router.post('/ai/generate-profile', async (req, res) => {
  const { onboardingData } = req.body;
  const profileSynthesis = await generateSynthesizedProfile(onboardingData || {});
  
  const seed = onboardingData?.name || currentUserId;
  const dynamicAvatar = generateDynamicAvatar(seed, undefined, 140);
  const dynamicBanner = generateDynamicBanner(seed);

  res.json({
    profile: {
      ...profileSynthesis,
      dynamicAvatar,
      dynamicBanner,
    },
  });
});

// ----------------- ADMIN DASHBOARD -----------------
router.get('/admin/stats', (req, res) => {
  res.json({ stats: adminStats });
});

router.get('/admin/reports', (req, res) => {
  res.json({ reports: moderationReports });
});

router.post('/admin/reports/:id/action', (req, res) => {
  const report = moderationReports.find(r => r.id === req.params.id);
  if (!report) return res.status(404).json({ error: 'Signalement introuvable' });
  const { action, notes } = req.body;
  report.status = action === 'resolve' ? 'resolved' : 'dismissed';
  report.moderatorNotes = notes || 'Examiné par l’équipe de sécurité';
  adminStats.reportsPending = moderationReports.filter(r => r.status === 'pending').length;
  res.json({ report });
});

router.get('/admin/users', (req, res) => {
  res.json({ users });
});

router.post('/admin/users/:id/toggle-verify', (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'Utilisateur introuvable' });
  user.isVerified = !user.isVerified;
  res.json({ user });
});

export default router;
