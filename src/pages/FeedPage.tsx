import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Post, Comment } from '../types/index.ts';
import { fetchPosts, reactToPost, fetchComments, addComment, createPost } from '../lib/api.ts';
import {
  Heart,
  Sparkles,
  MessageCircle,
  Share2,
  Gamepad2,
  Calendar,
  Plus,
  MoreHorizontal,
  ShieldAlert,
  X,
  UserCheck,
} from 'lucide-react';

export const FeedPage: React.FC = () => {
  const { currentUser, navigate, showToast, activeUniverse, setActiveUniverse } = useApp();
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('for_you');
  const [loading, setLoading] = useState(true);

  // Modal commentaires
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentsList, setCommentsList] = useState<Comment[]>([]);
  const [newCommentText, setNewCommentText] = useState('');

  // Modal création de post
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState<'for_you' | 'love' | 'friends' | 'gaming' | 'activities'>('for_you');

  // Modal signalement
  const [reportingPostId, setReportingPostId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('Contenu inapproprié');

  const filterTabs = [
    { id: 'for_you', label: 'Pour vous' },
    { id: 'love', label: 'Amour' },
    { id: 'friends', label: 'Amis' },
    { id: 'gaming', label: 'Gaming' },
    { id: 'activities', label: 'Activités' },
    { id: 'live', label: 'En direct' },
  ];

  const loadFeedPosts = async (cat?: string) => {
    setLoading(true);
    try {
      const data = await fetchPosts(cat === 'for_you' ? undefined : cat);
      setPosts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeUniverse !== 'all') {
      setActiveCategory(activeUniverse);
      loadFeedPosts(activeUniverse);
    } else {
      loadFeedPosts(activeCategory);
    }
  }, [activeCategory, activeUniverse]);

  const handleReaction = async (post: Post, type: 'like' | 'spark' | 'fire') => {
    const updated = await reactToPost(post.id, type);
    setPosts(prev => prev.map(p => (p.id === post.id ? updated : p)));
    showToast({
      type: 'spark',
      title: type === 'spark' ? 'Étincelle Envoyée !' : 'Réaction Ajoutée',
      message: `Vous avez réagi à la publication de ${post.author.name}.`,
    });
  };

  const handleOpenComments = async (postId: string) => {
    setActiveCommentPostId(postId);
    const comments = await fetchComments(postId);
    setCommentsList(comments);
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !activeCommentPostId) return;

    const c = await addComment(activeCommentPostId, newCommentText.trim());
    setCommentsList(prev => [...prev, c]);
    setPosts(prev =>
      prev.map(p => (p.id === activeCommentPostId ? { ...p, commentsCount: p.commentsCount + 1 } : p))
    );
    setNewCommentText('');
    showToast({ type: 'info', title: 'Commentaire Publié', message: 'Votre message est visible.' });
  };

  const handleCreatePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const created = await createPost({
      content: newPostContent.trim(),
      category: newPostCategory,
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1000&q=80',
    });

    setPosts([created, ...posts]);
    setNewPostContent('');
    setIsCreatePostOpen(false);
    showToast({
      type: 'spark',
      title: 'Partagé sur le Fil PULSE',
      message: 'Votre moment a été partagé avec la communauté.',
    });
  };

  const handleReportSubmit = () => {
    showToast({
      type: 'info',
      title: 'Signalement Reçu',
      message: 'Merci de veiller à la sécurité de la communauté. Notre équipe examine ce post.',
    });
    setReportingPostId(null);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* Pilules de catégories */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {filterTabs.map(tab => {
          const isActive = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveCategory(tab.id);
                if (tab.id !== 'for_you') setActiveUniverse(tab.id as any);
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-[#A77BFF] to-[#F58AC9] text-white shadow-lg shadow-[#A77BFF]/20 scale-105'
                  : 'bg-[#191827] text-[#C8C0D8] hover:text-white border border-white/5 hover:border-white/20'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Barre de partage de moment */}
      <div className="p-4 rounded-3xl bg-[#191827] border border-white/10 flex items-center gap-3 shadow-lg">
        <img
          src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'}
          alt={currentUser?.firstName}
          className="w-10 h-10 rounded-2xl object-cover border border-[#A77BFF]/40"
        />
        <button
          onClick={() => setIsCreatePostOpen(true)}
          className="flex-1 text-left px-4 py-2.5 rounded-2xl bg-[#242139]/70 text-xs text-[#C8C0D8]/70 hover:text-white hover:bg-[#242139] transition-colors"
        >
          Partagez une photo, un défi de jeu ou un projet...
        </button>
        <button
          onClick={() => setIsCreatePostOpen(true)}
          className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#A77BFF] to-[#F58AC9] flex items-center justify-center text-white shadow-md hover:opacity-90 active:scale-95 transition-all"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Flux de publications */}
      {loading ? (
        <div className="space-y-6">
          {[1, 2].map(i => (
            <div key={i} className="p-6 rounded-3xl bg-[#191827] border border-white/5 animate-pulse space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#242139]" />
                <div className="space-y-2 flex-1">
                  <div className="w-28 h-3 bg-[#242139] rounded" />
                  <div className="w-16 h-2 bg-[#242139] rounded" />
                </div>
              </div>
              <div className="w-full h-64 bg-[#242139] rounded-2xl" />
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[#191827] border border-white/5">
          <Sparkles className="w-8 h-8 text-[#A77BFF] mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">Aucune publication dans cette catégorie</h3>
          <p className="text-xs text-[#C8C0D8] mt-1 max-w-sm mx-auto">
            Soyez le premier à briser la glace avec une photo ou un défi de jeu !
          </p>
          <button
            onClick={() => setIsCreatePostOpen(true)}
            className="mt-4 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#A77BFF] to-[#F58AC9] text-white text-xs font-bold"
          >
            Créer une Publication
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map(post => {
            return (
              <article
                key={post.id}
                className="overflow-hidden rounded-3xl bg-[#191827] border border-white/10 shadow-xl hover:border-white/15 transition-all duration-300"
              >
                {/* En-tête de l'auteur */}
                <div className="p-4 sm:p-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => navigate('/app/discover')}
                      className="relative group"
                    >
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-11 h-11 rounded-2xl object-cover border border-[#A77BFF]/40 shadow-sm"
                      />
                      {post.author.isVerified && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#82E3B1] rounded-full flex items-center justify-center text-[#10101B]">
                          <UserCheck className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white hover:text-[#A77BFF] transition-colors cursor-pointer">
                          {post.author.name}
                        </span>
                        <span className="text-xs text-[#C8C0D8]/60">• {post.author.age} ans</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#A77BFF]/15 text-[#A77BFF] uppercase">
                          {post.author.intent === 'love' ? 'Amour' : post.author.intent === 'friends' ? 'Amis' : post.author.intent === 'gaming' ? 'Gaming' : 'Mixte'}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#C8C0D8]/60 mt-0.5">{post.createdAt}</p>
                    </div>
                  </div>

                  <div className="relative">
                    <button
                      onClick={() => setReportingPostId(post.id)}
                      className="p-2 text-[#C8C0D8]/60 hover:text-white rounded-xl hover:bg-[#242139] transition-colors"
                      title="Options"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Texte de la publication */}
                <div className="px-4 sm:px-5 pb-3">
                  <p className="text-sm text-white/95 leading-relaxed font-normal">{post.content}</p>
                </div>

                {/* Présentation du média */}
                {post.mediaUrl && (
                  <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-[#10101B] overflow-hidden">
                    <img
                      src={post.mediaUrl}
                      alt="Illustration du post"
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-102"
                    />

                    {/* Pièce jointe Défi de jeu */}
                    {post.challengeData && (
                      <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-2xl bg-[#10101B]/85 backdrop-blur-md border border-[#A77BFF]/40 shadow-xl flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#A77BFF] to-[#F58AC9] flex items-center justify-center text-white shrink-0 shadow-md">
                            <Gamepad2 className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-[#F58AC9] uppercase tracking-wider">
                              Défi Multijoueur en Direct
                            </span>
                            <h4 className="text-xs font-bold text-white">{post.challengeData.gameTitle}</h4>
                          </div>
                        </div>
                        <button
                          onClick={() => navigate('/app/games')}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#A77BFF] to-[#F58AC9] text-white text-xs font-bold hover:opacity-90 active:scale-95 transition-all whitespace-nowrap shadow-md"
                        >
                          Rejoindre
                        </button>
                      </div>
                    )}

                    {/* Pièce jointe Invitation d'activité */}
                    {post.activityData && (
                      <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-2xl bg-[#10101B]/85 backdrop-blur-md border border-[#82E3B1]/40 shadow-xl flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#82E3B1]/20 border border-[#82E3B1]/40 flex items-center justify-center text-[#82E3B1] shrink-0 shadow-md">
                            <Calendar className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-[#82E3B1] uppercase tracking-wider">
                              Invitation Expérience Partagée
                            </span>
                            <h4 className="text-xs font-bold text-white">{post.activityData.title}</h4>
                            <p className="text-[10px] text-[#C8C0D8]">{post.activityData.date} • {post.activityData.location}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => navigate('/app/activities')}
                          className="px-4 py-2 rounded-xl bg-[#82E3B1] text-[#10101B] text-xs font-bold hover:bg-[#82E3B1]/90 active:scale-95 transition-all whitespace-nowrap shadow-md"
                        >
                          Voir Détails
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Barre de réactions et commentaires */}
                <div className="p-4 sm:p-5 flex items-center justify-between border-t border-white/5">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {/* Réaction Étincelle */}
                    <button
                      onClick={() => handleReaction(post, 'spark')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        post.userReacted === 'spark'
                          ? 'bg-[#F58AC9]/20 text-[#F58AC9] border border-[#F58AC9]/40'
                          : 'text-[#C8C0D8] hover:text-white hover:bg-[#242139]'
                      }`}
                    >
                      <Sparkles className="w-4 h-4 text-[#F58AC9]" />
                      <span>{post.sparksCount}</span>
                    </button>

                    {/* Réaction Cœur */}
                    <button
                      onClick={() => handleReaction(post, 'like')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        post.userReacted === 'like'
                          ? 'bg-[#A77BFF]/20 text-[#A77BFF] border border-[#A77BFF]/40'
                          : 'text-[#C8C0D8] hover:text-white hover:bg-[#242139]'
                      }`}
                    >
                      <Heart className="w-4 h-4" />
                      <span>{post.likesCount}</span>
                    </button>

                    {/* Commentaires */}
                    <button
                      onClick={() => handleOpenComments(post.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#C8C0D8] hover:text-white hover:bg-[#242139] transition-all"
                    >
                      <MessageCircle className="w-4 h-4 text-[#48D9E6]" />
                      <span>{post.commentsCount}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        showToast({
                          type: 'info',
                          title: 'Lien Copié',
                          message: 'Lien de la publication copié dans le presse-papier.',
                        });
                      }}
                      className="p-2 text-[#C8C0D8]/60 hover:text-white rounded-xl hover:bg-[#242139] transition-colors"
                      title="Partager"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Tiroir de commentaires */}
      {activeCommentPostId && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#10101B]/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-[#191827] border border-white/10 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl flex flex-col max-h-[80vh]">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <h3 className="text-sm font-bold text-white font-heading">
                Commentaires ({commentsList.length})
              </h3>
              <button
                onClick={() => setActiveCommentPostId(null)}
                className="p-1 text-[#C8C0D8]/60 hover:text-white rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {commentsList.length === 0 ? (
                <p className="text-xs text-[#C8C0D8]/60 text-center py-6">
                  Aucun commentaire pour le moment. Lancez la discussion !
                </p>
              ) : (
                commentsList.map(c => (
                  <div key={c.id} className="flex items-start gap-2.5 p-2 rounded-2xl hover:bg-[#242139]/40 transition-colors">
                    <img
                      src={c.authorAvatar}
                      alt={c.authorName}
                      className="w-8 h-8 rounded-full object-cover border border-[#A77BFF]/30 shrink-0"
                    />
                    <div className="flex-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{c.authorName}</span>
                        <span className="text-[10px] text-[#C8C0D8]/60">{c.createdAt}</span>
                      </div>
                      <p className="text-[#C8C0D8] mt-0.5 leading-relaxed">{c.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleAddComment} className="pt-3 border-t border-white/5 flex items-center gap-2">
              <input
                type="text"
                placeholder="Ajouter une pensée bienveillante..."
                value={newCommentText}
                onChange={e => setNewCommentText(e.target.value)}
                className="flex-1 bg-[#242139] border border-white/10 rounded-2xl px-4 py-2 text-xs text-white placeholder-[#C8C0D8]/50 focus:outline-none focus:border-[#A77BFF]/50"
              />
              <button
                type="submit"
                disabled={!newCommentText.trim()}
                className="px-4 py-2 rounded-2xl bg-gradient-to-r from-[#A77BFF] to-[#F58AC9] text-white text-xs font-bold disabled:opacity-40"
              >
                Envoyer
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Créer une Publication */}
      {isCreatePostOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#10101B]/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#191827] border border-white/10 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white font-heading">Partager sur le Fil PULSE</h3>
              <button
                onClick={() => setIsCreatePostOpen(false)}
                className="p-1 text-[#C8C0D8]/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePostSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-[#C8C0D8] mb-1.5 block">Catégorie</label>
                <select
                  value={newPostCategory}
                  onChange={e => setNewPostCategory(e.target.value as any)}
                  className="w-full bg-[#242139] border border-white/10 rounded-2xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="for_you">Pour vous / Général</option>
                  <option value="love">Amour & Rencontres</option>
                  <option value="friends">Amis & Communauté</option>
                  <option value="gaming">Gaming & Défis</option>
                  <option value="activities">Activités Partagées</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-[#C8C0D8] mb-1.5 block">Votre message</label>
                <textarea
                  rows={4}
                  placeholder="Que se passe-t-il ? Partagez un projet créatif, une invitation de jeu ou une idée spontanée..."
                  value={newPostContent}
                  onChange={e => setNewPostContent(e.target.value)}
                  className="w-full bg-[#242139] border border-white/10 rounded-2xl p-3 text-xs text-white placeholder-[#C8C0D8]/40 focus:outline-none focus:border-[#A77BFF]/50"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreatePostOpen(false)}
                  className="px-4 py-2 rounded-2xl bg-[#242139] text-[#C8C0D8] text-xs font-semibold hover:text-white"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={!newPostContent.trim()}
                  className="px-5 py-2 rounded-2xl bg-gradient-to-r from-[#A77BFF] to-[#F58AC9] text-white text-xs font-bold disabled:opacity-40 shadow-md"
                >
                  Publier le Moment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Signalement de publication */}
      {reportingPostId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#10101B]/80 backdrop-blur-md">
          <div className="w-full max-w-sm bg-[#191827] border border-white/10 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center gap-2 text-amber-400 text-sm font-bold mb-2">
              <ShieldAlert className="w-5 h-5" />
              <span>Signaler un Contenu</span>
            </div>
            <p className="text-xs text-[#C8C0D8] mb-4">
              Aidez-nous à préserver un espace sain et respectueux. Veuillez choisir un motif :
            </p>
            <div className="space-y-2 mb-4">
              {[
                'Soupçon de compte mineur (<18 ans)',
                'Harcèlement ou propos haineux',
                'Contenu visuel inapproprié',
                'Spam commercial ou promotion externe',
              ].map((reason, i) => (
                <label
                  key={i}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-[#242139]/60 border border-white/5 text-xs text-white cursor-pointer hover:bg-[#242139]"
                >
                  <input
                    type="radio"
                    name="reportReason"
                    checked={reportReason === reason}
                    onChange={() => setReportReason(reason)}
                    className="accent-[#A77BFF]"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setReportingPostId(null)}
                className="px-4 py-2 rounded-2xl bg-[#242139] text-xs font-semibold text-[#C8C0D8] hover:text-white"
              >
                Annuler
              </button>
              <button
                onClick={handleReportSubmit}
                className="px-4 py-2 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold"
              >
                Envoyer le Signalement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
