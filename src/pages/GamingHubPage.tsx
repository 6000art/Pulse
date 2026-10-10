import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext.tsx';
import { Game, GameRoom } from '../types/index.ts';
import { fetchGames, fetchGameRooms, createGameRoom, joinGameRoom, sendGameAction } from '../lib/api.ts';
import {
  Gamepad2,
  Sparkles,
  Flame,
  Music,
  Coins,
  Plus,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Trophy,
} from 'lucide-react';

export const GamingHubPage: React.FC = () => {
  const { showToast, navigate } = useApp();
  const [gamesList, setGamesList] = useState<Game[]>([]);
  const [roomsList, setRoomsList] = useState<GameRoom[]>([]);
  const [activeCategory, setActiveCategory] = useState<'all' | 'quiz' | 'social' | 'cards'>('all');

  // Salon actif
  const [activeRoom, setActiveRoom] = useState<GameRoom | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<any>(null);

  // Modal création de salon
  const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false);
  const [selectedGameIdToCreate, setSelectedGameIdToCreate] = useState<string>('game-compatibility');
  const [isPrivateRoom, setIsPrivateRoom] = useState(false);

  // Questions en français pour les 3 moteurs multijoueurs
  const compatibilityQuestions = [
    {
      q: 'Un vendredi soir spontané, quel est ton programme idéal ?',
      options: [
        'Ramen tard le soir dans un petit resto intime',
        'Session de jeu vidéo co-op avec thé bien chaud',
        'DJ set secret sur un rooftop entre amis',
        'Flâner dans une librairie avec un café glacé',
      ],
    },
    {
      q: 'Face à une énigme coriace ou un escape game, ton réflexe est :',
      options: [
        'Analyser méthodiquement tous les indices cachés',
        'Filer devant et tester tous les mécanismes avec enthousiasme',
        'Garder l’équipe calme et dédramatiser dans le rire',
        'Partager des théories créatives et hors du commun',
      ],
    },
    {
      q: 'Ton élément réconfortant non négociable au quotidien :',
      options: [
        'Une playlist vinyle ou lo-fi minutieusement choisie',
        'Des viennoiseries artisanales & un café de spécialité',
        'Un sweat oversize et une série de science-fiction culte',
        'De grandes discussions philosophiques nocturnes',
      ],
    },
  ];

  const wouldYouRatherQuestions = [
    {
      q: 'Tu préfères avoir des pass gratuits et illimités pour tous les concerts du monde à vie OU un accès illimité et gratuit à tous les cafés cosy du monde ?',
      optionA: 'Concerts & Festivals Illimités',
      optionB: 'Cafés Cosy & Pâtisseries Illimités',
      statA: 42,
      statB: 58,
    },
    {
      q: 'Tu préfères te retrouver coincé(e) dans un escape game futuriste à deux OU dans un train panoramique en retard dans les Alpes suisses ?',
      optionA: 'Escape Game Futuriste à Deux',
      optionB: 'Train Panoramique Alpin',
      statA: 36,
      statB: 64,
    },
    {
      q: 'Tu préfères ne jouer qu’à des jeux vidéo coopératifs OU ne jouer qu’à des jeux de société compétitifs mais conviviaux ?',
      optionA: '100% Jeux Vidéo Co-Op',
      optionB: '100% Jeux de Société Amicaux',
      statA: 71,
      statB: 29,
    },
  ];

  const musicTriviaQuestions = [
    {
      genre: 'Électronique / Synthwave',
      q: 'Quel duo français légendaire a sorti l’album culte "Discovery" en 2001 ?',
      options: ['Justice', 'Daft Punk', 'Air', 'Cassius'],
      correct: 1,
      trackTitle: 'Digital Love / Harder Better Faster',
    },
    {
      genre: 'Indie & Rock Alternatif',
      q: 'Quel groupe de rock a signé les hymnes mondiaux "Someday" et "Last Nite" ?',
      options: ['The Strokes', 'Arctic Monkeys', 'Phoenix', 'Interpol'],
      correct: 0,
      trackTitle: 'Is This It',
    },
    {
      genre: 'Jazz Vocal & Neo-Soul',
      q: 'Quelle artiste contemporaine a enchanté la scène en mêlant bedroom pop et arrangements de jazz orchestral ?',
      options: ['Laufey', 'Norah Jones', 'Arlo Parks', 'Joy Crookes'],
      correct: 0,
      trackTitle: 'Bewitched',
    },
  ];

  const loadData = async () => {
    try {
      const g = await fetchGames();
      setGamesList(g);
      const r = await fetchGameRooms();
      setRoomsList(r);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const room = await createGameRoom(selectedGameIdToCreate, isPrivateRoom);
      setActiveRoom(room);
      setIsCreateRoomOpen(false);
      showToast({
        type: 'spark',
        title: 'Salon Créé !',
        message: `Votre salon #${room.code} est ouvert. Prêt pour les joueurs !`,
      });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleJoinRoom = async (roomId: string) => {
    try {
      const room = await joinGameRoom(roomId);
      setActiveRoom(room);
      showToast({
        type: 'info',
        title: 'Salon Rejoint',
        message: `Vous êtes entré(e) dans ${room.gameTitle} #${room.code}`,
      });
      loadData();
    } catch (err: any) {
      showToast({
        type: 'warning',
        title: 'Salon Complet',
        message: err.message || 'Impossible de rejoindre le salon.',
      });
    }
  };

  const handleAnswerSubmit = async (answerVal: any) => {
    if (!activeRoom) return;
    setSelectedAnswer(answerVal);
    const updated = await sendGameAction(activeRoom.id, {
      action: 'answer',
      questionIndex: activeRoom.currentQuestionIndex,
      answer: answerVal,
    });
    setActiveRoom(updated);

    if (activeRoom.currentQuestionIndex >= 2) {
      confetti({
        particleCount: 70,
        spread: 60,
        colors: ['#A77BFF', '#F58AC9', '#48D9E6'],
      });
    }
  };

  const handleNextQuestion = async () => {
    if (!activeRoom) return;
    setSelectedAnswer(null);
    const updated = await sendGameAction(activeRoom.id, {
      action: 'next_question',
    });
    setActiveRoom(updated);
  };

  const filteredGames =
    activeCategory === 'all' ? gamesList : gamesList.filter(g => g.category === activeCategory);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">
      {/* Moteur de jeu actif en plein écran / superposition */}
      {activeRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#10101B]/85 backdrop-blur-xl animate-in fade-in">
          <div className="relative w-full max-w-xl bg-[#191827] border border-[#A77BFF]/40 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden text-center">
            {/* En-tête du salon */}
            <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-6">
              <div className="text-left">
                <span className="text-[10px] font-bold text-[#F58AC9] uppercase tracking-wider">
                  Session Multijoueur en Direct
                </span>
                <h3 className="text-base font-bold text-white font-heading">{activeRoom.gameTitle}</h3>
                <span className="text-xs text-[#C8C0D8]/70">Code de Salon : #{activeRoom.code}</span>
              </div>
              <button
                onClick={() => {
                  setActiveRoom(null);
                  setSelectedAnswer(null);
                }}
                className="px-3 py-1.5 rounded-xl bg-[#242139] text-xs font-semibold text-[#C8C0D8] hover:text-white"
              >
                Quitter le Salon
              </button>
            </div>

            {/* Joueurs dans le salon */}
            <div className="flex items-center justify-center gap-6 mb-6">
              {activeRoom.players.map((p, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className="relative">
                    <img
                      src={p.avatar}
                      alt={p.name}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-[#A77BFF]"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#82E3B1] rounded-full border border-[#10101B]" />
                  </div>
                  <span className="text-xs font-bold text-white mt-1.5">{p.name}</span>
                  <span className="text-[10px] text-[#F58AC9] font-semibold">{p.score} pts</span>
                </div>
              ))}
            </div>

            {/* JEU 1 : Quiz Alchimie */}
            {activeRoom.gameId === 'game-compatibility' && (
              <div className="space-y-4">
                {activeRoom.currentQuestionIndex < compatibilityQuestions.length ? (
                  <>
                    <div className="inline-block px-3 py-1 rounded-full bg-[#A77BFF]/20 text-[#A77BFF] text-xs font-bold mb-1">
                      Question {activeRoom.currentQuestionIndex + 1} sur {compatibilityQuestions.length}
                    </div>
                    <h4 className="text-base sm:text-lg font-bold text-white font-heading">
                      {compatibilityQuestions[activeRoom.currentQuestionIndex].q}
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3">
                      {compatibilityQuestions[activeRoom.currentQuestionIndex].options.map((opt, i) => {
                        const isChosen = selectedAnswer === i;
                        return (
                          <button
                            key={i}
                            onClick={() => handleAnswerSubmit(i)}
                            className={`p-3.5 rounded-2xl text-xs font-semibold text-left transition-all ${
                              isChosen
                                ? 'bg-gradient-to-r from-[#A77BFF] to-[#F58AC9] text-white shadow-lg shadow-[#A77BFF]/30 scale-102'
                                : 'bg-[#242139] text-[#C8C0D8] hover:text-white hover:bg-[#242139]/80 border border-white/5'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {selectedAnswer !== null && (
                      <button
                        onClick={handleNextQuestion}
                        className="mt-4 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#A77BFF] to-[#F58AC9] text-white text-xs font-bold"
                      >
                        Question Suivante
                      </button>
                    )}
                  </>
                ) : (
                  <div className="py-6 space-y-4">
                    <Trophy className="w-12 h-12 text-[#82E3B1] mx-auto animate-bounce" />
                    <h4 className="text-2xl font-black text-white font-heading">
                      95% d'Alchimie Débloquée !
                    </h4>
                    <p className="text-xs text-[#C8C0D8] max-w-sm mx-auto">
                      Vos réponses intuitives concordent sur 3/3 dimensions clés. Vous avez gagné 60 jetons de connexion PULSE !
                    </p>
                    <button
                      onClick={() => {
                        setActiveRoom(null);
                        navigate('/app/messages');
                      }}
                      className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#A77BFF] to-[#F58AC9] text-white text-xs font-bold"
                    >
                      Discuter avec Elena
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* JEU 2 : Tu Préfères */}
            {activeRoom.gameId === 'game-would-you-rather' && (
              <div className="space-y-4">
                {activeRoom.currentQuestionIndex < wouldYouRatherQuestions.length ? (
                  <>
                    <h4 className="text-base sm:text-lg font-bold text-white font-heading">
                      {wouldYouRatherQuestions[activeRoom.currentQuestionIndex].q}
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
                      <button
                        onClick={() => handleAnswerSubmit('A')}
                        className={`p-5 rounded-2xl text-xs font-bold transition-all ${
                          selectedAnswer === 'A'
                            ? 'bg-[#A77BFF] text-white'
                            : 'bg-[#242139] text-white hover:border-[#A77BFF]/50 border border-white/5'
                        }`}
                      >
                        <p className="text-sm font-extrabold mb-1">Option A</p>
                        <p>{wouldYouRatherQuestions[activeRoom.currentQuestionIndex].optionA}</p>
                        {selectedAnswer && (
                          <span className="block mt-2 text-[#82E3B1] font-bold">
                            {wouldYouRatherQuestions[activeRoom.currentQuestionIndex].statA}% ont choisi ceci
                          </span>
                        )}
                      </button>

                      <button
                        onClick={() => handleAnswerSubmit('B')}
                        className={`p-5 rounded-2xl text-xs font-bold transition-all ${
                          selectedAnswer === 'B'
                            ? 'bg-[#F58AC9] text-white'
                            : 'bg-[#242139] text-white hover:border-[#F58AC9]/50 border border-white/5'
                        }`}
                      >
                        <p className="text-sm font-extrabold mb-1">Option B</p>
                        <p>{wouldYouRatherQuestions[activeRoom.currentQuestionIndex].optionB}</p>
                        {selectedAnswer && (
                          <span className="block mt-2 text-[#82E3B1] font-bold">
                            {wouldYouRatherQuestions[activeRoom.currentQuestionIndex].statB}% ont choisi ceci
                          </span>
                        )}
                      </button>
                    </div>

                    {selectedAnswer && (
                      <button
                        onClick={handleNextQuestion}
                        className="mt-4 px-6 py-2.5 rounded-2xl bg-white text-[#10101B] font-bold text-xs"
                      >
                        Dilemme Suivant
                      </button>
                    )}
                  </>
                ) : (
                  <div className="py-6 space-y-4">
                    <Sparkles className="w-10 h-10 text-[#F58AC9] mx-auto" />
                    <h4 className="text-xl font-black text-white font-heading">
                      Manche de Dilemmes Terminée !
                    </h4>
                    <p className="text-xs text-[#C8C0D8]">
                      Les deux joueurs ont répondu à tous les dilemmes nocturnes.
                    </p>
                    <button
                      onClick={() => setActiveRoom(null)}
                      className="px-6 py-2.5 rounded-2xl bg-[#242139] text-white font-bold text-xs"
                    >
                      Retour au Salon
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* JEU 3 : Blind Test Musical */}
            {activeRoom.gameId === 'game-music-blind-test' && (
              <div className="space-y-4">
                {activeRoom.currentQuestionIndex < musicTriviaQuestions.length ? (
                  <>
                    <div className="p-4 rounded-2xl bg-[#10101B] border border-[#48D9E6]/30 mb-2">
                      <div className="flex items-center justify-between text-xs text-[#48D9E6] font-bold mb-2">
                        <span>Genre : {musicTriviaQuestions[activeRoom.currentQuestionIndex].genre}</span>
                        <span>Extrait sonore en lecture...</span>
                      </div>
                      <div className="h-8 flex items-center justify-center gap-1">
                        {[40, 70, 30, 90, 60, 80, 50, 95, 30, 65, 85, 45].map((h, i) => (
                          <div
                            key={i}
                            className="w-1.5 bg-gradient-to-t from-[#48D9E6] to-[#A77BFF] rounded-full animate-pulse"
                            style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }}
                          />
                        ))}
                      </div>
                    </div>

                    <h4 className="text-base font-bold text-white font-heading">
                      {musicTriviaQuestions[activeRoom.currentQuestionIndex].q}
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                      {musicTriviaQuestions[activeRoom.currentQuestionIndex].options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => handleAnswerSubmit(i)}
                          className={`p-3.5 rounded-2xl text-xs font-semibold transition-all ${
                            selectedAnswer === i
                              ? i === musicTriviaQuestions[activeRoom.currentQuestionIndex].correct
                                ? 'bg-[#82E3B1] text-[#10101B] font-bold'
                                : 'bg-rose-500 text-white font-bold'
                              : 'bg-[#242139] text-[#C8C0D8] hover:text-white'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>

                    {selectedAnswer !== null && (
                      <button
                        onClick={handleNextQuestion}
                        className="mt-4 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#A77BFF] to-[#F58AC9] text-white text-xs font-bold"
                      >
                        Morceau Suivant
                      </button>
                    )}
                  </>
                ) : (
                  <div className="py-6 space-y-4">
                    <Music className="w-12 h-12 text-[#48D9E6] mx-auto animate-pulse" />
                    <h4 className="text-2xl font-black text-white font-heading">
                      Harmonie Musicale Vérifiée !
                    </h4>
                    <button
                      onClick={() => setActiveRoom(null)}
                      className="px-6 py-2.5 rounded-2xl bg-[#242139] text-white font-bold text-xs"
                    >
                      Retour au Hub Jeux
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* JEU 4 : Poker Social (Sans Argent Réel) */}
            {activeRoom.gameId === 'game-social-poker' && (
              <div className="py-6 space-y-4">
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-emerald-900/40 border border-emerald-500/30">
                  <Coins className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                  <h4 className="text-base font-bold text-white">Table Hold'em Néon Social</h4>
                  <p className="text-xs text-[#C8C0D8] mt-1">
                    Jetons Communautaires Gratuits : 1 500 JETONS PULSE. Politique stricte de zéro enjeu financier.
                  </p>
                </div>
                <button
                  onClick={() => {
                    showToast({
                      type: 'spark',
                      title: 'Main Gagnée !',
                      message: 'Vous remportez 300 jetons sociaux avec un Full aux As !',
                    });
                    setActiveRoom(null);
                  }}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#A77BFF] to-[#F58AC9] text-white font-bold text-xs"
                >
                  Jouer une Main Gratuite
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* En-tête et bouton Créer un salon */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black font-heading text-white">Salon de Jeux Multijoueur</h2>
          <p className="text-xs text-[#C8C0D8]/70">
            De véritables sessions synchronisées. Connectez-vous par le rire, la stratégie et la découverte mutuelle.
          </p>
        </div>

        <button
          onClick={() => setIsCreateRoomOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#A77BFF] to-[#F58AC9] text-white text-xs font-bold shadow-lg shadow-[#A77BFF]/25 hover:opacity-95 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Créer un Salon de Jeu</span>
        </button>
      </div>

      {/* Catégories de jeux */}
      <div className="flex items-center gap-2">
        {[
          { id: 'all', label: 'Toutes les Expériences' },
          { id: 'quiz', label: 'Quiz & Blind Tests' },
          { id: 'social', label: 'Jeux Sociaux & Co-op' },
          { id: 'cards', label: 'Cartes à Points (Gratuit)' },
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id as any)}
            className={`px-4 py-2 rounded-2xl text-xs font-semibold transition-all ${
              activeCategory === cat.id
                ? 'bg-[#242139] text-white border border-[#A77BFF]/40'
                : 'bg-[#191827] text-[#C8C0D8] hover:text-white border border-white/5'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Liste des salons en direct */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#82E3B1] animate-ping" />
            Salons Ouverts en Direct ({roomsList.length})
          </h3>
          <button onClick={loadData} className="text-xs text-[#C8C0D8] hover:text-white flex items-center gap-1">
            <RefreshCw className="w-3 h-3" /> Actualiser
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {roomsList.map(r => (
            <div
              key={r.id}
              className="p-4 rounded-3xl bg-[#191827] border border-white/10 hover:border-[#A77BFF]/40 transition-all flex items-center justify-between gap-3 shadow-md"
            >
              <div className="flex items-center gap-3">
                <img
                  src={r.hostAvatar}
                  alt={r.hostName}
                  className="w-10 h-10 rounded-2xl object-cover border border-[#A77BFF]/40"
                />
                <div>
                  <h4 className="text-xs font-bold text-white">{r.gameTitle}</h4>
                  <p className="text-[10px] text-[#C8C0D8]/70">
                    Hôte : {r.hostName} • {r.players.length}/{r.maxPlayers} Joueurs
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleJoinRoom(r.id)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#A77BFF] to-[#F58AC9] text-white text-xs font-bold hover:opacity-90 active:scale-95 transition-all shadow-sm"
              >
                Rejoindre
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Catalogue des jeux disponibles */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Catalogue des Jeux ({filteredGames.length})
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredGames.map(game => (
            <div
              key={game.id}
              className="group rounded-3xl overflow-hidden bg-[#191827] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between shadow-xl"
            >
              <div className="relative aspect-[16/10] bg-[#10101B]">
                <img
                  src={game.coverImage}
                  alt={game.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#191827] via-transparent to-transparent" />
                <span
                  className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                  style={{
                    backgroundColor: `${game.accentColor}25`,
                    color: game.accentColor,
                    border: `1px solid ${game.accentColor}40`,
                  }}
                >
                  {game.badge}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-base font-bold text-white font-heading mb-1">{game.title}</h4>
                  <p className="text-xs text-[#C8C0D8] leading-relaxed mb-4">{game.description}</p>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[11px] text-[#C8C0D8]/70">
                    {game.minPlayers}-{game.maxPlayers} Joueurs • {game.durationMinutes} min
                  </span>
                  <button
                    onClick={() => {
                      setSelectedGameIdToCreate(game.id);
                      setIsCreateRoomOpen(true);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-[#242139] hover:bg-white/10 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <span>Lancer</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#F58AC9]" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Avertissement Jeu Responsable & Sans Argent Réel */}
      <div className="p-4 rounded-3xl bg-[#191827] border border-white/5 text-xs text-[#C8C0D8] flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-[#82E3B1] shrink-0" />
        <p className="leading-relaxed">
          Les jeux de cartes et jeux sociaux PULSE sont 100% gratuits et utilisent des points sans valeur marchande. Il n’y a aucun pari d'argent réel, aucun gain financier ni enjeu pécuniaire.
        </p>
      </div>

      {/* Modal Créer un Salon */}
      {isCreateRoomOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#10101B]/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#191827] border border-white/10 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white font-heading mb-4">Créer un Salon de Jeu</h3>

            <form onSubmit={handleCreateRoom} className="space-y-4">
              <div>
                <label className="text-xs text-[#C8C0D8] mb-1.5 block">Choisir l'expérience de jeu</label>
                <select
                  value={selectedGameIdToCreate}
                  onChange={e => setSelectedGameIdToCreate(e.target.value)}
                  className="w-full bg-[#242139] border border-white/10 rounded-2xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  {gamesList.map(g => (
                    <option key={g.id} value={g.id}>
                      {g.title} ({g.minPlayers}-{g.maxPlayers} joueurs)
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-2xl bg-[#242139]/60 border border-white/5">
                <input
                  type="checkbox"
                  id="privateRoomCheck"
                  checked={isPrivateRoom}
                  onChange={e => setIsPrivateRoom(e.target.checked)}
                  className="accent-[#A77BFF] w-4 h-4 rounded"
                />
                <label htmlFor="privateRoomCheck" className="text-xs text-white cursor-pointer">
                  Salon Privé (Sur invitation directe ou code uniquement)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateRoomOpen(false)}
                  className="px-4 py-2 rounded-2xl bg-[#242139] text-[#C8C0D8] text-xs font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-2xl bg-gradient-to-r from-[#A77BFF] to-[#F58AC9] text-white text-xs font-bold shadow-md"
                >
                  Ouvrir le Salon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
