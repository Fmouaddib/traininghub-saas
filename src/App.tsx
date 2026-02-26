import { useState, useEffect, lazy, Suspense } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { QueryProvider } from './components/providers/QueryProvider';
import { AuthLayout } from './components/templates/AuthLayout';
import { ModernLayout } from './components/layout/ModernLayout';
import { ToastContainer } from './components/molecules/ToastContainer';
import { useToast } from './hooks/useToast';
import { SuperAdminGuard } from './components/super-admin/SuperAdminGuard';
import './styles/modern.css';

// Lazy-load super admin app
const SuperAdminApp = lazy(() => import('./components/super-admin/SuperAdminApp').then(m => ({ default: m.SuperAdminApp })));

// Lazy-loaded pages
const ModernDashboard = lazy(() => import('./components/organisms/Dashboard/ModernDashboard').then(m => ({ default: m.ModernDashboard })));
const SessionsPage = lazy(() => import('./components/pages/SessionsPage').then(m => ({ default: m.SessionsPage })));
const RoomsPage = lazy(() => import('./components/pages/RoomsPage').then(m => ({ default: m.RoomsPage })));
const ParticipantsPage = lazy(() => import('./components/pages/ParticipantsPage').then(m => ({ default: m.ParticipantsPage })));
const NewSessionPage = lazy(() => import('./components/pages/NewSessionPage').then(m => ({ default: m.NewSessionPage })));
const ProgramsPage = lazy(() => import('./components/pages/ProgramsPage').then(m => ({ default: m.ProgramsPage })));
const DiplomasPage = lazy(() => import('./components/pages/DiplomasPage').then(m => ({ default: m.DiplomasPage })));
const SubjectsPage = lazy(() => import('./components/pages/SubjectsPage').then(m => ({ default: m.SubjectsPage })));
const ClassesPage = lazy(() => import('./components/pages/ClassesPage').then(m => ({ default: m.ClassesPage })));
const ZoomPage = lazy(() => import('./components/pages/ZoomPage').then(m => ({ default: m.ZoomPage })));
const EmailsPage = lazy(() => import('./components/pages/EmailsPage').then(m => ({ default: m.EmailsPage })));
const SettingsPage = lazy(() => import('./components/pages/SettingsPage').then(m => ({ default: m.SettingsPage })));

const PageLoader = () => (
  <div className="flex items-center justify-center p-12">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#002F5D]"></div>
  </div>
);

// Main App Component (inside AuthProvider)
const AppContent = () => {
  const { user, isAuthenticated, signIn, signUp, signOut, resetPassword } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [hash, setHash] = useState(window.location.hash);
  const { toasts, removeToast } = useToast();

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Redirect super_admin users to #/super-admin
  const isSuperAdminUser = user?.profile?.role === 'super_admin';
  useEffect(() => {
    if (isAuthenticated && isSuperAdminUser && !hash.startsWith('#/super-admin')) {
      window.location.hash = '#/super-admin';
    }
  }, [isAuthenticated, isSuperAdminUser, hash]);

  const handleLogin = async (email: string, password: string) => {
    return await signIn(email, password);
  };

  const handleSignUp = async (data: { email: string; password: string; fullName: string; role?: string; phone?: string }) => {
    return await signUp(data);
  };

  const handleResetPassword = async (email: string) => {
    return await resetPassword(email);
  };

  const handleLogout = async () => {
    await signOut();
    setActiveTab('dashboard');
  };

  const handleTabChange = (tab: string) => setActiveTab(tab);
  const handleNewSession = () => setActiveTab('new-session');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <ModernDashboard onNewSession={handleNewSession} onNavigate={handleTabChange} />;
      case 'sessions':
        return <SessionsPage onNewSession={handleNewSession} />;
      case 'classes':
        return <ClassesPage />;
      case 'programs':
        return <ProgramsPage />;
      case 'participants':
        return <ParticipantsPage />;
      case 'rooms':
        return <RoomsPage />;
      case 'diplomas':
        return <DiplomasPage />;
      case 'subjects':
        return <SubjectsPage />;
      case 'zoom':
        return <ZoomPage />;
      case 'emails':
        return <EmailsPage />;
      case 'settings':
        return <SettingsPage />;
      case 'new-session':
        return <NewSessionPage onBack={() => setActiveTab('sessions')} />;
      default:
        return <ModernDashboard onNewSession={handleNewSession} onNavigate={handleTabChange} />;
    }
  };

  if (!isAuthenticated) {
    return (
      <AuthLayout
        onLogin={handleLogin}
        onSignUp={handleSignUp}
        onResetPassword={handleResetPassword}
      />
    );
  }

  // Super Admin routing
  const isSuperAdminRoute = hash.startsWith('#/super-admin');

  if (isSuperAdminRoute) {
    return (
      <SuperAdminGuard>
        <Suspense fallback={
          <div className="flex items-center justify-center p-12" style={{ minHeight: '100vh' }}>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e74c3c]"></div>
          </div>
        }>
          <SuperAdminApp />
        </Suspense>
      </SuperAdminGuard>
    );
  }

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <ModernLayout
        activeTab={activeTab}
        onTabChange={handleTabChange}
        user={user}
        onSignOut={handleLogout}
      >
        <Suspense fallback={<PageLoader />}>
          {renderContent()}
        </Suspense>
      </ModernLayout>
    </>
  );
};

function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </QueryProvider>
  );
}

export default App;
