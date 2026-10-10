import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  Bell,
  MessageCircle,
  Search,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Compass,
  Heart,
  Gamepad2,
  Calendar,
  LogOut,
  ChevronDown,
} from 'lucide-react';

export const AppHeader: React.FC = () => {
  const {
    currentUser,
    navigate,
    unreadCount,
    toggleRole,
    activeUniverse,
    setActiveUniverse,
  } = useApp();

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/app/discover?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#10101B]/90 backdrop-blur-xl border-b border-white/5 px-4 sm:px-6 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Logo & Tagline */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/app')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="relative w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#A77BFF] via-[#F58AC9] to-[#48D9E6] p-[1.5px] shadow-lg shadow-[#A77BFF]/20 group-hover:shadow-[#F58AC9]/30 transition-all">
              <div className="w-full h-full bg-[#10101B] rounded-2xl flex items-center justify-center">
                <span className="text-base font-black tracking-tighter gradient-text">P</span>
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#82E3B1] rounded-full border-2 border-[#10101B] animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-wider text-white font-heading">PULSE</span>
                <span className="hidden sm:inline-block text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#A77BFF]/20 text-[#A77BFF] border border-[#A77BFF]/30">
                  18+
                </span>
              </div>
              <p className="hidden md:block text-[9px] font-medium tracking-widest text-[#C8C0D8]/70 uppercase">
                Ressentez la Connexion
              </p>
            </div>
          </button>

          {/* Pilules d'univers */}
          <nav className="hidden lg:flex items-center gap-1 ml-6 p-1 rounded-2xl bg-[#191827] border border-white/5">
            {[
              { id: 'all', label: 'Tous', icon: Compass },
              { id: 'love', label: 'Amour', icon: Heart, color: 'text-[#F58AC9]' },
              { id: 'friends', label: 'Amis', icon: Sparkles, color: 'text-[#A77BFF]' },
              { id: 'play', label: 'Jeux', icon: Gamepad2, color: 'text-[#48D9E6]' },
              { id: 'experiences', label: 'Expériences', icon: Calendar, color: 'text-[#82E3B1]' },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeUniverse === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveUniverse(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#A77BFF]/25 to-[#F58AC9]/25 text-white border border-[#A77BFF]/30 shadow-sm'
                      : 'text-[#C8C0D8] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${tab.color || 'text-white'}`} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Barre de recherche */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex flex-1 max-w-xs items-center relative"
        >
          <Search className="w-4 h-4 text-[#C8C0D8]/60 absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Rechercher passions, jeux, membres..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-[#191827] border border-white/10 rounded-2xl pl-9 pr-4 py-1.5 text-xs text-white placeholder-[#C8C0D8]/50 focus:outline-none focus:border-[#A77BFF]/50 transition-colors"
          />
        </form>

        {/* Actions à droite */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notifications */}
          <button
            onClick={() => navigate('/app/notifications')}
            className="relative p-2 rounded-xl bg-[#191827] text-[#C8C0D8] hover:text-white hover:bg-[#242139] border border-white/5 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#F58AC9] rounded-full" />
          </button>

          {/* Raccourci Messages */}
          <button
            onClick={() => navigate('/app/messages')}
            className="relative p-2 rounded-xl bg-[#191827] text-[#C8C0D8] hover:text-white hover:bg-[#242139] border border-white/5 transition-colors"
            title="Messages"
          >
            <MessageCircle className="w-4 h-4 text-[#48D9E6]" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-gradient-to-r from-[#A77BFF] to-[#F58AC9] text-[10px] font-bold text-white flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Bouton de bascule Admin */}
          <button
            onClick={toggleRole}
            className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              currentUser?.role === 'admin'
                ? 'bg-[#82E3B1]/15 border-[#82E3B1]/40 text-[#82E3B1]'
                : 'bg-[#242139]/60 border-white/10 text-[#C8C0D8] hover:text-white hover:border-[#A77BFF]/40'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            {currentUser?.role === 'admin' ? 'Mode Admin' : 'Passer Admin'}
          </button>

          {/* Menu Profil */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 p-1 pl-1.5 rounded-2xl bg-[#191827] border border-white/10 hover:border-white/20 transition-all"
            >
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'}
                alt={currentUser?.firstName || 'Membre'}
                className="w-7 h-7 rounded-full object-cover border border-[#A77BFF]/50"
              />
              <span className="hidden sm:inline text-xs font-semibold text-white max-w-[80px] truncate">
                {currentUser?.firstName || 'Membre'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-[#C8C0D8] mr-1" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#191827] border border-white/10 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-2 border-b border-white/5 mb-1">
                  <p className="text-xs font-bold text-white">
                    {currentUser?.firstName} {currentUser?.lastName}
                  </p>
                  <p className="text-[10px] text-[#C8C0D8]/70 truncate">{currentUser?.email}</p>
                  <div className="flex items-center gap-1 mt-1 text-[10px] text-[#82E3B1] font-semibold">
                    <UserCheck className="w-3 h-3" /> Âge 18+ Vérifié
                  </div>
                </div>

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    navigate('/app/profile');
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-[#C8C0D8] hover:text-white hover:bg-[#242139] transition-colors"
                >
                  Mon Profil & Vibe
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    navigate('/app/settings');
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-[#C8C0D8] hover:text-white hover:bg-[#242139] transition-colors"
                >
                  Confidentialité & Paramètres
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    toggleRole();
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-[#82E3B1] hover:bg-[#242139] transition-colors"
                >
                  {currentUser?.role === 'admin' ? 'Passer en Mode Membre' : 'Ouvrir le Tableau de Bord Admin'}
                </button>
                <div className="border-t border-white/5 my-1" />
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    navigate('/login');
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Se déconnecter
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
