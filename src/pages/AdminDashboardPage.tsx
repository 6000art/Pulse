import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { AdminStats, ModerationReport, User } from '../types/index.ts';
import {
  fetchAdminStats,
  fetchAdminReports,
  actOnReport,
  fetchAdminUsers,
  toggleVerifyUser,
} from '../lib/api.ts';
import {
  ShieldAlert,
  Users,
  Sparkles,
  Gamepad2,
  TrendingUp,
  Activity as ActivityIcon,
  AlertTriangle,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { showToast, toggleRole } = useApp();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [reports, setReports] = useState<ModerationReport[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'reports' | 'users'>('overview');

  const loadAdminData = async () => {
    try {
      const s = await fetchAdminStats();
      setStats(s);
      const r = await fetchAdminReports();
      setReports(r);
      const u = await fetchAdminUsers();
      setUsersList(u);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleResolveReport = async (reportId: string, action: 'resolve' | 'dismiss') => {
    await actOnReport(reportId, action, 'Traité par l’Administratrice Elena');
    showToast({
      type: 'info',
      title: `Signalement ${action === 'resolve' ? 'Traité' : 'Classé sans suite'}`,
      message: 'File de modération mise à jour.',
    });
    loadAdminData();
  };

  const handleToggleVerify = async (userId: string) => {
    const updated = await toggleVerifyUser(userId);
    setUsersList(prev => prev.map(u => (u.id === userId ? updated : u)));
    showToast({
      type: 'spark',
      title: updated.isVerified ? 'Membre Vérifié (18+)' : 'Vérification Révoquée',
      message: `Statut du badge modifié pour ${updated.firstName}.`,
    });
  };

  if (!stats) return <div className="p-8 text-center text-xs text-[#C8C0D8]">Chargement des Métriques Admin...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* En-tête de la Console Admin */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#191827] border border-[#82E3B1]/30">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#82E3B1]/20 border border-[#82E3B1]/40 flex items-center justify-center text-[#82E3B1]">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold font-heading text-white">Centre de Sécurité & Commandement</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#82E3B1] text-[#10101B]">
                Admin Live
              </span>
            </div>
            <p className="text-xs text-[#C8C0D8]/70">
              Santé de la plateforme, audit de conformité 18+, journaux de sécurité et modération.
            </p>
          </div>
        </div>

        <button
          onClick={toggleRole}
          className="px-4 py-2 rounded-xl bg-[#242139] border border-white/10 text-xs font-semibold text-white hover:bg-white/10"
        >
          Retour à l'App Membre
        </button>
      </div>

      {/* Grille des indicateurs KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Membres Inscrits', val: stats.totalUsers.toLocaleString('fr-FR'), icon: Users, color: '#A77BFF' },
          { label: 'Actifs Aujourd’hui (DAU)', val: stats.activeToday.toLocaleString('fr-FR'), icon: TrendingUp, color: '#82E3B1' },
          { label: 'Étincelles Mutuelles', val: stats.mutualMatches.toLocaleString('fr-FR'), icon: Sparkles, color: '#F58AC9' },
          { label: 'Parties Multijoueurs', val: stats.gamesPlayedTotal.toLocaleString('fr-FR'), icon: Gamepad2, color: '#48D9E6' },
        ].map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div key={i} className="p-5 rounded-3xl bg-[#191827] border border-white/5 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-[#C8C0D8] font-medium">{kpi.label}</span>
                <Icon className="w-4 h-4" style={{ color: kpi.color }} />
              </div>
              <p className="text-2xl font-black text-white font-heading">{kpi.val}</p>
            </div>
          );
        })}
      </div>

      {/* Sous-onglets */}
      <div className="flex items-center gap-2 border-b border-white/5 pb-3">
        {[
          { id: 'overview', label: 'Activité Globale' },
          { id: 'reports', label: `File de Modération (${reports.filter(r => r.status === 'pending').length})` },
          { id: 'users', label: `Annuaire Membres (${usersList.length})` },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-2xl text-xs font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-[#242139] text-white border border-white/10'
                : 'text-[#C8C0D8] hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Onglet 1 : Activité globale */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-[#191827] border border-white/5 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ActivityIcon className="w-4 h-4 text-[#82E3B1]" />
              Journaux de Sécurité et Événements en Direct
            </h3>
            <div className="space-y-3">
              {stats.recentActivity.map(act => (
                <div key={act.id} className="p-3 rounded-2xl bg-[#242139]/60 border border-white/5 flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#82E3B1] mt-1.5 shrink-0" />
                  <div className="flex-1 text-xs">
                    <p className="text-white font-medium">{act.description}</p>
                    <span className="text-[10px] text-[#C8C0D8]/60">{act.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#191827] border border-white/5 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Santé de la Communauté
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#C8C0D8]">Rétention de Connexion (7 jours)</span>
                  <span className="font-bold text-[#82E3B1]">{stats.retentionRate}%</span>
                </div>
                <div className="w-full h-2 bg-[#242139] rounded-full overflow-hidden">
                  <div className="h-full bg-[#82E3B1] rounded-full" style={{ width: `${stats.retentionRate}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#C8C0D8]">Taux de Remplissage des Activités</span>
                  <span className="font-bold text-[#A77BFF]">82.5%</span>
                </div>
                <div className="w-full h-2 bg-[#242139] rounded-full overflow-hidden">
                  <div className="h-full bg-[#A77BFF] rounded-full" style={{ width: '82.5%' }} />
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#10101B]/80 border border-white/5 text-xs text-[#C8C0D8]">
                <p className="font-bold text-white mb-0.5">Assurance d'Âge 18+ Stricte</p>
                <p>100% des inscriptions ont complété la déclaration de majorité légale.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Onglet 2 : Modération */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Signalements en Attente de Revue Humaine
            </h3>
          </div>

          {reports.length === 0 ? (
            <p className="text-xs text-[#C8C0D8] py-8 text-center">Aucun signalement en attente. Tout est propre !</p>
          ) : (
            <div className="space-y-3">
              {reports.map(rep => (
                <div
                  key={rep.id}
                  className="p-5 rounded-3xl bg-[#191827] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-rose-500/15 text-rose-400 shrink-0">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white uppercase">{rep.reason}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            rep.status === 'pending'
                              ? 'bg-amber-400/20 text-amber-300'
                              : 'bg-[#82E3B1]/20 text-[#82E3B1]'
                          }`}
                        >
                          {rep.status === 'pending' ? 'En attente' : 'Résolu'}
                        </span>
                      </div>
                      <p className="text-xs text-[#C8C0D8] mt-1">{rep.targetDetails}</p>
                      <p className="text-[10px] text-[#C8C0D8]/60 mt-0.5">
                        Signalé par {rep.reporterName} • {rep.createdAt}
                      </p>
                    </div>
                  </div>

                  {rep.status === 'pending' ? (
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => handleResolveReport(rep.id, 'dismiss')}
                        className="px-3.5 py-1.5 rounded-xl bg-[#242139] hover:bg-white/10 text-xs font-semibold text-[#C8C0D8]"
                      >
                        Classer sans suite
                      </button>
                      <button
                        onClick={() => handleResolveReport(rep.id, 'resolve')}
                        className="px-3.5 py-1.5 rounded-xl bg-rose-500 text-white text-xs font-bold hover:bg-rose-600"
                      >
                        Sanctionner / Résoudre
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-[#82E3B1] font-semibold">✓ {rep.moderatorNotes}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Onglet 3 : Annuaire membres */}
      {activeTab === 'users' && (
        <div className="p-6 rounded-3xl bg-[#191827] border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Répertoire des Membres Vérifiés
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/5 text-[#C8C0D8]/60">
                <tr>
                  <th className="pb-3 font-semibold">Membre</th>
                  <th className="pb-3 font-semibold">Âge</th>
                  <th className="pb-3 font-semibold">Intention</th>
                  <th className="pb-3 font-semibold">Rôle</th>
                  <th className="pb-3 font-semibold">Statut 18+</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white">
                {usersList.map(u => (
                  <tr key={u.id} className="hover:bg-[#242139]/40">
                    <td className="py-3 flex items-center gap-2.5">
                      <img src={u.avatar} alt={u.firstName} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <span className="font-bold">{u.firstName} {u.lastName || ''}</span>
                        <span className="block text-[10px] text-[#C8C0D8]/60">{u.email}</span>
                      </div>
                    </td>
                    <td className="py-3">{u.age} ans</td>
                    <td className="py-3 capitalize text-[#A77BFF] font-semibold">{u.intent}</td>
                    <td className="py-3 capitalize">{u.role}</td>
                    <td className="py-3">
                      {u.isVerified ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#82E3B1]/20 text-[#82E3B1]">
                          Vérifié 18+
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400">
                          Non vérifié
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => handleToggleVerify(u.id)}
                        className="px-3 py-1 rounded-xl bg-[#242139] hover:bg-white/10 text-[10px] font-semibold"
                      >
                        Inverser Vérification
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
