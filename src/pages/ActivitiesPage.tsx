import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Activity } from '../types/index.ts';
import { fetchActivities, bookActivity, createActivity } from '../lib/api.ts';
import {
  Calendar,
  MapPin,
  Users,
  Plus,
} from 'lucide-react';

export const ActivitiesPage: React.FC = () => {
  const { currentUser, showToast, matches } = useApp();
  const [activitiesList, setActivitiesList] = useState<Activity[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Modal d'invitation de match
  const [invitingActivity, setInvitingActivity] = useState<Activity | null>(null);

  // Formulaire d'activité
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'cooking' | 'music' | 'fitness' | 'art' | 'gaming' | 'social'>('cooking');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('Samedi 21 nov.');
  const [time, setTime] = useState('19h00 - 22h00');
  const [location, setLocation] = useState('Atelier Créatif, Paris 11e');
  const [capacity, setCapacity] = useState(12);

  const loadData = async () => {
    const data = await fetchActivities();
    setActivitiesList(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRSVP = async (activityId: string) => {
    try {
      const updated = await bookActivity(activityId);
      setActivitiesList(prev => prev.map(a => (a.id === activityId ? updated : a)));
      showToast({
        type: 'spark',
        title: 'Place Confirmée !',
        message: 'Votre réservation est validée. À très bientôt !',
      });
    } catch (e: any) {
      showToast({
        type: 'warning',
        title: 'Impossible de réserver',
        message: e.message || 'Capacité maximale atteinte.',
      });
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const created = await createActivity({
      title: title.trim(),
      category,
      description: description.trim(),
      date,
      time,
      location,
      capacity: Number(capacity),
      isOnline: false,
    });

    setActivitiesList([created, ...activitiesList]);
    setIsCreateOpen(false);
    setTitle('');
    setDescription('');
    showToast({
      type: 'spark',
      title: 'Activité Publiée !',
      message: 'Les membres peuvent désormais découvrir et réserver leur place.',
    });
  };

  const handleInviteMatchToActivity = (matchName: string) => {
    showToast({
      type: 'info',
      title: 'Invitation Envoyée',
      message: `Vous avez invité ${matchName} à ${invitingActivity?.title}.`,
    });
    setInvitingActivity(null);
  };

  const filtered =
    activeCategory === 'all'
      ? activitiesList
      : activitiesList.filter(a => a.category === activeCategory);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* En-tête supérieur */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black font-heading text-white">Activités & Expériences Partagées</h2>
          <p className="text-xs text-[#C8C0D8]/70">
            La véritable connexion naît des moments vécus ensemble. Événements strictement 18+ vérifiés.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#A77BFF] to-[#82E3B1] text-white text-xs font-bold shadow-lg shadow-[#82E3B1]/15 hover:opacity-90 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Organiser une Activité</span>
        </button>
      </div>

      {/* Pilules de catégories */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: 'Toutes les Activités' },
          { id: 'cooking', label: 'Cuisine & Vins' },
          { id: 'music', label: 'Musique & Écoute' },
          { id: 'gaming', label: 'Gaming & Arcades' },
          { id: 'art', label: 'Art & Céramique' },
          { id: 'fitness', label: 'Escalade & Bloc' },
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? 'bg-[#242139] text-white border border-[#82E3B1]/40'
                : 'bg-[#191827] text-[#C8C0D8] hover:text-white border border-white/5'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grille des activités */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map(act => {
          const isUserRegistered = act.attendees.some(a => a.userId === currentUser?.id);
          const spotsLeft = act.capacity - act.bookedCount;

          return (
            <div
              key={act.id}
              className="rounded-3xl overflow-hidden bg-[#191827] border border-white/10 hover:border-white/20 transition-all shadow-xl flex flex-col justify-between"
            >
              <div className="relative aspect-[16/10] bg-[#10101B]">
                <img src={act.coverImage} alt={act.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#191827] via-transparent to-transparent" />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold bg-[#10101B]/80 text-[#82E3B1] border border-[#82E3B1]/30 uppercase tracking-wider backdrop-blur-md">
                  {act.category === 'cooking' ? 'Cuisine' : act.category === 'music' ? 'Musique' : act.category === 'gaming' ? 'Gaming' : 'Créatif'}
                </span>
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#10101B]/80 text-white border border-white/10 backdrop-blur-md">
                  {spotsLeft > 0 ? `${spotsLeft} places restantes` : 'Complet'}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-base font-bold text-white font-heading mb-1">{act.title}</h3>
                  <p className="text-xs text-[#C8C0D8] leading-relaxed line-clamp-3">{act.description}</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-white/5 text-xs text-[#C8C0D8]">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#A77BFF]" />
                    <span>{act.date} • {act.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#48D9E6]" />
                    <span>{act.location}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2">
                      <img
                        src={act.organizer.avatar}
                        alt={act.organizer.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="text-[11px] font-medium text-white/90">
                        Hôte : {act.organizer.name}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#C8C0D8]/60">
                      {act.bookedCount}/{act.capacity} Participants
                    </span>
                  </div>
                </div>

                {/* Bouton de réservation et invitation */}
                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => handleRSVP(act.id)}
                    disabled={isUserRegistered || spotsLeft <= 0}
                    className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
                      isUserRegistered
                        ? 'bg-[#82E3B1]/20 border border-[#82E3B1]/40 text-[#82E3B1] cursor-default'
                        : 'bg-gradient-to-r from-[#A77BFF] to-[#82E3B1] text-white hover:opacity-90 active:scale-95 shadow-md'
                    }`}
                  >
                    {isUserRegistered ? '✓ Place Confirmée' : 'Réserver ma Place'}
                  </button>

                  <button
                    onClick={() => setInvitingActivity(act)}
                    className="p-2.5 rounded-xl bg-[#242139] border border-white/10 text-[#C8C0D8] hover:text-white transition-colors"
                    title="Inviter une connexion"
                  >
                    <Users className="w-4 h-4 text-[#F58AC9]" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Inviter une Connexion */}
      {invitingActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#10101B]/80 backdrop-blur-md">
          <div className="w-full max-w-sm bg-[#191827] border border-white/10 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white font-heading mb-1">Inviter une Connexion</h3>
            <p className="text-xs text-[#C8C0D8] mb-4">
              Invitez l’une de vos connexions à vous accompagner à « {invitingActivity.title} » :
            </p>

            <div className="space-y-2 mb-4">
              {matches.length === 0 ? (
                <p className="text-xs text-[#C8C0D8]/60 py-4 text-center">
                  Aucune connexion pour le moment. Découvrez des profils dans Matchmaking !
                </p>
              ) : (
                matches.map(m => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between p-2.5 rounded-2xl bg-[#242139] border border-white/5"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={m.targetProfile.avatar}
                        alt={m.targetProfile.firstName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-xs font-bold text-white">{m.targetProfile.firstName}</span>
                    </div>
                    <button
                      onClick={() => handleInviteMatchToActivity(m.targetProfile.firstName)}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#A77BFF] to-[#F58AC9] text-white text-[10px] font-bold"
                    >
                      Inviter
                    </button>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => setInvitingActivity(null)}
              className="w-full py-2.5 rounded-xl bg-[#242139] text-xs font-semibold text-[#C8C0D8]"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* Modal Organiser une Activité */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#10101B]/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#191827] border border-white/10 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white font-heading mb-4">Organiser une Activité</h3>

            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <div>
                <label className="text-xs text-[#C8C0D8] mb-1 block">Titre</label>
                <input
                  type="text"
                  required
                  placeholder="Ex : Soirée Vin Nature & Jeux de Plateau"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-[#242139] border border-white/10 rounded-2xl p-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-[#C8C0D8] mb-1 block">Catégorie</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as any)}
                  className="w-full bg-[#242139] border border-white/10 rounded-2xl p-2.5 text-xs text-white focus:outline-none"
                >
                  <option value="cooking">Cuisine & Gastronomie</option>
                  <option value="music">Musique & Concerts</option>
                  <option value="gaming">Gaming & Arcades</option>
                  <option value="art">Art & Création</option>
                  <option value="fitness">Escalade & Sport</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-[#C8C0D8] mb-1 block">Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Quel est le format, l'ambiance et que peuvent attendre les participants ?"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full bg-[#242139] border border-white/10 rounded-2xl p-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-[#C8C0D8] mb-1 block">Date</label>
                  <input
                    type="text"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full bg-[#242139] border border-white/10 rounded-2xl p-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#C8C0D8] mb-1 block">Capacité</label>
                  <input
                    type="number"
                    value={capacity}
                    onChange={e => setCapacity(Number(e.target.value))}
                    className="w-full bg-[#242139] border border-white/10 rounded-2xl p-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-[#C8C0D8] mb-1 block">Lieu</label>
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full bg-[#242139] border border-white/10 rounded-2xl p-2.5 text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-2xl bg-[#242139] text-[#C8C0D8] text-xs font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-2xl bg-gradient-to-r from-[#A77BFF] to-[#82E3B1] text-white text-xs font-bold"
                >
                  Créer la Rencontre
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
