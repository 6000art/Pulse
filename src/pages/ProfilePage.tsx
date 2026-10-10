import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { updateProfile, generateAIProfile } from '../lib/api.ts';
import { generateGradientAvatar } from '../utils/avatarGenerator.ts';
import {
  UserCheck,
  ShieldCheck,
  Edit3,
  Sparkles,
  Gamepad2,
  MapPin,
  Heart,
  Camera,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { currentUser, setCurrentUser, showToast } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [isRegeneratingAI, setIsRegeneratingAI] = useState(false);

  // Champs modifiables
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [intent, setIntent] = useState(currentUser?.intent || 'everything');
  const [incognito, setIncognito] = useState(currentUser?.privacy?.incognito || false);
  const [showDistance, setShowDistance] = useState(currentUser?.privacy?.showDistance ?? true);

  if (!currentUser) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await updateProfile({
        bio,
        intent,
        privacy: {
          ...currentUser.privacy,
          incognito,
          showDistance,
        },
      });
      setCurrentUser(updated);
      setIsEditing(false);
      showToast({
        type: 'spark',
        title: 'Profil Mis à Jour',
        message: 'Vos modifications ont été enregistrées.',
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleAIRegenerateBio = async () => {
    setIsRegeneratingAI(true);
    try {
      const synthesized = await generateAIProfile({
        interests: currentUser.interests,
        gaming: currentUser.gamingFavorites,
        intent: currentUser.intent,
      });
      if (synthesized.bio) {
        setBio(synthesized.bio);
        showToast({
          type: 'spark',
          title: 'Bio IA Régénérée',
          message: 'Nouvelle biographie adaptée à vos passions en cours.',
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsRegeneratingAI(false);
    }
  };

  const [imgError, setImgError] = useState(false);

  // Génération de l'avatar par défaut avec dégradé radial #A77BFF / #F58AC9
  const defaultGradientSvg = generateGradientAvatar(
    currentUser.firstName || currentUser.email || currentUser.id || 'PULSE'
  );
  const defaultGradientDataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(defaultGradientSvg)}`;
  const avatarSrc = (!currentUser.avatar || imgError) ? defaultGradientDataUrl : currentUser.avatar;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* En-tête Hero du Profil */}
      <div className="relative rounded-3xl overflow-hidden bg-[#191827] border border-white/10 shadow-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          <div className="relative group">
            <img
              src={avatarSrc}
              alt={currentUser.firstName}
              onError={() => setImgError(true)}
              className="w-28 h-28 rounded-3xl object-cover border-3 border-[#A77BFF] shadow-xl bg-[#191827]"
            />
            {!currentUser.avatar && (
              <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-[#10101B]/80 text-[9px] font-bold text-[#F58AC9] border border-[#A77BFF]/30">
                Avatar IA
              </div>
            )}
            <div className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-[#82E3B1] text-[#10101B] text-[10px] font-black flex items-center gap-1 shadow-md">
              <UserCheck className="w-3 h-3" /> 18+
            </div>
          </div>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-2xl font-black font-heading text-white">
                  {currentUser.firstName} {currentUser.lastName || ''}
                </h2>
                <div className="flex items-center justify-center sm:justify-start gap-3 text-xs text-[#C8C0D8] mt-1">
                  <span>{currentUser.age} ans</span>
                  <span>•</span>
                  <span>{currentUser.pronouns || 'iel/ille'}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#48D9E6]" />
                    {currentUser.location}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsEditing(!isEditing)}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-2xl bg-[#242139] border border-white/10 text-xs font-semibold text-white hover:bg-[#242139]/80 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditing ? 'Annuler' : 'Modifier le Profil'}</span>
              </button>
            </div>

            {/* Badge d'intention */}
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#A77BFF]/15 border border-[#A77BFF]/30 text-[#A77BFF] text-xs font-semibold capitalize">
              <Sparkles className="w-3 h-3" />
              Priorité : {currentUser.intent === 'love' ? 'Amour & Dating' : currentUser.intent === 'friends' ? 'Amitiés' : currentUser.intent === 'gaming' ? 'Jeux Co-op' : 'Un peu de tout'}
            </div>

            {/* Bio */}
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed mt-4">
              {currentUser.bio}
            </p>
          </div>
        </div>
      </div>

      {/* Formulaire de modification */}
      {isEditing && (
        <form
          onSubmit={handleSaveProfile}
          className="p-6 rounded-3xl bg-[#191827] border border-[#A77BFF]/40 shadow-xl space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white font-heading">Modifier Votre Profil</h3>
            <button
              type="button"
              onClick={handleAIRegenerateBio}
              disabled={isRegeneratingAI}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#A77BFF] to-[#F58AC9] text-white text-[11px] font-bold shadow-sm"
            >
              <Sparkles className="w-3 h-3" />
              <span>{isRegeneratingAI ? 'Génération...' : 'Polissage IA de la Bio'}</span>
            </button>
          </div>

          <div>
            <label className="text-xs text-[#C8C0D8] mb-1 block">Biographie</label>
            <textarea
              rows={3}
              value={bio}
              onChange={e => setBio(e.target.value)}
              className="w-full bg-[#242139] border border-white/10 rounded-2xl p-3 text-xs text-white focus:outline-none focus:border-[#A77BFF]/50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-[#C8C0D8] mb-1 block">Intention Principale</label>
              <select
                value={intent}
                onChange={e => setIntent(e.target.value as any)}
                className="w-full bg-[#242139] border border-white/10 rounded-2xl p-2.5 text-xs text-white focus:outline-none"
              >
                <option value="everything">Un peu de tout (Amour, Amis, Jeux)</option>
                <option value="love">Dating & Étincelles Amoureuses</option>
                <option value="friends">Amitiés & Communauté</option>
                <option value="gaming">Jeux Vidéo & Parties Multijoueur</option>
                <option value="activities">Activités & Événements Réels</option>
              </select>
            </div>

            <div className="space-y-2 pt-4">
              <label className="flex items-center gap-2 text-xs text-[#C8C0D8] cursor-pointer">
                <input
                  type="checkbox"
                  checked={incognito}
                  onChange={e => setIncognito(e.target.checked)}
                  className="accent-[#A77BFF] rounded"
                />
                <span>Mode Incognito (Visible uniquement par les étincelles mutuelles)</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-[#C8C0D8] cursor-pointer">
                <input
                  type="checkbox"
                  checked={showDistance}
                  onChange={e => setShowDistance(e.target.checked)}
                  className="accent-[#A77BFF] rounded"
                />
                <span>Afficher la distance approximative</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-2xl bg-[#242139] text-[#C8C0D8] text-xs font-semibold"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-2xl bg-gradient-to-r from-[#A77BFF] to-[#F58AC9] text-white text-xs font-bold shadow-md"
            >
              Enregistrer
            </button>
          </div>
        </form>
      )}

      {/* Passions et Gaming */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Passions */}
        <div className="p-6 rounded-3xl bg-[#191827] border border-white/10 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#A77BFF] uppercase tracking-wider">
            <Heart className="w-4 h-4" />
            <span>Passions & Centres d'Intérêt</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {currentUser.interests.map((interest, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-xl bg-[#242139] border border-white/5 text-xs text-white"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>

        {/* Jeux favoris */}
        <div className="p-6 rounded-3xl bg-[#191827] border border-white/10 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#48D9E6] uppercase tracking-wider">
            <Gamepad2 className="w-4 h-4" />
            <span>Jeux & Esprit Co-op</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {currentUser.gamingFavorites.map((game, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-xl bg-[#242139] border border-white/5 text-xs text-white"
              >
                {game}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Carte Confiance & Sécurité */}
      <div className="p-6 rounded-3xl bg-[#191827] border border-white/5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#82E3B1]/20 border border-[#82E3B1]/40 flex items-center justify-center text-[#82E3B1]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Confiance, Sécurité & Vérification 18+</h4>
            <p className="text-xs text-[#C8C0D8]/70">Membre 18+ Vérifié. Vos coordonnées privées ne sont jamais divulguées.</p>
          </div>
        </div>
        <span className="text-xs font-bold text-[#82E3B1] px-3 py-1 rounded-full bg-[#82E3B1]/10 border border-[#82E3B1]/20">
          Actif
        </span>
      </div>
    </div>
  );
};
