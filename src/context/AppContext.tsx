import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Match, Conversation } from '../types/index.ts';
import { fetchCurrentUser, fetchMatches, fetchConversations, switchRole } from '../lib/api.ts';

interface Toast {
  id: string;
  type: 'success' | 'info' | 'spark' | 'warning';
  title: string;
  message?: string;
}

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  currentPath: string;
  navigate: (path: string) => void;
  matches: Match[];
  setMatches: React.Dispatch<React.SetStateAction<Match[]>>;
  conversations: Conversation[];
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>;
  unreadCount: number;
  toasts: Toast[];
  showToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  activeMatchModal: User | null;
  setActiveMatchModal: React.Dispatch<React.SetStateAction<User | null>>;
  refreshUserData: () => Promise<void>;
  toggleRole: () => Promise<void>;
  activeUniverse: 'all' | 'love' | 'friends' | 'play' | 'experiences';
  setActiveUniverse: React.Dispatch<React.SetStateAction<'all' | 'love' | 'friends' | 'play' | 'experiences'>>;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname || '/');
  const [matches, setMatches] = useState<Match[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [activeMatchModal, setActiveMatchModal] = useState<User | null>(null);
  const [activeUniverse, setActiveUniverse] = useState<'all' | 'love' | 'friends' | 'play' | 'experiences'>('all');

  const navigate = (path: string) => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const refreshUserData = async () => {
    try {
      const user = await fetchCurrentUser();
      setCurrentUser(user);
      const m = await fetchMatches();
      setMatches(m);
      const c = await fetchConversations();
      setConversations(c);
    } catch (err) {
      console.error('Échec du chargement des données utilisateur:', err);
    }
  };

  useEffect(() => {
    refreshUserData();
  }, []);

  const toggleRole = async () => {
    if (!currentUser) return;
    const nextRole = currentUser.role === 'admin' ? 'user' : 'admin';
    const updated = await switchRole(nextRole);
    setCurrentUser(updated);
    showToast({
      type: 'info',
      title: `Mode actif : ${nextRole === 'admin' ? 'Administrateur' : 'Explorateur (Membre)'}`,
      message: nextRole === 'admin' ? 'Accès complet à la modération et aux métriques.' : 'Navigation normale en tant que membre.',
    });
    if (nextRole === 'admin') {
      navigate('/admin');
    } else {
      navigate('/app');
    }
  };

  const showToast = (toast: Omit<Toast, 'id'>) => {
    const id = `t-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const unreadCount = conversations.reduce((acc, curr) => acc + (curr.unreadCount || 0), 0);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        currentPath,
        navigate,
        matches,
        setMatches,
        conversations,
        setConversations,
        unreadCount,
        toasts,
        showToast,
        removeToast,
        activeMatchModal,
        setActiveMatchModal,
        refreshUserData,
        toggleRole,
        activeUniverse,
        setActiveUniverse,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp doit être utilisé au sein d’un AppProvider');
  }
  return context;
};
