import { useState } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth-fixed';
import { QueryProvider } from './components/providers/QueryProvider';
import { AuthLayout } from './components/templates/AuthLayout';
import { ModernLayout } from './components/layout/ModernLayout';
import { ModernDashboard } from './components/organisms/Dashboard/ModernDashboard';
import { EmptyState } from './components/molecules/EmptyState';
import { CalendarView } from './components/molecules/CalendarView';
import { TodaySessions } from './components/molecules/TodaySessions';
import { SupabaseTest } from './components/molecules/SupabaseTest';
import './styles/modern.css';

// Main App Component (inside AuthProvider)
const AppContent = () => {
  const { user, isAuthenticated, signIn, signUp, signOut, resetPassword } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Authentication handlers
  const handleLogin = async (email: string, password: string) => {
    const result = await signIn(email, password);
    return result;
  };

  const handleSignUp = async (data: any) => {
    const result = await signUp(data);
    return result;
  };

  const handleResetPassword = async (email: string) => {
    const result = await resetPassword(email);
    return result;
  };

  const handleLogout = async () => {
    await signOut();
    setActiveTab('dashboard');
  };

  // Navigation handlers
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleNewSession = () => {
    setActiveTab('new-session');
  };

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <ModernDashboard onNewSession={handleNewSession} onNavigate={handleTabChange} />;
      case 'sessions':
        return (
          <div className="space-y-6">
            {/* Header avec actions */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900">Planning des sessions</h2>
                <p className="text-neutral-600 mt-1">Gérez vos cours et formations avec le calendrier interactif</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-4 py-2 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors flex items-center gap-2">
                  <span>📊</span>
                  Vue planning
                </button>
                <button 
                  onClick={handleNewSession}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <span>+</span>
                  Nouvelle session
                </button>
              </div>
            </div>

            {/* Calendrier connecté aux données Supabase */}
            <CalendarView 
              onDateClick={(date) => console.log('Date cliquée:', date)}
              onEventClick={(eventId) => console.log('Session cliquée:', eventId)}
            />

            {/* Debug Supabase + Sessions du jour */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <TodaySessions 
                  onSessionClick={(sessionId) => console.log('Session sélectionnée:', sessionId)}
                />
              </div>

              <div className="space-y-6">
                {/* Debug Supabase temporaire */}
                <SupabaseTest />
                {/* Stats rapides */}
                <div className="bg-white rounded-xl border border-neutral-200 p-6">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Statistiques</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-neutral-600">Sessions ce mois</span>
                      <span className="font-semibold text-neutral-900">-</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-neutral-600">Étudiants actifs</span>
                      <span className="font-semibold text-neutral-900">-</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-neutral-600">Taux présence</span>
                      <span className="font-semibold text-green-600">-</span>
                    </div>
                  </div>
                  <div className="mt-4 text-xs text-neutral-500">
                    💡 Connecté aux données Supabase
                  </div>
                </div>

                {/* Actions rapides */}
                <div className="bg-white rounded-xl border border-neutral-200 p-6">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Actions rapides</h3>
                  <div className="space-y-2">
                    <button 
                      onClick={handleNewSession}
                      className="w-full p-3 text-left rounded-lg hover:bg-neutral-50 transition-colors flex items-center gap-3"
                    >
                      <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">📅</span>
                      <span className="text-sm font-medium">Créer une session</span>
                    </button>
                    <button className="w-full p-3 text-left rounded-lg hover:bg-neutral-50 transition-colors flex items-center gap-3">
                      <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">👥</span>
                      <span className="text-sm font-medium">Inviter des participants</span>
                    </button>
                    <button className="w-full p-3 text-left rounded-lg hover:bg-neutral-50 transition-colors flex items-center gap-3">
                      <span className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">📊</span>
                      <span className="text-sm font-medium">Voir les rapports</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'programs':
        return (
          <div className="p-8">
            <EmptyState
              illustration="sessions"
              title="Programmes de formation"
              description="Gérez vos programmes de formation, créez des parcours pédagogiques et organisez vos cursus. Cette fonctionnalité sera disponible prochainement."
            />
          </div>
        );
      case 'participants':
        return (
          <div className="p-8">
            <EmptyState
              illustration="students"
              title="Gestion des participants"
              description="Administrez les inscriptions, suivez les progrès des apprenants et gérez les présences. Cette section sera bientôt disponible."
            />
          </div>
        );
      case 'rooms':
        return (
          <div className="p-8">
            <EmptyState
              illustration="planning"
              title="Gestion des salles"
              description="Organisez vos espaces de formation, gérez les réservations et optimisez l'utilisation de vos locaux."
            />
          </div>
        );
      case 'diplomas':
        return (
          <div className="p-8">
            <EmptyState
              illustration="sessions"
              title="Certificats et diplômes"
              description="Créez et délivrez des certificats de formation personnalisés pour valoriser les acquis de vos apprenants."
            />
          </div>
        );
      case 'subjects':
        return (
          <div className="p-8">
            <EmptyState
              illustration="sessions"
              title="Catalogue des matières"
              description="Organisez votre offre pédagogique, définissez vos matières et structurez vos contenus de formation."
            />
          </div>
        );
      case 'zoom':
        return (
          <div className="p-8">
            <EmptyState
              illustration="calendar"
              title="Visioconférence"
              description="Intégrez vos outils de visioconférence (Zoom, Teams) pour les formations à distance et hybrides."
            />
          </div>
        );
      case 'emails':
        return (
          <div className="p-8">
            <EmptyState
              illustration="planning"
              title="Communication automatisée"
              description="Configurez vos notifications automatiques, rappels de sessions et communications avec les participants."
            />
          </div>
        );
      case 'settings':
        return (
          <div className="p-8">
            <EmptyState
              illustration="planning"
              title="Paramètres système"
              description="Configurez votre plateforme, gérez les utilisateurs et personnalisez l'interface selon vos besoins."
            />
          </div>
        );
      case 'new-session':
        return (
          <div className="p-8">
            <EmptyState
              illustration="sessions"
              title="Créer une nouvelle session"
              description="Planifiez une nouvelle session de formation en définissant le programme, les participants et les modalités."
            />
          </div>
        );
      default:
        return <ModernDashboard onNewSession={handleNewSession} onNavigate={handleTabChange} />;
    }
  };

  // Authentication page
  if (!isAuthenticated) {
    return (
      <AuthLayout 
        onLogin={handleLogin}
        onSignUp={handleSignUp}
        onResetPassword={handleResetPassword}
      />
    );
  }

  // Main application with modern layout
  return (
    <ModernLayout
      activeTab={activeTab}
      onTabChange={handleTabChange}
      user={user}
      onSignOut={handleLogout}
    >
      {renderContent()}
    </ModernLayout>
  );
};

// Root App Component with AuthProvider
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