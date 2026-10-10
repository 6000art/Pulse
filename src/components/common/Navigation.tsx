import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  Home,
  Compass,
  Gamepad2,
  MessageCircle,
  User as UserIcon,
  Calendar,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { currentPath, navigate, unreadCount } = useApp();

  const navItems = [
    { label: 'ACCUEIL', path: '/app', icon: Home },
    { label: 'DÉCOUVRIR', path: '/app/discover', icon: Compass },
    { label: 'JOUER', path: '/app/games', icon: Gamepad2 },
    { label: 'MESSAGES', path: '/app/messages', icon: MessageCircle, badge: unreadCount },
    { label: 'PROFIL', path: '/app/profile', icon: UserIcon },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#10101B]/95 backdrop-blur-2xl border-t border-white/10 px-2 py-2">
      <div className="flex items-center justify-around">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive =
            currentPath === item.path ||
            (item.path === '/app' && currentPath === '/app') ||
            (item.path !== '/app' && currentPath.startsWith(item.path));

          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all ${
                isActive
                  ? 'text-white font-bold'
                  : 'text-[#C8C0D8]/60 hover:text-white font-medium'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 text-[#F58AC9]' : ''
                  }`}
                />
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1 -right-2 min-w-4 h-4 px-1 rounded-full bg-gradient-to-r from-[#A77BFF] to-[#F58AC9] text-[9px] font-bold text-white flex items-center justify-center">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <span
                className={`text-[9px] mt-1 tracking-wider ${
                  isActive ? 'gradient-text' : ''
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <div className="absolute -bottom-1 w-5 h-0.5 rounded-full bg-gradient-to-r from-[#A77BFF] to-[#F58AC9]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export const DesktopSidebarNav: React.FC = () => {
  const { currentPath, navigate, unreadCount, currentUser } = useApp();

  const primaryItems = [
    { label: 'Fil d’Actualité', path: '/app', icon: Home },
    { label: 'Matchmaking IA', path: '/app/discover', icon: Compass },
    { label: 'Salon de Jeux', path: '/app/games', icon: Gamepad2, highlight: '3 En direct' },
    { label: 'Activités & Sorties', path: '/app/activities', icon: Calendar },
    { label: 'Conversations', path: '/app/messages', icon: MessageCircle, badge: unreadCount },
    { label: 'Mes Connexions', path: '/app/matches', icon: Sparkles },
    { label: 'Mon Profil', path: '/app/profile', icon: UserIcon },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 h-[calc(100vh-65px)] sticky top-[65px] p-4 border-r border-white/5 bg-[#10101B]/50 backdrop-blur-lg">
      <div className="flex-1 space-y-1">
        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#C8C0D8]/50">
          Expérience Principale
        </div>

        {primaryItems.map(item => {
          const Icon = item.icon;
          const isActive =
            currentPath === item.path ||
            (item.path !== '/app' && currentPath.startsWith(item.path));

          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-[#A77BFF]/20 to-[#F58AC9]/15 text-white border border-[#A77BFF]/30 shadow-md'
                  : 'text-[#C8C0D8] hover:text-white hover:bg-[#191827]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-[#F58AC9]' : 'text-[#C8C0D8]/70'
                  }`}
                />
                <span>{item.label}</span>
              </div>

              {item.badge && item.badge > 0 ? (
                <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-[#A77BFF] to-[#F58AC9] text-[10px] font-bold text-white">
                  {item.badge}
                </span>
              ) : null}

              {item.highlight ? (
                <span className="px-2 py-0.5 rounded-full bg-[#82E3B1]/20 text-[#82E3B1] border border-[#82E3B1]/30 text-[9px] font-bold">
                  {item.highlight}
                </span>
              ) : null}
            </button>
          );
        })}

        {currentUser?.role === 'admin' && (
          <div className="pt-4 mt-4 border-t border-white/5">
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#82E3B1]/70">
              Administration
            </div>
            <button
              onClick={() => navigate('/admin')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                currentPath.startsWith('/admin')
                  ? 'bg-[#82E3B1]/20 text-white border border-[#82E3B1]/30'
                  : 'text-[#C8C0D8] hover:text-white hover:bg-[#191827]'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-[#82E3B1]" />
              <span>Console d’Admin</span>
            </button>
          </div>
        )}
      </div>

      {/* Badge de sécurité 18+ */}
      <div className="p-3 rounded-2xl bg-[#191827] border border-white/5 text-[11px] text-[#C8C0D8]/80 space-y-1">
        <div className="flex items-center gap-1.5 text-white font-semibold">
          <div className="w-2 h-2 rounded-full bg-[#82E3B1] animate-ping" />
          Plateforme 18+ Exclusive
        </div>
        <p className="text-[10px] text-[#C8C0D8]/60 leading-tight">
          Connexions authentiques, zéro bot automatisé, vraie alchimie de jeu.
        </p>
      </div>
    </aside>
  );
};
