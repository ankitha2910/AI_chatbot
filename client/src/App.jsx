import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingView from './components/LandingView';
import StudentDashboardView from './components/StudentDashboardView';
import AdminView from './components/AdminView';
import AuthModal from './components/AuthModal';
import UserProfileModal from './components/UserProfileModal';
import { fetchStats } from './services/api';

export default function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'student-hub' | 'admin'
  const [stats, setStats] = useState(null);

  // Auth State with enriched role-specific fields
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('eduassist_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('signup'); // 'signin' | 'signup'
  const [authMessage, setAuthMessage] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);

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

  const handleOpenAuth = (mode = 'signin', customMsg = '') => {
    setAuthMode(mode);
    setAuthMessage(customMsg || 'Please sign in or create an account as a Student or Administrator to access this feature.');
    setIsAuthOpen(true);
  };

  const handleNavigate = (view) => {
    if (view !== 'landing' && !currentUser) {
      handleOpenAuth('signin', `Please sign in or create an account as a Student or Administrator to access ${view === 'student-hub' ? 'Student Hub' : view === 'admin' ? 'Admin Portal' : 'this page'}.`);
      return;
    }
    setCurrentView(view);
  };

  const handleAuthSuccess = (userObj) => {
    setCurrentUser(userObj);
    localStorage.setItem('eduassist_user', JSON.stringify(userObj));
    setAuthMessage('');
    // Redirect based on account role
    if (userObj.role === 'Administrator') {
      setCurrentView('admin');
    } else {
      setCurrentView('student-hub');
    }
  };

  const handleUpdateProfile = (updatedUser) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('eduassist_user', JSON.stringify(updatedUser));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('eduassist_user');
    setCurrentView('landing');
  };

  const handleStartChatWithQuery = (queryText = '') => {
    if (!currentUser) {
      handleOpenAuth('signin', 'Please sign in or create an account as a Student to ask questions.');
      return;
    }

    if (currentUser.role === 'Administrator') {
      setCurrentView('admin');
    } else {
      setCurrentView('student-hub');
    }
  };

  return (
    <div className="min-h-screen bg-[#050811] text-[#f8fafc] flex flex-col font-sans relative selection:bg-teal-500 selection:text-black">
      
      {/* Global Role-Aware Navbar */}
      <Navbar 
        currentView={currentView} 
        setCurrentView={handleNavigate} 
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {currentView === 'landing' && (
          <LandingView 
            onStartChat={handleStartChatWithQuery} 
            onOpenAuth={handleOpenAuth}
            currentUser={currentUser}
            stats={stats} 
            onNavigateStudentHub={() => handleNavigate('student-hub')}
            onOpenProfile={() => setIsProfileOpen(true)}
          />
        )}

        {currentView === 'student-hub' && (
          <StudentDashboardView 
            currentUser={currentUser}
            onOpenAuth={handleOpenAuth}
            onOpenProfile={() => setIsProfileOpen(true)}
            onLogout={handleLogout}
          />
        )}

        {currentView === 'admin' && (
          <AdminView 
            currentUser={currentUser} 
            onOpenAuth={handleOpenAuth} 
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* Authentication Modal with Role Selector */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => { setIsAuthOpen(false); setAuthMessage(''); }}
        initialMode={authMode}
        customMessage={authMessage}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* User Role Profile Management Modal */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentUser={currentUser}
        onUpdateProfile={handleUpdateProfile}
      />

    </div>
  );
}
