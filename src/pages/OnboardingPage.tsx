import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { getAIOnboardingReply, generateAIProfile, updateProfile } from '../lib/api.ts';
import {
  Sparkles,
  Send,
  Mic,
  MicOff,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  ShieldCheck,
  Edit3,
  Flame,
  Gamepad2,
  Calendar,
  X,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  suggestedReplies?: string[];
  timestamp: string;
}

export const OnboardingPage: React.FC = () => {
  const { currentUser, navigate, showToast, refreshUserData } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [totalSteps] = useState(6);
  const [isTyping, setIsTyping] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [collectedAnswers, setCollectedAnswers] = useState<Record<string, any>>({
    name: currentUser?.firstName || 'Explorateur',
    age: 23,
    interests: [],
    gaming: [],
    music: [],
    vibe: '',
    intent: 'everything',
  });

  // Profil généré par l'IA
  const [generatedProfile, setGeneratedProfile] = useState<any | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initialGreeting: ChatMessage = {
      id: 'msg-init',
      role: 'assistant',
      content: "Hello ! Bienvenue sur PULSE. Je suis ton compagnon de vibe numérique. Au lieu d'un formulaire austère, discutons quelques instants pour cerner ta vraie personnalité. Qu'est-ce qui t'amène ici ?",
      suggestedReplies: [
        'Étincelle amoureuse & dating',
        'Vraies amitiés sincères',
        'Partenaires de jeux co-op',
        'Activités & sorties insolites',
        'Un peu de tout ça !',
      ],
      timestamp: 'À l’instant',
    };
    setMessages([initialGreeting]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      role: 'user',
      content: textToSend.trim(),
      timestamp: 'À l’instant',
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    const nextAnswers = { ...collectedAnswers };
    if (currentStep === 1) nextAnswers.intent = textToSend;
    if (currentStep === 2) nextAnswers.ageAndPronouns = textToSend;
    if (currentStep === 3) nextAnswers.interests = [...(nextAnswers.interests || []), textToSend];
    if (currentStep === 4) nextAnswers.gaming = [...(nextAnswers.gaming || []), textToSend];
    if (currentStep === 5) nextAnswers.musicAndVibe = textToSend;
    setCollectedAnswers(nextAnswers);

    const nextStepNum = currentStep + 1;
    setCurrentStep(nextStepNum);

    if (nextStepNum > totalSteps) {
      setTimeout(async () => {
        setIsTyping(false);
        setIsSynthesizing(true);
        try {
          const synthesis = await generateAIProfile(nextAnswers);
          setGeneratedProfile(synthesis);
        } catch (e) {
          console.error('Erreur génération profil:', e);
        } finally {
          setIsSynthesizing(false);
        }
      }, 1200);
      return;
    }

    try {
      const historyPayload = [...messages, userMsg].map(m => ({
        role: m.role,
        content: m.content,
      }));

      const reply = await getAIOnboardingReply(historyPayload, nextStepNum);

      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [
          ...prev,
          {
            id: `msg-ai-${Date.now()}`,
            role: 'assistant',
            content: reply.message || 'Raconte-moi un peu ton ambiance de week-end préférée !',
            suggestedReplies: reply.suggestedReplies || ['Soirée jeux vidéo', 'Concert & verres', 'Atelier créatif & brunch'],
            timestamp: 'À l’instant',
          },
        ]);
      }, 800);
    } catch (err) {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: `msg-ai-err-${Date.now()}`,
          role: 'assistant',
          content: 'Quels genres de jeux ou d’activités te passionnent le plus ?',
          suggestedReplies: ['Quiz & Blind tests', 'Escape Games Co-op', 'Cuisine & Vins', 'Jeux de Cartes Sociaux'],
          timestamp: 'À l’instant',
        },
      ]);
    }
  };

  const handleSkip = () => {
    handleSendMessage('Passer la question / Laisser libre');
  };

  const handleApproveProfile = async () => {
    if (!generatedProfile) return;

    try {
      await updateProfile({
        bio: generatedProfile.bio,
        avatar: generatedProfile.dynamicAvatar || currentUser?.avatar,
        coverImage: generatedProfile.dynamicBanner || currentUser?.coverImage,
        interests: generatedProfile.highlightTags || ['Jeux Vidéo', 'Musique', 'Sorties'],
        gamingFavorites: generatedProfile.recommendedGames || ['Quiz Alchimie Pulse'],
        activityPreferences: generatedProfile.recommendedActivities || ['Atelier Culinaire'],
        onboardingComplete: true,
      });

      await refreshUserData();

      showToast({
        type: 'spark',
        title: 'Profil Validé !',
        message: 'Ton profil personnalisé est en ligne. Bienvenue sur PULSE !',
      });

      navigate('/app');
    } catch (e) {
      console.error(e);
      showToast({
        type: 'warning',
        title: 'Erreur d’enregistrement',
        message: 'Impossible de sauvegarder le profil pour l’instant.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#10101B] text-white flex flex-col relative overflow-hidden">
      {/* Lueur d'ambiance */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#A77BFF]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[400px] h-[400px] bg-[#F58AC9]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Barre supérieure */}
      <header className="relative z-20 px-6 py-4 border-b border-white/5 flex items-center justify-between max-w-4xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#A77BFF] to-[#F58AC9] p-[1.5px]">
              <div className="w-full h-full bg-[#10101B] rounded-xl flex items-center justify-center font-bold text-xs gradient-text">
                P
              </div>
            </div>
            <span className="font-heading font-extrabold text-sm tracking-wider">PULSE</span>
          </button>
          <span className="text-xs text-[#C8C0D8]/60">• Onboarding avec l'IA</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#82E3B1]">
            <ShieldCheck className="w-4 h-4" />
            <span>Âge 18+ Vérifié</span>
          </div>
          <button
            onClick={() => navigate('/app')}
            className="text-xs text-[#C8C0D8]/70 hover:text-white transition-colors"
          >
            Sauvegarder & Quitter
          </button>
        </div>
      </header>

      {/* Barre de progression */}
      <div className="relative z-20 w-full max-w-4xl mx-auto px-6 pt-3">
        <div className="flex items-center justify-between text-[11px] text-[#C8C0D8]/70 mb-1.5">
          <span>{generatedProfile ? 'Synthèse & Revue' : `Étape ${Math.min(currentStep, totalSteps)} sur ${totalSteps}`}</span>
          <span>{generatedProfile ? '100% Prêt' : `${Math.round((Math.min(currentStep, totalSteps) / totalSteps) * 100)}% Complété`}</span>
        </div>
        <div className="w-full h-1.5 bg-[#191827] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#A77BFF] to-[#F58AC9] transition-all duration-500 rounded-full"
            style={{ width: `${generatedProfile ? 100 : (Math.min(currentStep, totalSteps) / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Dialogue principal */}
      <main className="relative z-10 flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 flex flex-col justify-between">
        {!generatedProfile ? (
          <>
            {/* Orbe lumineux IA */}
            <div className="flex flex-col items-center justify-center py-4 text-center">
              <div className="relative mb-3">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#A77BFF] via-[#F58AC9] to-[#48D9E6] p-[2px] shadow-lg shadow-[#A77BFF]/30 animate-pulse">
                  <div className="w-full h-full bg-[#10101B] rounded-full flex items-center justify-center">
                    <Sparkles className="w-7 h-7 text-[#F58AC9]" />
                  </div>
                </div>
                <div className="absolute -inset-2 bg-gradient-to-r from-[#A77BFF] to-[#F58AC9] rounded-full blur-md opacity-30 -z-10 animate-spin duration-1000" />
              </div>
              <h2 className="text-lg font-bold font-heading text-white">Assistant IA PULSE</h2>
              <p className="text-xs text-[#C8C0D8]/70">À l'écoute de ce qui fait vibrer votre univers</p>
            </div>

            {/* Historique des bulles */}
            <div className="flex-1 overflow-y-auto space-y-4 max-h-[50vh] pr-2 mb-4">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} space-y-2`}
                >
                  <div className="flex items-start gap-2.5 max-w-[85%] sm:max-w-[75%]">
                    {msg.role === 'assistant' && (
                      <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#A77BFF] to-[#F58AC9] flex items-center justify-center text-white shrink-0 mt-1 shadow-sm">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <div
                      className={`p-4 rounded-3xl text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-[#A77BFF] to-[#F58AC9] text-white rounded-tr-none shadow-md'
                          : 'bg-[#191827] border border-white/10 text-white rounded-tl-none shadow-lg'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>

                  {/* Pastilles de réponses suggérées */}
                  {msg.role === 'assistant' && msg.suggestedReplies && (
                    <div className="flex flex-wrap gap-2 pl-9 pt-1">
                      {msg.suggestedReplies.map((chip, i) => (
                        <button
                          key={i}
                          onClick={() => handleSendMessage(chip)}
                          className="px-3.5 py-1.5 rounded-full bg-[#242139]/80 border border-[#A77BFF]/30 text-xs text-[#C8C0D8] hover:text-white hover:border-[#F58AC9]/50 hover:bg-[#A77BFF]/20 transition-all active:scale-95"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 pl-9 text-[#C8C0D8]/70 text-xs">
                  <div className="w-2 h-2 rounded-full bg-[#A77BFF] animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-[#F58AC9] animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-[#48D9E6] animate-bounce [animation-delay:0.4s]" />
                  <span className="ml-1 text-[11px]">L'IA PULSE réfléchit...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Champ de saisie et commandes */}
            <div className="pt-2">
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleSendMessage(inputText);
                }}
                className="relative flex items-center bg-[#191827] border border-white/10 rounded-2xl p-1.5 focus-within:border-[#A77BFF]/50 transition-colors shadow-xl"
              >
                <button
                  type="button"
                  onClick={() => {
                    setIsVoiceActive(!isVoiceActive);
                    showToast({
                      type: 'info',
                      title: isVoiceActive ? 'Mode vocal mis en pause' : 'Mode vocal simulé',
                      message: isVoiceActive
                        ? 'Arrêt de la capture vocale.'
                        : 'Simulation de dictée vocale vers le chat.',
                    });
                    if (!isVoiceActive) {
                      setInputText('J’adore les blind tests musicaux et la musique électronique en live !');
                    }
                  }}
                  className={`p-2.5 rounded-xl transition-colors ${
                    isVoiceActive ? 'bg-[#F58AC9] text-white animate-pulse' : 'text-[#C8C0D8]/70 hover:text-white hover:bg-[#242139]'
                  }`}
                  title="Saisie Vocale"
                >
                  {isVoiceActive ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </button>

                <input
                  type="text"
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  placeholder="Écris ta réponse ou clique sur une suggestion..."
                  className="flex-1 bg-transparent px-3 py-2 text-sm text-white placeholder-[#C8C0D8]/40 focus:outline-none"
                />

                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-[#A77BFF] to-[#F58AC9] text-white disabled:opacity-30 disabled:pointer-events-none hover:opacity-90 active:scale-95 transition-all shadow-md"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

              <div className="flex items-center justify-between px-2 pt-2 text-[11px] text-[#C8C0D8]/60">
                <button onClick={handleSkip} className="hover:text-white transition-colors">
                  Passer cette question
                </button>
                <span>Traitement sécurisé côté serveur</span>
              </div>
            </div>
          </>
        ) : (
          /* Carte de validation du profil synthétisé */
          <div className="max-w-xl mx-auto w-full bg-[#191827] border border-[#A77BFF]/30 rounded-3xl p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#82E3B1]/15 border border-[#82E3B1]/30 text-[#82E3B1] text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#82E3B1]" />
              Profil IA Prêt
            </div>

            <h3 className="text-2xl font-black text-white font-heading mb-1">
              Voici comment la communauté te verra.
            </h3>
            {/* Aperçu Avatar et Bannière Dynamiques */}
            <div className="relative mb-6 rounded-2xl overflow-hidden border border-white/10">
              <div
                className="h-24 w-full"
                style={{
                  background: generatedProfile.dynamicBanner ||
                    'linear-gradient(135deg, #A77BFF 0%, #F58AC9 50%, #48D9E6 100%)',
                }}
              />
              <div className="p-4 pt-0 bg-[#242139]/90 flex items-end gap-3.5 -mt-8">
                <img
                  src={
                    generatedProfile.dynamicAvatar ||
                    `data:image/svg+xml;utf8,${encodeURIComponent(
                      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#A77BFF"/><text x="50" y="55" font-family="sans-serif" font-size="28" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">P</text></svg>'
                    )}`
                  }
                  alt="Avatar dynamique"
                  className="w-16 h-16 rounded-2xl border-2 border-white object-cover shadow-xl bg-[#10101B]"
                />
                <div className="pb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-white">
                      {currentUser?.firstName || 'Explorateur'}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#82E3B1]/20 text-[#82E3B1] font-semibold border border-[#82E3B1]/30">
                      18+ Vérifié
                    </span>
                  </div>
                  <span className="text-[11px] text-[#C8C0D8]">Avatar dynamique généré automatiquement</span>
                </div>
              </div>
            </div>

            {/* Slogan */}
            <div className="p-4 rounded-2xl bg-[#242139]/80 border border-white/5 mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-semibold text-[#A77BFF] uppercase tracking-wider">
                  Slogan Personnel
                </span>
                <button
                  onClick={() => setEditingField(editingField === 'tagline' ? null : 'tagline')}
                  className="text-xs text-[#C8C0D8] hover:text-white flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3" /> Modifier
                </button>
              </div>
              {editingField === 'tagline' ? (
                <input
                  type="text"
                  value={generatedProfile.tagline}
                  onChange={e => setGeneratedProfile({ ...generatedProfile, tagline: e.target.value })}
                  className="w-full bg-[#10101B] border border-white/20 rounded-xl px-3 py-1.5 text-sm text-white focus:outline-none"
                />
              ) : (
                <p className="text-sm font-bold text-white italic">« {generatedProfile.tagline} »</p>
              )}
            </div>

            {/* Bio */}
            <div className="p-4 rounded-2xl bg-[#242139]/80 border border-white/5 mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-semibold text-[#F58AC9] uppercase tracking-wider">
                  Biographie Synthétisée
                </span>
                <button
                  onClick={() => setEditingField(editingField === 'bio' ? null : 'bio')}
                  className="text-xs text-[#C8C0D8] hover:text-white flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3" /> Modifier
                </button>
              </div>
              {editingField === 'bio' ? (
                <textarea
                  rows={3}
                  value={generatedProfile.bio}
                  onChange={e => setGeneratedProfile({ ...generatedProfile, bio: e.target.value })}
                  className="w-full bg-[#10101B] border border-white/20 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                />
              ) : (
                <p className="text-xs sm:text-sm text-white/90 leading-relaxed">{generatedProfile.bio}</p>
              )}
            </div>

            {/* Tags de passions */}
            <div className="mb-4">
              <span className="text-[11px] font-semibold text-[#C8C0D8] uppercase tracking-wider block mb-2">
                Passions & Centres d'Intérêt
              </span>
              <div className="flex flex-wrap gap-2">
                {generatedProfile.highlightTags?.map((tag: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl bg-[#242139] border border-white/10 text-xs font-medium text-white"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Jeux et activités recommandés */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <div className="p-3.5 rounded-2xl bg-[#10101B]/80 border border-white/5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#48D9E6] mb-1.5">
                  <Gamepad2 className="w-3.5 h-3.5" />
                  <span>Jeux Conseillés</span>
                </div>
                <ul className="text-xs text-[#C8C0D8] space-y-1">
                  {generatedProfile.recommendedGames?.map((g: string, i: number) => (
                    <li key={i}>• {g}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#10101B]/80 border border-white/5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#82E3B1] mb-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Sorties Idéales</span>
                </div>
                <ul className="text-xs text-[#C8C0D8] space-y-1">
                  {generatedProfile.recommendedActivities?.map((a: string, i: number) => (
                    <li key={i}>• {a}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleApproveProfile}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#A77BFF] to-[#F58AC9] text-white font-bold text-sm shadow-xl shadow-[#A77BFF]/25 hover:opacity-90 active:scale-95 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                Valider & Découvrir l'App
              </button>
              <button
                onClick={() => {
                  setGeneratedProfile(null);
                  setCurrentStep(1);
                  setMessages([
                    {
                      id: 'msg-restart',
                      role: 'assistant',
                      content: "C'est reparti ! Quel type d'énergie et de connexion recherches-tu avant tout ?",
                      suggestedReplies: ['Dating & Étincelles', 'Amis gamers', 'Sorties food & vin'],
                      timestamp: 'À l’instant',
                    },
                  ]);
                }}
                className="px-5 py-3.5 rounded-2xl bg-[#242139] border border-white/10 text-[#C8C0D8] hover:text-white font-semibold text-xs transition-colors"
              >
                Recommencer le Chat
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
