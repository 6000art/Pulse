import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Sparkles, Gamepad2, MessageCircle, Zap } from 'lucide-react';

export const MatchesPage: React.FC = () => {
  const { matches, navigate, showToast } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h2 className="text-2xl font-black font-heading text-white">Étincelles Mutuelles & Connexions</h2>
        <p className="text-xs text-[#C8C0D8]/70">
          Les membres avec qui vous avez partagé une connexion. Défiez-les sur un jeu ou engagez la conversation !
        </p>
      </div>

      {matches.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[#191827] border border-white/5 space-y-3">
          <Sparkles className="w-10 h-10 text-[#A77BFF] mx-auto" />
          <h3 className="text-base font-bold text-white">Aucune connexion active pour le moment</h3>
          <p className="text-xs text-[#C8C0D8]">Explorez le deck Matchmaking IA pour découvrir des âmes soeurs.</p>
          <button
            onClick={() => navigate('/app/discover')}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#A77BFF] to-[#F58AC9] text-white text-xs font-bold"
          >
            Découvrir des Membres
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {matches.map(m => (
            <div
              key={m.id}
              className="p-5 rounded-3xl bg-[#191827] border border-white/10 hover:border-[#A77BFF]/30 transition-all flex flex-col justify-between shadow-xl"
            >
              <div className="flex items-start gap-4">
                <img
                  src={m.targetProfile.avatar}
                  alt={m.targetProfile.firstName}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-[#A77BFF] shadow-md shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white truncate">
                      {m.targetProfile.firstName}, {m.targetProfile.age} ans
                    </h3>
                    <span className="text-xs font-black text-[#82E3B1] flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-[#F58AC9]" />
                      {m.compatibilityScore}%
                    </span>
                  </div>
                  <p className="text-xs text-[#C8C0D8] line-clamp-2 mt-1">
                    {m.compatibilityReason}
                  </p>
                </div>
              </div>

              {/* Barre de progression visuelle de compatibilité IA */}
              <div className="my-3.5 p-3 rounded-2xl bg-[#10101B]/70 border border-white/5 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-white font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#F58AC9]" />
                    Compatibilité IA Prédite
                  </span>
                  <span className="font-extrabold text-[#82E3B1]">{m.compatibilityScore}%</span>
                </div>
                <div className="w-full h-2 bg-[#242139] rounded-full overflow-hidden p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-[#A77BFF] via-[#F58AC9] to-[#82E3B1] rounded-full transition-all duration-700"
                    style={{ width: `${m.compatibilityScore}%` }}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {m.sharedInterests.map((interest, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-xl bg-[#242139] text-[10px] text-white font-medium"
                  >
                    {interest}
                  </span>
                ))}
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center gap-2">
                <button
                  onClick={() => {
                    showToast({
                      type: 'spark',
                      title: 'Défi de Quiz Envoyé',
                      message: `Invitation envoyée à ${m.targetProfile.firstName}.`,
                    });
                    navigate('/app/games');
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-[#242139] hover:bg-white/10 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Gamepad2 className="w-3.5 h-3.5 text-[#48D9E6]" />
                  <span>Défier</span>
                </button>

                <button
                  onClick={() => navigate('/app/messages')}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#A77BFF] to-[#F58AC9] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md hover:opacity-90 transition-opacity"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Message</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
