import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

export const SafetyPage: React.FC = () => {
  const { navigate } = useApp();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6 text-white">
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center gap-2 text-xs text-[#C8C0D8] hover:text-white"
      >
        <ArrowLeft className="w-4 h-4" /> Retour à l'accueil
      </button>

      <div className="p-6 rounded-3xl bg-[#191827] border border-[#82E3B1]/40 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#82E3B1]/20 text-[#82E3B1] flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black font-heading">Charte de Sécurité & Politique 18+ de PULSE</h1>
            <p className="text-xs text-[#82E3B1] font-semibold">Tolérance zéro pour la protection des mineurs et assurance de majorité légale</p>
          </div>
        </div>

        <div className="space-y-4 text-xs text-[#C8C0D8] leading-relaxed pt-2">
          <section className="space-y-1">
            <h3 className="text-sm font-bold text-white">1. Assurance de Majorité Légale (18+)</h3>
            <p>
              PULSE est strictement interdit à toute personne de moins de 18 ans. Nous déployons des vérifications d’âge obligatoires lors de l’inscription et des procédures de revue humaine pour auditer tout profil signalé. Tout compte appartenant à un mineur est immédiatement et définitivement supprimé.
            </p>
          </section>

          <section className="space-y-1">
            <h3 className="text-sm font-bold text-white">2. Éthique et Transparence de l'IA</h3>
            <p>
              L’intelligence artificielle est utilisée exclusivement pour faciliter les connexions humaines réelles (onboarding conversationnel, synthèse de bio, explications d’affinité transparentes). Les scores d'affinité sont des estimations heuristiques basées sur vos réponses et affinités, et non des diagnostics psychologiques absolus.
            </p>
          </section>

          <section className="space-y-1">
            <h3 className="text-sm font-bold text-white">3. Zéro Faux Profil ou Bot Trompeur</h3>
            <p>
              PULSE ne déploie aucun faux profil automatisé pour stimuler artificiellement l'activité. Vous n'interagissez qu'avec de vrais membres de la communauté.
            </p>
          </section>

          <section className="space-y-1">
            <h3 className="text-sm font-bold text-white">4. Blocage et Signalement Immédiat</h3>
            <p>
              Chaque membre dispose du contrôle total pour bloquer toute interaction indésirable et signaler un comportement suspect directement à l'équipe de modération.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export const PrivacyPage: React.FC = () => {
  const { navigate } = useApp();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6 text-white">
      <button onClick={() => navigate('/')} className="inline-flex items-center gap-2 text-xs text-[#C8C0D8] hover:text-white">
        <ArrowLeft className="w-4 h-4" /> Retour à l'accueil
      </button>

      <div className="p-6 rounded-3xl bg-[#191827] border border-white/10 space-y-4 text-xs text-[#C8C0D8] leading-relaxed">
        <h1 className="text-2xl font-black font-heading text-white">Politique de Confidentialité & Conformité RGPD</h1>
        <p>
          Le respect de votre vie privée est au cœur de l'architecture de PULSE. Nous ne vendons jamais vos données personnelles et ne diffusons jamais votre localisation géographique exacte.
        </p>
        <h3 className="text-sm font-bold text-white mt-4">Minimisation et Conservation des Données</h3>
        <p>
          Nous ne stockons que les données que vous fournissez explicitement lors de l’onboarding et de vos activités (passions, préférences de jeux, messages consentis). Seul un périmètre approximatif de ville ou de quartier est calculé lorsque vous activez l'affichage de distance.
        </p>
        <h3 className="text-sm font-bold text-white mt-4">Vos Droits</h3>
        <p>
          Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, d'exportation et de suppression définitive de vos données personnelles à tout moment dans les Paramètres de votre profil.
        </p>
      </div>
    </div>
  );
};

export const TermsPage: React.FC = () => {
  const { navigate } = useApp();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6 text-white">
      <button onClick={() => navigate('/')} className="inline-flex items-center gap-2 text-xs text-[#C8C0D8] hover:text-white">
        <ArrowLeft className="w-4 h-4" /> Retour à l'accueil
      </button>

      <div className="p-6 rounded-3xl bg-[#191827] border border-white/10 space-y-4 text-xs text-[#C8C0D8] leading-relaxed">
        <h1 className="text-2xl font-black font-heading text-white">Conditions Générales d'Utilisation</h1>
        <p>
          En accédant à la plateforme PULSE, vous vous engagez à respecter nos normes communautaires de bienveillance et certifiez que vous remplissez l’exigence légale minimale de 18 ans révolus.
        </p>
        <h3 className="text-sm font-bold text-white mt-4">Jeux Gratuits & Absence de Pari Réel</h3>
        <p>
          Tous les jeux multijoueurs et tables de cartes utilisent des points virtuels gratuits sans valeur monétaire. Les jeux d’argent réel et les paris financiers sont formellement exclus de la plateforme.
        </p>
      </div>
    </div>
  );
};
