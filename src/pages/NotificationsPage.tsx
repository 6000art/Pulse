import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Sparkles, Gamepad2, Calendar, Heart } from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const { navigate } = useApp();

  const notifications = [
    {
      id: 'n-1',
      type: 'spark',
      title: 'Étincelle Mutuelle Débloquée !',
      desc: 'Vous et Elena avez matché avec 94% d’affinité IA. Elle vous a invité(e) à un Quiz Alchimie !',
      time: 'Il y a 12 min',
      icon: Sparkles,
      color: 'text-[#F58AC9]',
      action: () => navigate('/app/games'),
    },
    {
      id: 'n-2',
      type: 'game',
      title: 'Invitation de Salon de Jeux',
      desc: 'Marcus vous a invité(e) à rejoindre le salon Tu Préfères : Édition Nocturne #VIBE-99.',
      time: 'Il y a 1h',
      icon: Gamepad2,
      color: 'text-[#48D9E6]',
      action: () => navigate('/app/games'),
    },
    {
      id: 'n-3',
      type: 'activity',
      title: 'Nouvelle Activité dans Votre Ville',
      desc: 'L’atelier Gnocchis Maison & Vin Nature n’a plus que 3 places disponibles pour samedi.',
      time: 'Il y a 3h',
      icon: Calendar,
      color: 'text-[#82E3B1]',
      action: () => navigate('/app/activities'),
    },
    {
      id: 'n-4',
      type: 'reaction',
      title: 'Réaction sur votre Fil',
      desc: 'Kai a envoyé une étincelle sur votre publication sur la musique ambient et les vinyles.',
      time: 'Il y a 5h',
      icon: Heart,
      color: 'text-[#A77BFF]',
      action: () => navigate('/app'),
    },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold font-heading text-white">Notifications</h2>
          <p className="text-xs text-[#C8C0D8]/70">Vos alertes de connexions et de jeux</p>
        </div>
      </div>

      <div className="space-y-3">
        {notifications.map(item => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              onClick={item.action}
              className="p-4 rounded-3xl bg-[#191827] border border-white/10 hover:border-white/20 transition-all flex items-start gap-3.5 cursor-pointer shadow-md"
            >
              <div className="w-10 h-10 rounded-2xl bg-[#242139] flex items-center justify-center shrink-0">
                <Icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white">{item.title}</h4>
                  <span className="text-[10px] text-[#C8C0D8]/60">{item.time}</span>
                </div>
                <p className="text-xs text-[#C8C0D8] mt-0.5 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
