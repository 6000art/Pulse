import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Conversation, Message } from '../types/index.ts';
import { fetchConversations, fetchMessages, sendMessage } from '../lib/api.ts';
import {
  Send,
  Gamepad2,
  ArrowLeft,
  MoreVertical,
} from 'lucide-react';

export const MessagingPage: React.FC = () => {
  const { currentUser, showToast, navigate } = useApp();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messagesList, setMessagesList] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const loadConversations = async () => {
    const data = await fetchConversations();
    setConversations(data);
    if (data.length > 0 && !activeConversationId) {
      setActiveConversationId(data[0].id);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (activeConversationId) {
      fetchMessages(activeConversationId).then(msgs => {
        setMessagesList(msgs);
      });
    }
  }, [activeConversationId]);

  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const otherParticipant = activeConversation?.participants.find(p => p.id !== currentUser?.id);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeConversationId) return;

    const sent = await sendMessage(activeConversationId, {
      content: inputMessage.trim(),
      type: 'text',
    });

    setMessagesList(prev => [...prev, sent]);
    setInputMessage('');

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      fetchMessages(activeConversationId).then(msgs => setMessagesList(msgs));
    }, 2800);
  };

  const handleSendGameInvite = async () => {
    if (!activeConversationId) return;
    const sent = await sendMessage(activeConversationId, {
      content: "Testons notre alchimie ! J'ai créé un salon Quiz Alchimie Pulse.",
      type: 'game_invite',
      metadata: {
        gameId: 'game-compatibility',
        gameTitle: 'Quiz Alchimie Pulse',
        roomId: 'room-comp-1',
      },
    });
    setMessagesList(prev => [...prev, sent]);
    showToast({
      type: 'spark',
      title: 'Invitation de Jeu Envoyée !',
      message: 'Invitation au Quiz Alchimie transmise.',
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 h-[calc(100vh-80px)] flex flex-col md:flex-row gap-4">
      {/* Liste des conversations à gauche */}
      <div
        className={`w-full md:w-80 shrink-0 bg-[#191827] border border-white/10 rounded-3xl p-4 flex flex-col ${
          activeConversationId && 'hidden md:flex'
        }`}
      >
        <div className="pb-3 border-b border-white/5 mb-3 flex items-center justify-between">
          <h2 className="text-base font-bold text-white font-heading">Conversations</h2>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#A77BFF]/20 text-[#A77BFF]">
            {conversations.length} Actives
          </span>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2">
          {conversations.map(conv => {
            const partner = conv.participants.find(p => p.id !== currentUser?.id);
            const isSelected = conv.id === activeConversationId;

            return (
              <button
                key={conv.id}
                onClick={() => setActiveConversationId(conv.id)}
                className={`w-full text-left p-3 rounded-2xl flex items-center gap-3 transition-all ${
                  isSelected
                    ? 'bg-[#242139] border border-[#A77BFF]/30 shadow-md'
                    : 'hover:bg-[#242139]/50 border border-transparent'
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={partner?.avatar}
                    alt={partner?.firstName}
                    className="w-11 h-11 rounded-2xl object-cover border border-[#A77BFF]/40"
                  />
                  {partner?.online && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#82E3B1] rounded-full border-2 border-[#191827]" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white truncate">{partner?.firstName}</span>
                    <span className="text-[10px] text-[#C8C0D8]/60">
                      {conv.lastMessage?.createdAt || ''}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#C8C0D8]/70 truncate mt-0.5">
                    {conv.lastMessage?.content || 'Discussion initiée'}
                  </p>
                </div>

                {conv.unreadCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-gradient-to-r from-[#A77BFF] to-[#F58AC9] text-[10px] font-bold text-white flex items-center justify-center shrink-0">
                    {conv.unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Fenêtre de chat active à droite */}
      <div
        className={`flex-1 bg-[#191827] border border-white/10 rounded-3xl flex flex-col overflow-hidden ${
          !activeConversationId && 'hidden md:flex'
        }`}
      >
        {activeConversation && otherParticipant ? (
          <>
            {/* En-tête du chat */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-[#10101B]/40">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveConversationId(null)}
                  className="md:hidden p-1.5 text-[#C8C0D8] hover:text-white"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <img
                  src={otherParticipant.avatar}
                  alt={otherParticipant.firstName}
                  className="w-10 h-10 rounded-2xl object-cover border border-[#A77BFF]/40"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">{otherParticipant.firstName}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#82E3B1]/15 text-[#82E3B1]">
                      18+ Vérifié
                    </span>
                  </div>
                  <p className="text-[10px] text-[#C8C0D8]/70">
                    {otherParticipant.online ? 'En ligne' : otherParticipant.lastActive}
                  </p>
                </div>
              </div>

              {/* Raccourcis d'actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSendGameInvite}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#242139] border border-[#48D9E6]/30 text-xs font-semibold text-[#48D9E6] hover:bg-[#48D9E6]/10 transition-colors"
                >
                  <Gamepad2 className="w-3.5 h-3.5" />
                  <span>Défier au Quiz</span>
                </button>
                <button
                  onClick={() => {
                    showToast({
                      type: 'info',
                      title: 'Options de Sécurité',
                      message: 'Vous pouvez bloquer ou signaler ce membre à tout moment.',
                    });
                  }}
                  className="p-2 text-[#C8C0D8]/60 hover:text-white rounded-xl hover:bg-[#242139]"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Fil des messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messagesList.map(msg => {
                const isMe = msg.senderId === currentUser?.id;

                return (
                  <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    {msg.type === 'game_invite' ? (
                      <div className="max-w-xs p-4 rounded-3xl bg-[#242139] border border-[#A77BFF]/40 shadow-xl space-y-3 text-left">
                        <div className="flex items-center gap-2 text-xs font-bold text-[#F58AC9]">
                          <Gamepad2 className="w-4 h-4" />
                          <span>Invitation à Jouer</span>
                        </div>
                        <p className="text-xs text-white">{msg.content}</p>
                        <button
                          onClick={() => navigate('/app/games')}
                          className="w-full py-2 rounded-xl bg-gradient-to-r from-[#A77BFF] to-[#F58AC9] text-white text-xs font-bold shadow-md"
                        >
                          Accepter & Entrer dans le Salon
                        </button>
                      </div>
                    ) : (
                      <div
                        className={`max-w-[75%] p-3.5 rounded-3xl text-xs sm:text-sm leading-relaxed ${
                          isMe
                            ? 'bg-gradient-to-r from-[#A77BFF] to-[#F58AC9] text-white rounded-tr-none shadow-md'
                            : 'bg-[#242139] text-white rounded-tl-none border border-white/5 shadow-sm'
                        }`}
                      >
                        {msg.content}
                      </div>
                    )}
                    <span className="text-[9px] text-[#C8C0D8]/50 mt-1 px-1">{msg.createdAt}</span>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex items-center gap-2 text-xs text-[#C8C0D8]/70">
                  <span className="w-2 h-2 rounded-full bg-[#A77BFF] animate-pulse" />
                  <span>{otherParticipant.firstName} est en train d'écrire...</span>
                </div>
              )}
            </div>

            {/* Barre de saisie */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-white/5 flex items-center gap-2">
              <button
                type="button"
                onClick={handleSendGameInvite}
                className="p-2.5 rounded-2xl bg-[#242139] text-[#48D9E6] hover:bg-[#48D9E6]/20 transition-colors"
                title="Envoyer une invitation de jeu"
              >
                <Gamepad2 className="w-4 h-4" />
              </button>

              <input
                type="text"
                placeholder={`Écrire à ${otherParticipant.firstName}...`}
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                className="flex-1 bg-[#242139] border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-[#C8C0D8]/40 focus:outline-none focus:border-[#A77BFF]/50"
              />

              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="p-2.5 rounded-2xl bg-gradient-to-r from-[#A77BFF] to-[#F58AC9] text-white disabled:opacity-40 shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center p-6 text-xs text-[#C8C0D8]/60">
            Sélectionnez une conversation à gauche pour commencer à discuter.
          </div>
        )}
      </div>
    </div>
  );
};
