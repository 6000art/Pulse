import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext.tsx';
import { Sparkles, Gamepad2, MessageCircle, X } from 'lucide-react';

export const MatchCelebrationModal: React.FC = () => {
  const { activeMatchModal, setActiveMatchModal, currentUser, navigate } = useApp();

  useEffect(() => {
    if (activeMatchModal) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#A77BFF', '#F58AC9', '#48D9E6', '#82E3B1'],
      });
      const timer = setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#A77BFF', '#F58AC9'],
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#48D9E6', '#82E3B1'],
        });
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [activeMatchModal]);

  if (!activeMatchModal || !currentUser) return null;

  const handleStartGame = () => {
    setActiveMatchModal(null);
    navigate('/app/games');
  };

  const handleSendMessage = () => {
    setActiveMatchModal(null);
    navigate('/app/messages');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#10101B]/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="relative w-full max-w-md rounded-3xl p-6 sm:p-8 bg-[#191827] border border-[#A77BFF]/30 shadow-2xl text-center overflow-hidden">
        {/* Lueur d'ambiance */}
        <div className="absolute -top-24 -left-24 w-52 h-52 bg-[#A77BFF]/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-52 h-52 bg-[#F58AC9]/25 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={() => setActiveMatchModal(null)}
          className="absolute top-4 right-4 p-2 text-[#C8C0D8] hover:text-white rounded-full bg-[#242139]/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#A77BFF]/15 border border-[#A77BFF]/30 text-[#F58AC9] text-xs font-semibold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5 text-[#F58AC9] animate-pulse" />
          Étincelle Mutuelle !
        </div>

        <h2 className="text-3xl font-extrabold text-white font-heading tracking-tight mb-2">
          C'est une Connexion !
        </h2>
        <p className="text-sm text-[#C8C0D8] max-w-xs mx-auto mb-6">
          Vous et <span className="text-white font-semibold">{activeMatchModal.firstName}</span> partagez la même énergie. C'est l'heure de briser la glace par le jeu !
        </p>

        {/* Avatars en miroir */}
        <div className="relative flex items-center justify-center gap-4 my-6">
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.firstName}
              className="w-20 h-20 rounded-full object-cover border-3 border-[#A77BFF] shadow-lg shadow-[#A77BFF]/20"
            />
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-[#A77BFF] text-white px-2 py-0.5 rounded-full whitespace-nowrap">
              Vous
            </span>
          </div>

          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#A77BFF] to-[#F58AC9] flex items-center justify-center text-white shadow-md animate-pulse">
            <Sparkles className="w-5 h-5" />
          </div>

          <div className="relative">
            <img
              src={activeMatchModal.avatar}
              alt={activeMatchModal.firstName}
              className="w-20 h-20 rounded-full object-cover border-3 border-[#F58AC9] shadow-lg shadow-[#F58AC9]/20"
            />
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-[#F58AC9] text-white px-2 py-0.5 rounded-full whitespace-nowrap">
              {activeMatchModal.firstName}
            </span>
          </div>
        </div>

        {/* Score & Barre de progression d'affinité */}
        <div className="p-4 rounded-2xl bg-[#242139]/80 border border-white/5 mb-6 text-left space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#C8C0D8] font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#F58AC9]" />
              Score de Compatibilité IA
            </span>
            <span className="text-sm font-black text-[#82E3B1]">
              {activeMatchModal.compatibilityScore || 94}%
            </span>
          </div>
          <div className="w-full h-2.5 bg-[#10101B] rounded-full overflow-hidden p-0.5 border border-white/5">
            <div
              className="h-full bg-gradient-to-r from-[#A77BFF] via-[#F58AC9] to-[#82E3B1] rounded-full transition-all duration-1000 shadow-md"
              style={{ width: `${activeMatchModal.compatibilityScore || 94}%` }}
            />
          </div>
          <p className="text-[11px] text-[#C8C0D8] pt-0.5">
            {activeMatchModal.aiCompatibilityNote || 'Forte affinité pour les défis coopératifs et les sorties créatives de week-end.'}
          </p>
        </div>

        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleStartGame}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#A77BFF] to-[#F58AC9] text-white font-semibold text-sm shadow-lg shadow-[#A77BFF]/25 hover:opacity-95 transition-all transform active:scale-95"
          >
            <Gamepad2 className="w-4 h-4" />
            Inviter à Jouer
          </button>
          <button
            onClick={handleSendMessage}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#242139] border border-white/10 text-white font-semibold text-sm hover:bg-[#242139]/80 transition-all transform active:scale-95"
          >
            <MessageCircle className="w-4 h-4 text-[#48D9E6]" />
            Envoyer un Message
          </button>
        </div>

        <button
          onClick={() => setActiveMatchModal(null)}
          className="mt-4 text-xs text-[#C8C0D8]/80 hover:text-white transition-colors"
        >
          Continuer à explorer
        </button>
      </div>
    </div>
  );
};
