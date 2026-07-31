import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingView from './components/LandingView';
import FullChatView from './components/FullChatView';
import DoubtSolverView from './components/DoubtSolverView';
import AdminView from './components/AdminView';
import ChatWidget from './components/ChatWidget';
import AuthModal from './components/AuthModal';
import { fetchStats } from './services/api';

export default function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'doubt-solver' | 'chat' | 'admin'
  const [activeQuery, setActiveQuery] = useState('');
  const [stats, setStats] = useState(null);

  // Auth State
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('eduassist_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('signup'); // 'signin' | 'signup'

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await fetchStats();
      setStats(data);
    } catch (e) {
      console.warn("Stats offline");
    }
  };

  const handleOpenAuth = (mode = 'signup') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const handleAuthSuccess = (userObj) => {
    setCurrentUser(userObj);
    localStorage.setItem('eduassist_user', JSON.stringify(userObj));
    // Redirect to Chatbot Assistant page upon login (or Admin Studio if Administrator)
    if (userObj.role === 'Administrator') {
      setCurrentView('admin');
    } else {
      setCurrentView('chat');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('eduassist_user');
    setCurrentView('landing');
  };

  const handleStartChatWithQuery = (queryText = '') => {
    if (queryText) {
      setActiveQuery(queryText);
    } else {
      setCurrentView('chat');
    }
  };

  return (
    <div className="min-h-screen bg-[#050811] text-[#f8fafc] flex flex-col font-sans relative selection:bg-teal-500 selection:text-black">
      
      {/* Global Navbar */}
      <Navbar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        stats={stats} 
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingView 
            onStartChat={handleStartChatWithQuery} 
            onOpenAuth={handleOpenAuth}
            currentUser={currentUser}
            stats={stats} 
            onNavigateDoubtSolver={() => setCurrentView('doubt-solver')}
          />
        )}

        {currentView === 'doubt-solver' && (
          <DoubtSolverView 
            currentUser={currentUser} 
            onOpenAuth={handleOpenAuth} 
          />
        )}

        {currentView === 'chat' && (
          <FullChatView currentUser={currentUser} />
        )}

        {currentView === 'admin' && (
          <AdminView currentUser={currentUser} onOpenAuth={handleOpenAuth} />
        )}
      </main>

      {/* Always-accessible Floating RAG Chatbot Widget */}
      <ChatWidget 
        activeQuery={activeQuery} 
        setActiveQuery={setActiveQuery} 
      />

      {/* Authentication Modal matching screenshot */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authMode}
        onAuthSuccess={handleAuthSuccess}
      />

    </div>
  );
}
