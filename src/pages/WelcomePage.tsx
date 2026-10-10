import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  Sparkles,
  Heart,
  Gamepad2,
  Calendar,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Play,
  Users,
} from 'lucide-react';

export const WelcomePage: React.FC = () => {
  const { navigate, setActiveUniverse } = useApp();
  const [selectedUniverse, setSelectedUniverse] = useState<number>(0);

  const universes = [
    {
      id: 'love',
      name: 'AMOUR',
      tagline: 'Une vraie résonance sans le swipe superficiel',
      description: 'Découvrez des étincelles romantiques authentiques grâce à des tests de personnalité, des quiz d’alchimie synchronisés et des valeurs partagées.',
      accent: '#F58AC9',
      borderGlow: 'hover:border-[#F58AC9]/50 shadow-[#F58AC9]/10',
      icon: Heart,
      bgImage: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80',
      stat: '94% de Précision Alchimique',
    },
    {
      id: 'friends',
      name: 'AMIS',
      tagline: 'Trouvez votre bande et vos futurs complices',
      description: 'Rejoignez des personnes qui vibrent pour vos passions précises : production synthwave, vinyles indés, campagnes de jeux de rôle ou sessions d’escalade.',
      accent: '#A77BFF',
      borderGlow: 'hover:border-[#A77BFF]/50 shadow-[#A77BFF]/10',
      icon: Users,
      bgImage: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
      stat: 'Zéro Silence Gênant',
    },
    {
      id: 'play',
      name: 'JEUX',
      tagline: 'Jeux multijoueurs sociaux et blind tests en direct',
      description: 'Connectez-vous sans effort par le jeu interactif : tests d’alchimie en aveugle, dilemmes rapides et escape vaults coopératifs à deux.',
      accent: '#48D9E6',
      borderGlow: 'hover:border-[#48D9E6]/50 shadow-[#48D9E6]/10',
      icon: Gamepad2,
      bgImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
      stat: 'Jeu Synchronisé en Direct',
    },
    {
      id: 'experiences',
      name: 'EXPÉRIENCES',
      tagline: 'Ateliers culinaires et événements réels sélectionnés',
      description: 'Transformez les échanges en ligne en souvenirs mémorables : confection de pâtes fraîches, écoute de vinyles sur les toits et game jams indés.',
      accent: '#82E3B1',
      borderGlow: 'hover:border-[#82E3B1]/50 shadow-[#82E3B1]/10',
      icon: Calendar,
      bgImage: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80',
      stat: 'Rencontres 18+ Soignées',
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#10101B] text-white overflow-hidden flex flex-col">
      {/* Lueur d'ambiance et ondes lumineuses */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] sm:w-[1000px] h-[500px] bg-gradient-to-b from-[#A77BFF]/20 via-[#F58AC9]/15 to-transparent rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-[#48D9E6]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Barre de navigation publique */}
      <header className="relative z-20 max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#A77BFF] via-[#F58AC9] to-[#48D9E6] p-[2px] shadow-lg shadow-[#A77BFF]/30">
            <div className="w-full h-full bg-[#10101B] rounded-2xl flex items-center justify-center">
              <span className="text-xl font-black gradient-text">P</span>
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#82E3B1] rounded-full border-2 border-[#10101B] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-wider text-white font-heading">PULSE</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#A77BFF]/20 text-[#A77BFF] border border-[#A77BFF]/30">
                18+ ADULTES UNIQUEMENT
              </span>
            </div>
            <p className="text-[10px] font-medium tracking-widest text-[#C8C0D8]/70 uppercase">
              Ressentez la Connexion
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="hidden sm:inline-flex px-4 py-2 rounded-2xl text-xs font-semibold text-[#C8C0D8] hover:text-white transition-colors"
          >
            J'ai déjà un compte
          </button>
          <button
            onClick={() => navigate('/onboarding')}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#A77BFF] to-[#F58AC9] text-white text-xs font-bold tracking-wide shadow-lg shadow-[#A77BFF]/25 hover:opacity-90 transition-all transform active:scale-95"
          >
            Commencer l'Aventure
          </button>
        </div>
      </header>

      {/* Hero Cinématique */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pt-10 pb-20 text-center max-w-5xl mx-auto">
        {/* Badge supérieur */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#191827] border border-[#A77BFF]/30 shadow-lg mb-8">
          <Sparkles className="w-4 h-4 text-[#F58AC9] animate-pulse" />
          <span className="text-xs font-semibold text-[#C8C0D8]">
            Au-delà du swipe infini. Connectez-vous par le jeu partagé.
          </span>
        </div>

        {/* Titres du Hero */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white font-heading tracking-tight leading-[1.1] mb-6">
          Rencontrez. Jouez. <span className="gradient-text">Connectez.</span>
        </h1>

        <p className="text-base sm:text-xl text-[#C8C0D8] max-w-2xl mx-auto font-normal leading-relaxed mb-10">
          Découvrez des personnes qui partagent votre énergie. Connectez-vous grâce au matchmaking IA, aux jeux multijoueurs synchronisés et aux expériences sélectionnées dans la vraie vie.
        </p>

        {/* Boutons d'action principaux */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button
            onClick={() => navigate('/onboarding')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#A77BFF] to-[#F58AC9] text-white font-bold text-sm tracking-wide shadow-xl shadow-[#A77BFF]/30 hover:shadow-[#F58AC9]/40 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <span>Commencer l'aventure</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => navigate('/login')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-[#191827] border border-white/10 text-white font-semibold text-sm hover:bg-[#242139] hover:border-[#A77BFF]/40 active:scale-95 transition-all"
          >
            <span>J'ai déjà un compte</span>
          </button>
        </div>

        {/* Métriques en direct */}
        <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-3xl">
          {[
            { label: 'Affinités Vérifiées', val: '94.2%' },
            { label: 'Salons de Jeux Ouverts', val: '12 400+' },
            { label: 'Activités Partagées', val: '850+' },
            { label: 'Réservé aux Adultes (18+)', val: '100% Sûr' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-2xl bg-[#191827]/60 border border-white/5 backdrop-blur-md text-center">
              <p className="text-xl sm:text-2xl font-black font-heading gradient-text">{item.val}</p>
              <p className="text-[11px] text-[#C8C0D8]/70 mt-1 font-medium">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Les 4 Univers Interactifs */}
        <section className="mt-24 w-full text-left">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
              Quatre Univers Interactifs. Une Seule Énergie.
            </h2>
            <p className="text-sm text-[#C8C0D8] mt-2 max-w-lg mx-auto">
              Choisissez votre priorité ou explorez l'ensemble. Les gens se connectent bien mieux autour de ce qu'ils aiment faire ensemble.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {universes.map((univ, idx) => {
              const Icon = univ.icon;

              return (
                <div
                  key={univ.id}
                  onClick={() => {
                    setSelectedUniverse(idx);
                    setActiveUniverse(univ.id as any);
                  }}
                  className={`group relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-[#191827] border border-white/10 ${univ.borderGlow} transition-all duration-300 cursor-pointer shadow-lg`}
                >
                  {/* Image de fond */}
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity duration-500"
                    style={{ backgroundImage: `url(${univ.bgImage})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#10101B] via-[#10101B]/80 to-transparent" />

                  {/* Contenu de l'univers */}
                  <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md"
                          style={{ backgroundColor: `${univ.accent}25`, border: `1px solid ${univ.accent}50` }}
                        >
                          <Icon className="w-6 h-6" style={{ color: univ.accent }} />
                        </div>
                        <span
                          className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider"
                          style={{ backgroundColor: `${univ.accent}15`, color: univ.accent, border: `1px solid ${univ.accent}30` }}
                        >
                          {univ.stat}
                        </span>
                      </div>

                      <h3 className="text-2xl font-black text-white font-heading tracking-tight mb-1">
                        {univ.name}
                      </h3>
                      <p className="text-xs font-semibold text-white/90 mb-3">{univ.tagline}</p>
                      <p className="text-xs text-[#C8C0D8] leading-relaxed mb-6">{univ.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <span className="text-xs font-semibold text-[#C8C0D8] group-hover:text-white transition-colors">
                        Explorer {univ.name}
                      </span>
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 group-hover:bg-white/15 transition-colors"
                        style={{ color: univ.accent }}
                      >
                        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Charte de Sécurité et Confiance */}
        <section className="mt-20 p-8 rounded-3xl bg-[#191827]/80 border border-white/10 w-full max-w-3xl text-left">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#82E3B1]/15 border border-[#82E3B1]/30 flex items-center justify-center text-[#82E3B1] shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white font-heading">
                Adultes 18+ Uniquement, IA Transparente et Zéro Spam Garanti
              </h4>
              <p className="text-xs text-[#C8C0D8] mt-1.5 leading-relaxed">
                PULSE exige une vérification d'âge pour tous ses membres. Nous interdisons strictement les faux comptes automatisés (bots), ne monétisons aucun jeu d'argent, et vous laissons le contrôle total sur vos paramètres de confidentialité.
              </p>
              <div className="flex flex-wrap gap-4 mt-4 text-[11px] text-[#C8C0D8]/80 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#82E3B1]" /> Aucun Jeu d'Argent Réel
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#82E3B1]" /> Modération et Signalements Rapides
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#82E3B1]" /> Explications Transparentes des Matchs
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Action Finale */}
        <div className="mt-16 mb-8 text-center">
          <button
            onClick={() => navigate('/onboarding')}
            className="px-10 py-5 rounded-2xl bg-gradient-to-r from-[#A77BFF] via-[#F58AC9] to-[#48D9E6] text-white font-extrabold text-base tracking-wide shadow-2xl shadow-[#F58AC9]/30 hover:scale-105 active:scale-95 transition-all"
          >
            Prêt(e) à ressentir la connexion ? C'est parti
          </button>
        </div>
      </main>

      {/* Pied de page */}
      <footer className="relative z-10 border-t border-white/5 bg-[#10101B] py-8 px-6 text-center text-xs text-[#C8C0D8]/60">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Plateforme PULSE. Nom de marque en cours d'enregistrement. Tous droits réservés.</p>
          <div className="flex items-center gap-6 text-[#C8C0D8]/80">
            <button onClick={() => navigate('/safety')} className="hover:text-white transition-colors">
              Sécurité & Règles 18+
            </button>
            <button onClick={() => navigate('/privacy')} className="hover:text-white transition-colors">
              Politique de Confidentialité
            </button>
            <button onClick={() => navigate('/terms')} className="hover:text-white transition-colors">
              Conditions d'Utilisation
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
