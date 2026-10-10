import React from 'react';
import { AppProvider, useApp } from './context/AppContext.tsx';
import { WelcomePage } from './pages/WelcomePage.tsx';
import { OnboardingPage } from './pages/OnboardingPage.tsx';
import { FeedPage } from './pages/FeedPage.tsx';
import { DiscoverPage } from './pages/DiscoverPage.tsx';
import { GamingHubPage } from './pages/GamingHubPage.tsx';
import { ActivitiesPage } from './pages/ActivitiesPage.tsx';
import { MessagingPage } from './pages/MessagingPage.tsx';
import { ProfilePage } from './pages/ProfilePage.tsx';
import { MatchesPage } from './pages/MatchesPage.tsx';
import { NotificationsPage } from './pages/NotificationsPage.tsx';
import { AdminDashboardPage } from './pages/AdminDashboardPage.tsx';
import { LoginPage, RegisterPage } from './pages/AuthPages.tsx';
import { SafetyPage, PrivacyPage, TermsPage } from './pages/LegalPages.tsx';
import { AppHeader } from './components/common/AppHeader.tsx';
import { DesktopSidebarNav, MobileBottomNav } from './components/common/Navigation.tsx';
import { ToastContainer } from './components/common/ToastContainer.tsx';
import { MatchCelebrationModal } from './components/common/MatchCelebrationModal.tsx';

const AppRouter: React.FC = () => {
  const { currentPath, currentUser } = useApp();

  // Public standalone pages
  if (currentPath === '/') return <WelcomePage />;
  if (currentPath === '/login') return <LoginPage />;
  if (currentPath === '/register') return <RegisterPage />;
  if (currentPath === '/onboarding') return <OnboardingPage />;
  if (currentPath === '/safety') return <SafetyPage />;
  if (currentPath === '/privacy') return <PrivacyPage />;
  if (currentPath === '/terms') return <TermsPage />;

  // Admin section
  if (currentPath.startsWith('/admin')) {
    return (
      <div className="min-h-screen bg-[#10101B] text-white flex flex-col">
        <AppHeader />
        <div className="flex-1">
          <AdminDashboardPage />
        </div>
        <ToastContainer />
      </div>
    );
  }

  // Authenticated Main Experience (/app and subpaths)
  const renderMainContent = () => {
    if (currentPath === '/app/discover') return <DiscoverPage />;
    if (currentPath.startsWith('/app/games')) return <GamingHubPage />;
    if (currentPath.startsWith('/app/activities')) return <ActivitiesPage />;
    if (currentPath.startsWith('/app/messages')) return <MessagingPage />;
    if (currentPath === '/app/matches') return <MatchesPage />;
    if (currentPath.startsWith('/app/profile') || currentPath === '/app/settings') return <ProfilePage />;
    if (currentPath === '/app/notifications') return <NotificationsPage />;
    if (currentPath === '/app/ai') return <OnboardingPage />;
    return <FeedPage />;
  };

  return (
    <div className="min-h-screen bg-[#10101B] text-white flex flex-col selection:bg-[#A77BFF]/30 selection:text-white">
      <AppHeader />

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        {/* Desktop Left Nav */}
        <DesktopSidebarNav />

        {/* Center Main Screen */}
        <main className="flex-1 min-w-0 pb-20 md:pb-6">
          {renderMainContent()}
        </main>
      </div>

      {/* Mobile Fixed Bottom Nav */}
      <MobileBottomNav />

      {/* Modals & Toasts */}
      <MatchCelebrationModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}
