import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { User } from '../types/index.ts';
import { fetchProfiles, likeProfile, passProfile, getChemistryAnalysis, startConversation } from '../lib/api.ts';
import { CompatibilityMeter } from '../components/common/CompatibilityMeter.tsx';
import {
  Sparkles,
  Heart,
  X,
  Gamepad2,
  MessageCircle,
  ShieldCheck,
  Zap,
  MapPin,
} from 'lucide-react';

export const DiscoverPage: React.FC = () => {
  const { navigate, showToast, setActiveMatchModal } = useApp();
  const [profiles, setProfiles] = useState<User[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIntentFilter, setSelectedIntentFilter] = useState<string>('everything');
  const [loading, setLoading] = useState(true);

  // Modal Alchimie Approfondie
  const [chemistryModalData, setChemistryModalData] = useState<any | null>(null);
  const [isAnalyzingChemistry, setIsAnalyzingChemistry] = useState(false);

  const loadProfilesData = async (intent?: string) => {
    setLoading(true);
    try {
      const data = await fetchProfiles(intent === 'everything' ? undefined : intent);
      setProfiles(data);
      setCurrentIndex(0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfilesData(selectedIntentFilter);
  }, [selectedIntentFilter]);

  const activeProfile = profiles[currentIndex];

  const handleLike = async () => {
    if (!activeProfile) return;
    try {
      const res = await likeProfile(activeProfile.id);
      if (res.matched) {
        setActiveMatchModal(activeProfile);
      } else {
        showToast({
          type: 'spark',
          title: 'Étincelle Envoyée',
          message: `Vous avez exprimé votre intérêt pour ${activeProfile.firstName}.`,
        });
      }
      nextProfile();
    } catch (e) {
      console.error(e);
    }
  };

  const handlePass = async () => {
    if (!activeProfile) return;
    await passProfile(activeProfile.id);
    nextProfile();
  };

  const nextProfile = () => {
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(profiles.length);
    }
  };

  const handleInspectChemistry = async () => {
    if (!activeProfile) return;
    setIsAnalyzingChemistry(true);
    try {
      const analysis = await getChemistryAnalysis(activeProfile.id);
      setChemistryModalData({ profile: activeProfile, analysis });
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzingChemistry(false);
    }
  };

  const handleInviteToGame = () => {
    if (!activeProfile) return;
    showToast({
      type: 'spark',
      title: 'Défi de Jeu Créé !',
      message: `${activeProfile.firstName} a été invité(e) au Quiz Alchimie.`,
    });
    navigate('/app/games');
  };

  const handleDirectMessage = async () => {
    if (!activeProfile) return;
    await startConversation(activeProfile.id);
    navigate(`/app/messages`);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-6">
      {/* Barre de filtre supérieure */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black font-heading text-white">Matchmaking IA</h2>
          <p className="text-xs text-[#C8C0D8]/70">Découvrez des profils selon leur énergie et leurs jeux</p>
        </div>

        {/* Filtre d'intention */}
        <select
          value={selectedIntentFilter}
          onChange={e => setSelectedIntentFilter(e.target.value)}
          className="bg-[#191827] border border-white/10 rounded-2xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#A77BFF]/50"
        >
          <option value="everything">Toutes les Intentions</option>
          <option value="love">Dating & Amour</option>
          <option value="friends">Amitiés</option>
          <option value="gaming">Partenaires de Jeux</option>
          <option value="activities">Activités & Sorties</option>
        </select>
      </div>

      {loading ? (
        <div className="w-full aspect-[3/4] rounded-3xl bg-[#191827] border border-white/5 animate-pulse" />
      ) : !activeProfile ? (
        <div className="p-12 text-center rounded-3xl bg-[#191827] border border-white/5 space-y-4">
          <Sparkles className="w-10 h-10 text-[#A77BFF] mx-auto animate-pulse" />
          <h3 className="text-lg font-bold text-white">Vous avez exploré tous les profils actuels !</h3>
          <p className="text-xs text-[#C8C0D8] max-w-sm mx-auto">
            Revenez très bientôt pour de nouveaux membres ou invitez vos connexions dans des salons de jeux en direct !
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => loadProfilesData(selectedIntentFilter)}
              className="px-5 py-2.5 rounded-2xl bg-[#242139] text-xs font-semibold text-white hover:bg-white/10"
            >
              Réinitialiser le Deck
            </button>
            <button
              onClick={() => navigate('/app/games')}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#A77BFF] to-[#F58AC9] text-xs font-bold text-white"
            >
              Jouer Maintenant
            </button>
          </div>
        </div>
      ) : (
        /* Carte de profil */
        <div className="relative rounded-3xl overflow-hidden bg-[#191827] border border-white/10 shadow-2xl transition-all">
          <div className="relative aspect-[3/4] w-full bg-[#10101B]">
            <img
              src={activeProfile.avatar}
              alt={activeProfile.firstName}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#10101B] via-[#10101B]/40 to-transparent" />

            {/* Badges supérieurs */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10101B]/70 backdrop-blur-md border border-white/10 text-xs font-bold text-[#82E3B1]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>18+ Vérifié</span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#A77BFF] to-[#F58AC9] text-xs font-bold text-white shadow-lg">
                <Zap className="w-3.5 h-3.5" />
                <span>94% d'Affinité</span>
              </div>
            </div>

            {/* Informations sur le profil */}
            <div className="absolute bottom-4 left-4 right-4 text-left">
              <div className="flex items-baseline gap-2 mb-1">
                <h3 className="text-2xl font-black text-white font-heading">
                  {activeProfile.firstName}
                </h3>
                <span className="text-lg text-white/80 font-medium">{activeProfile.age} ans</span>
                {activeProfile.pronouns && (
                  <span className="text-xs text-[#C8C0D8]/70">({activeProfile.pronouns})</span>
                )}
              </div>

              <div className="flex items-center gap-3 text-xs text-[#C8C0D8]/90 mb-3">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#48D9E6]" />
                  {activeProfile.location}
                </span>
                <span>•</span>
                <span className="capitalize font-semibold text-[#F58AC9]">
                  {activeProfile.intent === 'love' ? 'Dating' : activeProfile.intent === 'friends' ? 'Amitiés' : activeProfile.intent === 'gaming' ? 'Gaming' : 'Mixte'}
                </span>
              </div>

              <p className="text-xs text-white/95 leading-relaxed line-clamp-3 mb-4">
                {activeProfile.bio}
              </p>

              {/* Passions et centres d'intérêt */}
              <div className="flex flex-wrap gap-1.5 mb-2">
                {activeProfile.interests.slice(0, 4).map((interest, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-xl bg-[#242139]/80 backdrop-blur-md border border-white/10 text-[11px] text-white font-medium"
                  >
                    {interest}
                  </span>
                ))}
              </div>

              {/* Barre de Score de Compatibilité IA & Jauge de Matchmaking */}
              <div className="mt-3">
                <CompatibilityMeter
                  score={activeProfile.compatibilityScore || 92}
                  breakdown={activeProfile.compatibilityBreakdown || { emotional: 94, gaming: 90, lifestyle: 92 }}
                  variant="card"
                  onInspectDetails={handleInspectChemistry}
                />
              </div>

              {/* Raisonnement d'affinité IA transparent */}
              <div className="p-3 rounded-2xl bg-[#242139]/80 backdrop-blur-md border border-[#A77BFF]/20 mt-2.5 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-[#F58AC9] shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-[11px] font-semibold text-[#82E3B1]">Analyse Prédictive de Match</p>
                  <p className="text-[11px] text-[#C8C0D8] leading-tight">
                    {activeProfile.aiCompatibilityNote ||
                      'Partage de goûts musicaux alternatifs et affinité marquée pour les jeux coopératifs.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Barre d'actions interactives */}
          <div className="p-4 sm:p-5 bg-[#191827] border-t border-white/5 flex items-center justify-around gap-3">
            {/* Passer */}
            <button
              onClick={handlePass}
              className="w-14 h-14 rounded-2xl bg-[#242139] border border-white/10 text-[#C8C0D8] hover:text-rose-400 hover:border-rose-400/40 flex items-center justify-center transition-all transform active:scale-90"
              title="Passer"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Inviter à jouer */}
            <button
              onClick={handleInviteToGame}
              className="flex-1 py-3.5 px-4 rounded-2xl bg-[#242139] border border-[#48D9E6]/30 text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#48D9E6]/20 transition-all active:scale-95 shadow-md"
            >
              <Gamepad2 className="w-4 h-4 text-[#48D9E6]" />
              <span>Inviter à Jouer</span>
            </button>

            {/* Message direct */}
            <button
              onClick={handleDirectMessage}
              className="w-14 h-14 rounded-2xl bg-[#242139] border border-white/10 text-[#48D9E6] hover:border-[#48D9E6]/40 flex items-center justify-center transition-all transform active:scale-90"
              title="Message"
            >
              <MessageCircle className="w-5 h-5" />
            </button>

            {/* Étincelle / Like */}
            <button
              onClick={handleLike}
              className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#A77BFF] to-[#F58AC9] text-white shadow-xl shadow-[#F58AC9]/25 flex items-center justify-center transition-all transform active:scale-90 hover:scale-105"
              title="Envoyer une Étincelle"
            >
              <Heart className="w-6 h-6 fill-current" />
            </button>
          </div>
        </div>
      )}

      {/* Modal d'analyse approfondie de l'alchimie */}
      {chemistryModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#10101B]/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-[#191827] border border-[#A77BFF]/40 rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => setChemistryModalData(null)}
              className="absolute top-4 right-4 p-2 text-[#C8C0D8] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-bold text-[#F58AC9] uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Résonance Psychologique IA</span>
            </div>

            <h3 className="text-xl font-black text-white font-heading mb-1">
              {chemistryModalData.analysis.headline}
            </h3>
            <p className="text-xs text-[#82E3B1] font-bold mb-4">
              Score d'Alchimie Estimé : {chemistryModalData.analysis.score}%
            </p>

            <div className="p-4 rounded-2xl bg-[#242139] border border-white/5 space-y-3 mb-4">
              <p className="text-xs text-white/90 leading-relaxed">
                {chemistryModalData.analysis.deepAnalysis}
              </p>
              <div className="pt-2 border-t border-white/5">
                <span className="text-[10px] font-bold uppercase text-[#48D9E6] block mb-1">
                  Accroche Suggérée pour Briser la Glace
                </span>
                <p className="text-xs italic text-[#C8C0D8]">« {chemistryModalData.analysis.icebreaker} »</p>
              </div>
            </div>

            <button
              onClick={() => {
                setChemistryModalData(null);
                handleDirectMessage();
              }}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#A77BFF] to-[#F58AC9] text-white font-bold text-xs"
            >
              Utiliser l'Accroche & Écrire à {chemistryModalData.profile.firstName}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
