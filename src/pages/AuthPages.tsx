import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { loginUser, registerUser } from '../lib/api.ts';
import { ShieldCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { setCurrentUser, navigate, showToast } = useApp();
  const [email, setEmail] = useState('alex.rivera@pulse.social');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = await loginUser(email, false);
    setCurrentUser(user);
    showToast({
      type: 'spark',
      title: 'Bon retour parmi nous !',
      message: `Connecté(e) en tant que ${user.firstName}.`,
    });
    navigate('/app');
  };

  const handleAdminDemoLogin = async () => {
    const user = await loginUser(undefined, true);
    setCurrentUser(user);
    showToast({
      type: 'info',
      title: 'Session Administrateur Activée',
      message: 'Connecté(e) en tant qu’Administratrice Elena Vance.',
    });
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-[#10101B] text-white flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#A77BFF]/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md bg-[#191827] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10">
        <div className="text-center mb-6">
          <div className="inline-block p-3 rounded-2xl bg-[#242139] border border-white/10 mb-3">
            <span className="text-2xl font-black gradient-text">P</span>
          </div>
          <h2 className="text-2xl font-black font-heading text-white">Connexion à PULSE</h2>
          <p className="text-xs text-[#C8C0D8] mt-1">Ressentez la connexion par le jeu et les moments partagés.</p>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-[#C8C0D8] mb-1.5 block">Adresse e-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-[#242139] border border-white/10 rounded-2xl p-3 text-xs text-white focus:outline-none focus:border-[#A77BFF]/50"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#A77BFF] to-[#F58AC9] text-white font-bold text-xs shadow-lg shadow-[#A77BFF]/20 hover:opacity-90 active:scale-95 transition-all"
          >
            Se Connecter avec mon E-mail
          </button>
        </form>

        <div className="pt-4 mt-4 border-t border-white/5 space-y-2">
          <button
            type="button"
            onClick={handleAdminDemoLogin}
            className="w-full py-2.5 rounded-2xl bg-[#242139] border border-[#82E3B1]/30 text-[#82E3B1] text-xs font-semibold hover:bg-white/5 transition-colors"
          >
            Démo Rapide : Se connecter comme Administrateur (Elena)
          </button>

          <button
            type="button"
            onClick={() => navigate('/onboarding')}
            className="w-full py-2 text-xs text-[#C8C0D8] hover:text-white transition-colors text-center block"
          >
            Nouveau sur PULSE ? Démarrer l'Onboarding IA →
          </button>
        </div>

        <div className="mt-6 p-3 rounded-2xl bg-[#10101B]/80 border border-white/5 flex items-center justify-center gap-2 text-[11px] text-[#82E3B1]">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Plateforme strictement réservée aux adultes de 18 ans et plus</span>
        </div>
      </div>
    </div>
  );
};

export const RegisterPage: React.FC = () => {
  const { setCurrentUser, navigate, showToast } = useApp();
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState(24);
  const [agreed18, setAgreed18] = useState(false);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed18 || age < 18) {
      showToast({
        type: 'warning',
        title: 'Majorité légale requise',
        message: 'Vous devez certifier avoir au moins 18 ans pour rejoindre PULSE.',
      });
      return;
    }

    const user = await registerUser({ firstName, email, age, intent: 'everything' });
    setCurrentUser(user);
    showToast({
      type: 'spark',
      title: 'Bienvenue sur PULSE !',
      message: 'Lancement de votre session d’onboarding avec l’IA.',
    });
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen bg-[#10101B] text-white flex items-center justify-center p-4 relative overflow-hidden">
      <div className="w-full max-w-md bg-[#191827] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-black font-heading text-white">Rejoindre PULSE</h2>
          <p className="text-xs text-[#C8C0D8] mt-1">Découvrez votre communauté par le jeu et l'IA.</p>
        </div>

        <form onSubmit={handleRegisterSubmit} className="space-y-3">
          <div>
            <label className="text-xs text-[#C8C0D8] mb-1 block">Prénom</label>
            <input
              type="text"
              required
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              className="w-full bg-[#242139] border border-white/10 rounded-2xl p-2.5 text-xs text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs text-[#C8C0D8] mb-1 block">Adresse e-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-[#242139] border border-white/10 rounded-2xl p-2.5 text-xs text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs text-[#C8C0D8] mb-1 block">Votre Âge (Strictement 18+)</label>
            <input
              type="number"
              min={18}
              required
              value={age}
              onChange={e => setAge(Number(e.target.value))}
              className="w-full bg-[#242139] border border-white/10 rounded-2xl p-2.5 text-xs text-white focus:outline-none"
            />
          </div>

          <label className="flex items-start gap-2 pt-2 text-xs text-[#C8C0D8] cursor-pointer">
            <input
              type="checkbox"
              required
              checked={agreed18}
              onChange={e => setAgreed18(e.target.checked)}
              className="accent-[#A77BFF] mt-0.5 rounded"
            />
            <span>Je certifie avoir au moins 18 ans et accepter la Charte de Sécurité Communautaire de PULSE.</span>
          </label>

          <button
            type="submit"
            className="w-full py-3.5 mt-2 rounded-2xl bg-gradient-to-r from-[#A77BFF] to-[#F58AC9] text-white font-bold text-xs shadow-md"
          >
            Créer mon Compte & Rencontrer l'IA
          </button>
        </form>

        <button
          onClick={() => navigate('/login')}
          className="w-full text-center text-xs text-[#C8C0D8] hover:text-white mt-4 block"
        >
          Déjà un compte ? Se connecter
        </button>
      </div>
    </div>
  );
};
