import { useState } from 'react'
import { Calendar, GraduationCap, Users, Settings, Bell, Search, Plus, LogOut, Video, BarChart3, Mail, Building2, Award, BookOpen } from 'lucide-react'
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { fr } from 'date-fns/locale'

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { fr },
})

function App() {
  const [showAuth, setShowAuth] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [activeTab, setActiveTab] = useState('dashboard')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [calendarView, setCalendarView] = useState('month')

  // Données simulées pour le calendrier
  const events = [
    {
      id: 1,
      title: 'Formation Excel Avancé',
      start: new Date(2024, 11, 28, 9, 0),
      end: new Date(2024, 11, 28, 17, 0),
      type: 'presentiel',
      trainer: 'Sophie Martin',
      participants: 12
    },
    {
      id: 2,
      title: 'Leadership & Management',
      start: new Date(2024, 11, 29, 14, 0),
      end: new Date(2024, 11, 29, 18, 0),
      type: 'zoom',
      trainer: 'Pierre Dubois',
      participants: 8
    },
    {
      id: 3,
      title: 'Marketing Digital',
      start: new Date(2024, 11, 30, 10, 0),
      end: new Date(2024, 11, 30, 16, 0),
      type: 'hybride',
      trainer: 'Marie Leroy',
      participants: 15
    }
  ]

  // Simulation d'authentification pour test
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (email && password) {
      setShowAuth(false) // Simule une connexion réussie
    }
  }

  const handleLogout = () => {
    setShowAuth(true)
    setEmail('')
    setPassword('')
    setActiveTab('dashboard')
    setSearchTerm('')
  }

  const handleNewSession = () => {
    setActiveTab('new-session')
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      alert(`Recherche pour : "${searchTerm}" - À développer avec Supabase!`)
    }
  }

  const handleNotifications = () => {
    alert('Centre de notifications - À développer!')
  }

  // Page d'authentification
  if (showAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="mx-auto h-16 w-16 bg-blue-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Connexion
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Accédez à votre plateforme de formation
            </p>
          </div>

          <form className="card" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="sr-only">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                  placeholder="Adresse email"
                />
              </div>

              <div>
                <label htmlFor="password" className="sr-only">Mot de passe</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input"
                  placeholder="Mot de passe"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary w-full mt-6"
            >
              Se connecter
            </button>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500">
                Test : utilisez n'importe quel email/mot de passe
              </p>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // Dashboard principal
  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'sessions', name: 'Sessions Formation', icon: Calendar },
    { id: 'programs', name: 'Programmes', icon: GraduationCap },
    { id: 'participants', name: 'Participants', icon: Users },
    { id: 'rooms', name: 'Salles & Bâtiments', icon: Building2 },
    { id: 'diplomas', name: 'Diplômes', icon: Award },
    { id: 'subjects', name: 'Matières', icon: BookOpen },
    { id: 'zoom', name: 'Zoom/Visio', icon: Video },
    { id: 'emails', name: 'Emails Auto', icon: Mail },
    { id: 'settings', name: 'Paramètres', icon: Settings },
  ]

  const stats = [
    { label: 'Sessions ce mois', value: '47', change: '+12' },
    { label: 'Participants actifs', value: '284', change: '+28' },
    { label: 'Taux présence', value: '87%', change: '+5%' },
    { label: 'Salles utilisées', value: '8/12', change: '+2' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-glass border-b border-white/20 backdrop-blur-xl">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold font-heading tracking-tight text-white">TrainingHub</h1>
                <p className="text-sm text-white/80 font-medium">Centre de Formation Professionnelle</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher..."
                  className="input pl-10 pr-4 py-2 w-64"
                />
              </form>
              <button 
                onClick={handleNotifications}
                className="relative p-2 text-gray-400 hover:text-gray-600"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-700">
                    {email[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-gray-600"
                  title="Déconnexion"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-72 bg-glass-dark border-r border-white/10 min-h-screen backdrop-blur-xl">
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-lg font-bold font-heading text-white/90 mb-2">Navigation</h2>
              <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"></div>
            </div>
            <ul className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.id}>
                    <button 
                      onClick={() => setActiveTab(item.id)}
                      className={`nav-button ${
                        activeTab === item.id ? 'active' : ''
                      }`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span>{item.name}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-8 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-10 flex items-center justify-between">
              <div>
                <h2 className="text-4xl font-extrabold font-heading tracking-tight text-slate-900 mb-2">
                  {navigation.find(nav => nav.id === activeTab)?.name || 'Dashboard'}
                </h2>
                <p className="text-lg text-slate-600 font-medium">
                  {activeTab === 'dashboard' && 'Vue d\'ensemble de votre centre de formation'}
                  {activeTab === 'sessions' && 'Planification et gestion des sessions'}
                  {activeTab === 'programs' && 'Catalogue des programmes de formation'}
                  {activeTab === 'participants' && 'Gestion des apprenants et inscriptions'}
                  {activeTab === 'rooms' && 'Organisation des espaces et bâtiments'}
                  {activeTab === 'diplomas' && 'Configuration des certifications'}
                  {activeTab === 'subjects' && 'Catalogue des matières enseignées'}
                  {activeTab === 'zoom' && 'Configuration des outils de visioconférence'}
                  {activeTab === 'emails' && 'Automatisation des communications'}
                  {activeTab === 'settings' && 'Paramètres système et configuration'}
                </p>
              </div>
              {(activeTab === 'dashboard' || activeTab === 'sessions') && (
                <button 
                  onClick={handleNewSession}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Nouvelle Session</span>
                </button>
              )}
            </div>

            {/* Stats Grid */}
            {activeTab === 'dashboard' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-xl p-4 hover:bg-white hover:border-slate-300/80 transition-all duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-xs font-medium text-slate-500 mb-1 uppercase tracking-wide">{stat.label}</p>
                        <p className="text-xl font-bold text-slate-900">{stat.value}</p>
                      </div>
                      <div className="flex items-center space-x-1 bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md">
                        <span className="text-xs font-semibold">{stat.change}</span>
                        <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quick Actions Panel */}
            {activeTab === 'dashboard' && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                <button 
                  onClick={() => setActiveTab('new-session')}
                  className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-xl p-4 hover:bg-white hover:border-blue-300/80 hover:shadow-md transition-all duration-200 group"
                >
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <Plus className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-800">Nouvelle Session</h3>
                      <p className="text-xs text-slate-500">Créer une formation</p>
                    </div>
                  </div>
                </button>
                
                <button 
                  onClick={() => setActiveTab('sessions')}
                  className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-xl p-4 hover:bg-white hover:border-green-300/80 hover:shadow-md transition-all duration-200 group"
                >
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                      <Calendar className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-800">Planning</h3>
                      <p className="text-xs text-slate-500">Sessions à venir</p>
                    </div>
                  </div>
                </button>
                
                <button 
                  onClick={() => setActiveTab('participants')}
                  className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-xl p-4 hover:bg-white hover:border-purple-300/80 hover:shadow-md transition-all duration-200 group"
                >
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                      <Users className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-800">Participants</h3>
                      <p className="text-xs text-slate-500">Inscriptions</p>
                    </div>
                  </div>
                </button>
                
                <button 
                  onClick={() => setActiveTab('zoom')}
                  className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-xl p-4 hover:bg-white hover:border-orange-300/80 hover:shadow-md transition-all duration-200 group"
                >
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                      <Video className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-800">Zoom</h3>
                      <p className="text-xs text-slate-500">Visioconférence</p>
                    </div>
                  </div>
                </button>
              </div>
            )}

            {/* Content based on active tab */}
            {activeTab === 'dashboard' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Mini Calendar Widget */}
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Calendrier du mois</h3>
                  <div className="h-64">
                    <BigCalendar
                      localizer={localizer}
                      events={events}
                      startAccessor="start"
                      endAccessor="end"
                      view="month"
                      views={['month']}
                      toolbar={false}
                      formats={{
                        dateFormat: 'dd',
                        dayHeaderFormat: 'eeeeee',
                        monthHeaderFormat: 'MMMM yyyy'
                      }}
                      eventPropGetter={(event) => ({
                        style: {
                          backgroundColor: event.type === 'zoom' ? '#10b981' : 
                                         event.type === 'hybride' ? '#f59e0b' : '#3b82f6',
                          border: 'none',
                          color: 'white',
                          borderRadius: '4px',
                          fontSize: '11px',
                          padding: '1px 3px'
                        }
                      })}
                      onSelectEvent={() => setActiveTab('sessions')}
                    />
                  </div>
                </div>

                {/* Sessions Today */}
                <div className="card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Aujourd'hui</h3>
                    <span className="text-sm text-gray-500">{format(new Date(), 'dd MMMM', { locale: fr })}</span>
                  </div>
                  <div className="space-y-3">
                    {events.filter(event => 
                      format(event.start, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
                    ).map((session, index) => (
                      <div key={index} className="p-3 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900 text-sm">{session.title}</h4>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            session.type === 'zoom' ? 'bg-green-100 text-green-800' :
                            session.type === 'hybride' ? 'bg-orange-100 text-orange-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {session.type}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">{session.trainer}</p>
                        <p className="text-xs text-gray-500">
                          {format(session.start, 'HH:mm')} - {format(session.end, 'HH:mm')}
                        </p>
                      </div>
                    ))}
                    {events.filter(event => 
                      format(event.start, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
                    ).length === 0 && (
                      <p className="text-gray-500 text-sm text-center py-4">Aucune session aujourd'hui</p>
                    )}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Activités récentes</h3>
                    <button 
                      onClick={() => setActiveTab('sessions')}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Voir tout
                    </button>
                  </div>
                  <div className="space-y-3">
                    {[
                      { action: 'Nouvelle session', program: 'Excel Avancé', trainer: 'Sophie Martin', time: 'Il y a 5 min', type: 'Présentiel' },
                      { action: 'Session modifiée', program: 'Leadership', trainer: 'Pierre Dubois', time: 'Il y a 15 min', type: 'Zoom' },
                      { action: 'Session annulée', program: 'Marketing Digital', trainer: 'Marie Leroy', time: 'Il y a 30 min', type: 'Hybride' },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 rounded-lg border border-gray-200">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-2 ${
                          activity.type === 'Zoom' ? 'bg-green-500' : 
                          activity.type === 'Hybride' ? 'bg-orange-500' : 'bg-blue-500'
                        }`}></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                          <p className="text-xs text-gray-600">{activity.program}</p>
                          <p className="text-xs text-gray-500">{activity.trainer} • {activity.type}</p>
                        </div>
                        <div className="text-xs text-gray-400">{activity.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'new-session' && (
              <div className="max-w-2xl">
                <div className="card">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Créer une nouvelle session</h3>
                  <form className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Titre de la session</label>
                        <input type="text" className="input" placeholder="Ex: Formation Excel Niveau 2" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Programme</label>
                        <select className="input">
                          <option value="">Sélectionner un programme</option>
                          <option value="excel">Excel Avancé</option>
                          <option value="leadership">Leadership Management</option>
                          <option value="marketing">Marketing Digital</option>
                          <option value="projet">Gestion de Projet</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Type de session</label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { id: 'in_person', label: 'Présentiel', icon: '🏢' },
                          { id: 'online', label: 'Distanciel (Zoom)', icon: '💻' },
                          { id: 'hybrid', label: 'Hybride', icon: '🔄' }
                        ].map((type) => (
                          <label key={type.id} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                            <input type="radio" name="session_type" value={type.id} className="mr-3" />
                            <span className="text-2xl mr-2">{type.icon}</span>
                            <span className="font-medium">{type.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date de début</label>
                        <input type="datetime-local" className="input" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date de fin</label>
                        <input type="datetime-local" className="input" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Salle</label>
                        <select className="input">
                          <option value="">Sélectionner une salle</option>
                          <option value="alpha">Salle Alpha (20 places)</option>
                          <option value="beta">Salle Beta (15 places)</option>
                          <option value="lab">Lab Informatique (12 places)</option>
                          <option value="zoom">Zoom Room 1 (100 places)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nombre max de participants</label>
                        <input type="number" className="input" min="1" max="100" defaultValue="20" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea className="input" rows={3} placeholder="Description de la session..."></textarea>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">🔗 Intégration Zoom (Optionnel)</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-blue-700 mb-1">ID Réunion Zoom</label>
                          <input type="text" className="input" placeholder="123-456-7890" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-blue-700 mb-1">Lien de participation</label>
                          <input type="url" className="input" placeholder="https://zoom.us/j/..." />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-blue-700 mb-1">Mot de passe (optionnel)</label>
                          <input type="text" className="input" placeholder="Mot de passe de la réunion" />
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <button type="submit" className="btn-primary">
                        Créer la session
                      </button>
                      <button type="button" onClick={() => setActiveTab('dashboard')} className="btn-secondary">
                        Annuler
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {activeTab === 'zoom' && (
              <div className="space-y-6">
                <div className="card">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Configuration Zoom/Teams</h3>
                    <button className="btn-primary">
                      + Ajouter une configuration
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900">🔗 Intégrations actives</h4>
                      <div className="space-y-3">
                        {[
                          { platform: 'Zoom Pro', status: 'Connecté', rooms: 5, color: 'green' },
                          { platform: 'Microsoft Teams', status: 'En attente', rooms: 0, color: 'orange' }
                        ].map((integration, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className={`w-3 h-3 rounded-full bg-${integration.color}-500`}></div>
                              <div>
                                <p className="font-medium">{integration.platform}</p>
                                <p className="text-sm text-gray-500">{integration.status} • {integration.rooms} salles virtuelles</p>
                              </div>
                            </div>
                            <button className="text-blue-600 hover:text-blue-700 text-sm">Configurer</button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900">📊 Statistiques Visio</h4>
                      <div className="space-y-3">
                        {[
                          { metric: 'Sessions ce mois', value: '23', platform: 'Zoom' },
                          { metric: 'Participants uniques', value: '187', platform: 'Zoom' },
                          { metric: 'Durée totale', value: '42h', platform: 'Zoom' },
                          { metric: 'Taux participation', value: '89%', platform: 'Global' }
                        ].map((stat, index) => (
                          <div key={index} className="flex justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium">{stat.metric}</span>
                            <span className="text-sm font-bold text-blue-600">{stat.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Sessions Zoom à venir</h3>
                  <div className="space-y-3">
                    {[
                      { title: 'Excel Avancé - Groupe A', date: '25/02/2026 14:00', participants: '12/20', link: 'https://zoom.us/j/123456789' },
                      { title: 'Leadership Management', date: '26/02/2026 09:30', participants: '8/15', link: 'https://zoom.us/j/987654321' },
                      { title: 'Marketing Digital - Session 2', date: '27/02/2026 16:00', participants: '18/20', link: 'https://zoom.us/j/456789123' }
                    ].map((session, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{session.title}</h4>
                          <p className="text-sm text-gray-500">{session.date} • {session.participants} participants</p>
                        </div>
                        <div className="flex space-x-2">
                          <button className="btn-secondary text-sm">
                            Copier lien
                          </button>
                          <button className="btn-primary text-sm">
                            Rejoindre
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'sessions' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">Planning des Sessions</h3>
                  <div className="flex space-x-3">
                    <div className="flex space-x-2 bg-white border border-gray-200 rounded-lg p-1">
                      <button 
                        onClick={() => setCalendarView('month')}
                        className={`px-3 py-1 text-sm rounded ${calendarView === 'month' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                      >
                        Mois
                      </button>
                      <button 
                        onClick={() => setCalendarView('week')}
                        className={`px-3 py-1 text-sm rounded ${calendarView === 'week' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                      >
                        Semaine
                      </button>
                      <button 
                        onClick={() => setCalendarView('day')}
                        className={`px-3 py-1 text-sm rounded ${calendarView === 'day' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                      >
                        Jour
                      </button>
                    </div>
                    <button onClick={handleNewSession} className="btn-primary">
                      + Nouvelle session
                    </button>
                  </div>
                </div>
                
                {/* Interactive Calendar */}
                <div className="card">
                  <div className="h-calendar">
                    <BigCalendar
                      localizer={localizer}
                      events={events}
                      startAccessor="start"
                      endAccessor="end"
                      view={calendarView as any}
                      onView={setCalendarView}
                      onNavigate={setCurrentDate}
                      date={currentDate}
                      views={['month', 'week', 'day']}
                      messages={{
                        next: "Suivant",
                        previous: "Précédent",
                        today: "Aujourd'hui",
                        month: "Mois",
                        week: "Semaine", 
                        day: "Jour",
                        agenda: "Agenda",
                        date: "Date",
                        time: "Heure",
                        event: "Événement",
                        noEventsInRange: "Aucune session dans cette période",
                        showMore: (total: number) => `+ ${total} de plus`
                      }}
                      formats={{
                        dateFormat: 'dd',
                        dayHeaderFormat: 'eeee dd/MM',
                        dayRangeHeaderFormat: ({ start, end }, culture, localizer) =>
                          localizer?.format(start, 'dd MMMM', culture) + ' - ' + localizer?.format(end, 'dd MMMM yyyy', culture),
                        monthHeaderFormat: 'MMMM yyyy',
                        timeGutterFormat: 'HH:mm',
                        eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
                          localizer?.format(start, 'HH:mm', culture) + ' - ' + localizer?.format(end, 'HH:mm', culture),
                        selectRangeFormat: ({ start, end }, culture, localizer) =>
                          localizer?.format(start, 'HH:mm', culture) + ' - ' + localizer?.format(end, 'HH:mm', culture)
                      }}
                      eventPropGetter={(event) => ({
                        style: {
                          backgroundColor: event.type === 'zoom' ? '#10b981' : 
                                         event.type === 'hybride' ? '#f59e0b' : '#3b82f6',
                          border: 'none',
                          color: 'white',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '500',
                          padding: '3px 6px'
                        }
                      })}
                      dayPropGetter={(date) => ({
                        style: {
                          backgroundColor: format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') ? '#eff6ff' : 'white'
                        }
                      })}
                      onSelectEvent={(event) => alert(`Session: ${event.title}\nFormateur: ${event.trainer}\nParticipants: ${event.participants}`)}
                      onSelectSlot={({ start }) => {
                        if (window.confirm(`Créer une nouvelle session le ${format(start, 'dd/MM/yyyy à HH:mm', { locale: fr })} ?`)) {
                          setActiveTab('new-session')
                        }
                      }}
                      selectable
                    />
                  </div>
                </div>

                {/* Session List */}
                <div className="card">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">Sessions à venir</h4>
                    <div className="flex space-x-2">
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-xs text-gray-600">Présentiel</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-gray-600">Zoom</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                        <span className="text-xs text-gray-600">Hybride</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {[
                      { title: 'Excel Avancé - Formation intensive', date: '28/02/2026', time: '14:00-17:00', type: 'Présentiel', salle: 'Salle Alpha', participants: '12/20', status: 'confirmed', trainer: 'Sophie Martin' },
                      { title: 'Leadership et Management d\'équipe', date: '29/02/2026', time: '09:30-12:30', type: 'Zoom', salle: 'Zoom Room 1', participants: '8/15', status: 'confirmed', trainer: 'Pierre Dubois' },
                      { title: 'Marketing Digital - Les bases', date: '27/02/2026', time: '16:00-18:00', type: 'Hybride', salle: 'Salle Beta + Zoom', participants: '18/20', status: 'confirmed' },
                      { title: 'Gestion de projet Agile', date: '28/02/2026', time: '10:00-16:00', type: 'Présentiel', salle: 'Lab Informatique', participants: '10/12', status: 'pending' }
                    ].map((session, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center space-x-4">
                          <div className={`w-3 h-3 rounded-full ${
                            session.type === 'Zoom' ? 'bg-green-500' : 
                            session.type === 'Hybride' ? 'bg-orange-500' : 'bg-blue-500'
                          }`}></div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{session.title}</h4>
                            <p className="text-sm text-gray-500">
                              {session.date} {session.time} • {session.salle} • {session.participants} participants
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            session.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                          }`}>
                            {session.status === 'confirmed' ? 'Confirmée' : 'En attente'}
                          </span>
                          <button className="text-blue-600 hover:text-blue-700 text-sm">Modifier</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'programs' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">Programmes de formation</h3>
                  <button className="btn-primary">
                    + Nouveau programme
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { name: 'Excel Avancé', code: 'EXCEL-ADV', duration: 14, participants: 12, color: '#10B981', sessions: 3, rating: 4.8 },
                    { name: 'Leadership Management', code: 'LEAD-MGT', duration: 21, participants: 15, color: '#F59E0B', sessions: 2, rating: 4.6 },
                    { name: 'Marketing Digital', code: 'MARK-DIG', duration: 28, participants: 20, color: '#EF4444', sessions: 4, rating: 4.9 },
                    { name: 'Gestion de Projet', code: 'PROJ-MGT', duration: 35, participants: 18, color: '#8B5CF6', sessions: 2, rating: 4.7 },
                    { name: 'Communication', code: 'COMM-101', duration: 7, participants: 25, color: '#06B6D4', sessions: 1, rating: 4.5 },
                    { name: 'Négociation', code: 'NEG-PRO', duration: 14, participants: 10, color: '#EC4899', sessions: 1, rating: 4.8 }
                  ].map((program, index) => (
                    <div key={index} className="card hover:shadow-lg transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${program.color}20` }}>
                          <div className="w-6 h-6 rounded" style={{ backgroundColor: program.color }}></div>
                        </div>
                        <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-700 rounded-full">{program.code}</span>
                      </div>
                      <h4 className="font-bold text-lg text-gray-900 mb-2">{program.name}</h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Durée :</span>
                          <span className="font-medium">{program.duration}h</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Max participants :</span>
                          <span className="font-medium">{program.participants}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Sessions actives :</span>
                          <span className="font-medium">{program.sessions}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Note moyenne :</span>
                          <span className="font-bold text-orange-600">{program.rating}/5 ⭐</span>
                        </div>
                      </div>
                      <div className="mt-4 flex space-x-2">
                        <button className="btn-secondary text-sm flex-1">Modifier</button>
                        <button className="btn-primary text-sm flex-1">Nouvelle session</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'participants' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">Gestion des participants</h3>
                  <div className="flex space-x-3">
                    <select className="input">
                      <option>Tous les statuts</option>
                      <option>Inscrits</option>
                      <option>Confirmés</option>
                      <option>Présents</option>
                      <option>Absents</option>
                    </select>
                    <button className="btn-primary">
                      + Ajouter participant
                    </button>
                  </div>
                </div>

                <div className="card">
                  <div className="space-y-4">
                    {[
                      { name: 'Marie Dupont', email: 'marie.dupont@email.com', company: 'TechCorp', sessions: 2, status: 'Confirmé', lastSession: 'Excel Avancé', payment: 'Payé' },
                      { name: 'Jean Martin', email: 'jean.martin@email.com', company: 'StartupXYZ', sessions: 1, status: 'Inscrit', lastSession: 'Leadership', payment: 'En attente' },
                      { name: 'Sophie Bernard', email: 'sophie.bernard@email.com', company: 'GlobalLtd', sessions: 3, status: 'Présent', lastSession: 'Marketing Digital', payment: 'Payé' },
                      { name: 'Pierre Durand', email: 'pierre.durand@email.com', company: 'InnovateCorp', sessions: 1, status: 'Absent', lastSession: 'Gestion Projet', payment: 'Remboursé' },
                      { name: 'Claire Moreau', email: 'claire.moreau@email.com', company: 'DigitalPro', sessions: 4, status: 'Confirmé', lastSession: 'Communication', payment: 'Payé' }
                    ].map((participant, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="font-medium text-blue-700">{participant.name[0]}</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{participant.name}</h4>
                            <p className="text-sm text-gray-500">{participant.email} • {participant.company}</p>
                            <p className="text-xs text-gray-400">Dernière session : {participant.lastSession}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-sm font-medium">{participant.sessions} session{participant.sessions > 1 ? 's' : ''}</p>
                            <div className="flex space-x-2">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                participant.status === 'Présent' ? 'bg-green-100 text-green-800' :
                                participant.status === 'Confirmé' ? 'bg-blue-100 text-blue-800' :
                                participant.status === 'Inscrit' ? 'bg-orange-100 text-orange-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {participant.status}
                              </span>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                participant.payment === 'Payé' ? 'bg-green-100 text-green-800' :
                                participant.payment === 'En attente' ? 'bg-orange-100 text-orange-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {participant.payment}
                              </span>
                            </div>
                          </div>
                          <button className="text-blue-600 hover:text-blue-700 text-sm">Voir détail</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900">Paramètres du centre de formation</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div className="card">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Informations générales</h4>
                      <form className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Nom du centre</label>
                          <input type="text" className="input" defaultValue="FormaPro Paris" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                          <input type="text" className="input" defaultValue="123 Avenue des Champs-Elysees, Paris" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                            <input type="tel" className="input" defaultValue="+33 1 23 45 67 89" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input type="email" className="input" defaultValue="contact@formapro-paris.fr" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Site web</label>
                          <input type="url" className="input" defaultValue="https://formapro-paris.fr" />
                        </div>
                        <button type="submit" className="btn-primary">
                          Sauvegarder
                        </button>
                      </form>
                    </div>

                    <div className="card">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Utilisateurs et rôles</h4>
                      <div className="space-y-3">
                        {[
                          { name: 'Admin Principal', email: 'admin@formapro-paris.fr', role: 'admin', status: 'Actif' },
                          { name: 'Sophie Martin', email: 'sophie.martin@formapro-paris.fr', role: 'trainer', status: 'Actif' },
                          { name: 'Pierre Dubois', email: 'pierre.dubois@formapro-paris.fr', role: 'coordinator', status: 'Actif' },
                          { name: 'Marie Leroy', email: 'marie.leroy@formapro-paris.fr', role: 'trainer', status: 'Inactif' }
                        ].map((user, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-blue-700">{user.name[0]}</span>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{user.name}</p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className="text-sm font-medium text-gray-700 capitalize">{user.role}</span>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                user.status === 'Actif' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {user.status}
                              </span>
                              <button className="text-blue-600 hover:text-blue-700 text-sm">Modifier</button>
                            </div>
                          </div>
                        ))}
                        <button className="btn-secondary w-full">
                          + Inviter un utilisateur
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="card">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Intégrations</h4>
                      <div className="space-y-4">
                        {[
                          { service: 'Zoom Pro', status: 'Connecté', icon: '📹', color: 'green' },
                          { service: 'Microsoft Teams', status: 'Non configuré', icon: '💼', color: 'gray' },
                          { service: 'Google Calendar', status: 'Connecté', icon: '📅', color: 'green' },
                          { service: 'Mailchimp', status: 'En cours', icon: '📧', color: 'orange' },
                          { service: 'Stripe', status: 'Connecté', icon: '💳', color: 'green' }
                        ].map((integration, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl">{integration.icon}</span>
                              <div>
                                <p className="font-medium text-gray-900">{integration.service}</p>
                                <p className="text-sm text-gray-500">{integration.status}</p>
                              </div>
                            </div>
                            <button className="btn-secondary text-sm">
                              {integration.status === 'Connecté' ? 'Configurer' : 'Connecter'}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="card">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Facturation & Abonnement</h4>
                      <div className="space-y-4">
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <div className="flex justify-between items-center">
                            <div>
                              <h5 className="font-semibold text-blue-900">Plan Professional</h5>
                              <p className="text-sm text-blue-700">Jusqu'à 500 participants/mois</p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-blue-900">49€</p>
                              <p className="text-sm text-blue-700">/mois</p>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Prochaine facturation :</span>
                            <span className="text-sm font-medium">25 mars 2026</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Participants ce mois :</span>
                            <span className="text-sm font-medium">284 / 500</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="btn-secondary text-sm flex-1">Changer de plan</button>
                          <button className="btn-primary text-sm flex-1">Voir factures</button>
                        </div>
                      </div>
                    </div>

                    <div className="card">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Sauvegardes & Export</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">Dernière sauvegarde</p>
                            <p className="text-sm text-gray-500">Aujourd'hui à 03:00</p>
                          </div>
                          <span className="text-green-600 text-sm">✓ Réussie</span>
                        </div>
                        <button className="btn-secondary w-full">Exporter toutes les données</button>
                        <button className="btn-secondary w-full">Créer une sauvegarde manuelle</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'emails' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">Automatisation Email</h3>
                  <button className="btn-primary">
                    + Nouveau template
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="card">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Templates d'emails</h4>
                      <div className="space-y-3">
                        {[
                          { name: 'Confirmation d\'inscription', type: 'confirmation', status: 'Actif', sent: 23 },
                          { name: 'Rappel 24h avant', type: 'reminder', status: 'Actif', sent: 18 },
                          { name: 'Lien Zoom - 30min avant', type: 'zoom_link', status: 'Actif', sent: 12 },
                          { name: 'Suivi post-formation', type: 'follow_up', status: 'Brouillon', sent: 0 },
                          { name: 'Annulation de session', type: 'cancellation', status: 'Actif', sent: 3 }
                        ].map((template, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                            <div className="flex items-center space-x-3">
                              <div className={`w-2 h-2 rounded-full ${
                                template.type === 'confirmation' ? 'bg-blue-500' :
                                template.type === 'reminder' ? 'bg-orange-500' :
                                template.type === 'zoom_link' ? 'bg-green-500' :
                                template.type === 'follow_up' ? 'bg-purple-500' : 'bg-red-500'
                              }`}></div>
                              <div>
                                <p className="font-medium text-gray-900">{template.name}</p>
                                <p className="text-sm text-gray-500">{template.sent} envoyés ce mois</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                template.status === 'Actif' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {template.status}
                              </span>
                              <button className="text-blue-600 hover:text-blue-700 text-sm">Modifier</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="card">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Historique des envois</h4>
                      <div className="space-y-3">
                        {[
                          { template: 'Confirmation d\'inscription', recipient: 'marie.dupont@email.com', session: 'Excel Avancé', sent: 'Il y a 2h', status: 'Délivré' },
                          { template: 'Lien Zoom', recipient: 'jean.martin@email.com', session: 'Leadership', sent: 'Il y a 3h', status: 'Délivré' },
                          { template: 'Rappel 24h', recipient: 'sophie.bernard@email.com', session: 'Marketing Digital', sent: 'Il y a 5h', status: 'Ouvert' },
                          { template: 'Annulation', recipient: 'pierre.durand@email.com', session: 'Gestion Projet', sent: 'Hier', status: 'Échec' }
                        ].map((log, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{log.template}</p>
                              <p className="text-sm text-gray-500">{log.recipient} • {log.session}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-400">{log.sent}</p>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                log.status === 'Délivré' ? 'bg-green-100 text-green-800' :
                                log.status === 'Ouvert' ? 'bg-blue-100 text-blue-800' :
                                log.status === 'Échec' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {log.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="card">
                      <h4 className="font-semibold text-gray-900 mb-4">📊 Statistiques Email</h4>
                      <div className="space-y-4">
                        {[
                          { metric: 'Emails envoyés (30j)', value: '156', color: 'blue' },
                          { metric: 'Taux de délivrance', value: '98.7%', color: 'green' },
                          { metric: 'Taux d\'ouverture', value: '67.3%', color: 'orange' },
                          { metric: 'Taux de clic', value: '23.1%', color: 'purple' }
                        ].map((stat, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">{stat.metric}</span>
                            <span className={`text-lg font-bold text-${stat.color}-600`}>{stat.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="card">
                      <h4 className="font-semibold text-gray-900 mb-4">⚙️ Automatisations actives</h4>
                      <div className="space-y-3">
                        {[
                          { trigger: 'Nouvelle inscription', action: 'Email confirmation', active: true },
                          { trigger: '24h avant session', action: 'Email rappel', active: true },
                          { trigger: '30min avant Zoom', action: 'Envoi lien', active: true },
                          { trigger: 'Fin de formation', action: 'Suivi satisfaction', active: false }
                        ].map((automation, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{automation.trigger}</p>
                              <p className="text-xs text-gray-500">{automation.action}</p>
                            </div>
                            <div className={`w-8 h-4 rounded-full ${automation.active ? 'bg-green-400' : 'bg-gray-300'} relative cursor-pointer`}>
                              <div className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-transform ${automation.active ? 'translate-x-4' : 'translate-x-0.5'}`}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="card">
                      <h4 className="font-semibold text-gray-900 mb-4">🔧 Configuration SMTP</h4>
                      <div className="space-y-3">
                        <div className="text-sm">
                          <span className="text-gray-500">Serveur SMTP :</span>
                          <span className="ml-2 font-medium">smtp.gmail.com</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-500">Statut :</span>
                          <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Connecté</span>
                        </div>
                        <button className="btn-secondary text-sm w-full">
                          Modifier configuration
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'rooms' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">Gestion des Salles & Bâtiments</h3>
                  <div className="flex space-x-3">
                    <button className="btn-secondary">+ Nouveau bâtiment</button>
                    <button className="btn-primary">+ Nouvelle salle</button>
                  </div>
                </div>

                {/* Buildings and Rooms */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Buildings List */}
                  <div className="card">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Bâtiments</h4>
                    <div className="space-y-3">
                      {[
                        { name: 'Bâtiment Principal', code: 'A', rooms: 8, address: '123 Rue de la Formation', status: 'active' },
                        { name: 'Annexe Informatique', code: 'B', rooms: 4, address: '125 Rue de la Formation', status: 'active' },
                        { name: 'Centre de Conférences', code: 'C', rooms: 3, address: '127 Rue de la Formation', status: 'maintenance' }
                      ].map((building, index) => (
                        <div key={index} className="p-4 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <span className="font-bold text-blue-600">{building.code}</span>
                              </div>
                              <div>
                                <h5 className="font-medium text-gray-900">{building.name}</h5>
                                <p className="text-sm text-gray-500">{building.address}</p>
                              </div>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              building.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                            }`}>
                              {building.status === 'active' ? 'Actif' : 'Maintenance'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">{building.rooms} salles</span>
                            <div className="flex space-x-2">
                              <button className="text-blue-600 hover:text-blue-700">Modifier</button>
                              <button className="text-red-600 hover:text-red-700">Supprimer</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Rooms List */}
                  <div className="card">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Salles de Formation</h4>
                    <div className="space-y-3">
                      {[
                        { name: 'Salle Alpha', building: 'A', floor: 1, capacity: 20, equipment: ['Vidéoprojecteur', 'Tableau'], status: 'available' },
                        { name: 'Salle Beta', building: 'A', floor: 1, capacity: 15, equipment: ['PC', 'Écrans'], status: 'occupied' },
                        { name: 'Lab Informatique', building: 'B', floor: 0, capacity: 12, equipment: ['PC', 'Logiciels'], status: 'available' },
                        { name: 'Amphithéâtre', building: 'C', floor: 0, capacity: 50, equipment: ['Sonorisation', 'Caméras'], status: 'maintenance' }
                      ].map((room, index) => (
                        <div key={index} className="p-3 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              <div className={`w-3 h-3 rounded-full ${
                                room.status === 'available' ? 'bg-green-500' :
                                room.status === 'occupied' ? 'bg-red-500' : 'bg-orange-500'
                              }`}></div>
                              <div>
                                <h5 className="font-medium text-gray-900">{room.name}</h5>
                                <p className="text-xs text-gray-500">Bât. {room.building} - Étage {room.floor}</p>
                              </div>
                            </div>
                            <span className="text-sm font-medium text-gray-600">{room.capacity} pers.</span>
                          </div>
                          <div className="text-xs text-gray-500 mb-2">
                            Équipements: {room.equipment.join(', ')}
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className={`px-2 py-1 rounded-full ${
                              room.status === 'available' ? 'bg-green-100 text-green-800' :
                              room.status === 'occupied' ? 'bg-red-100 text-red-800' :
                              'bg-orange-100 text-orange-800'
                            }`}>
                              {room.status === 'available' ? 'Disponible' :
                               room.status === 'occupied' ? 'Occupée' : 'Maintenance'}
                            </span>
                            <div className="flex space-x-2">
                              <button className="text-blue-600 hover:text-blue-700">Planifier</button>
                              <button className="text-gray-600 hover:text-gray-700">Modifier</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Room Planning Calendar */}
                <div className="card">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Planning des Salles</h4>
                  <div className="grid grid-cols-7 gap-1 text-center text-sm">
                    <div className="font-semibold p-2 bg-gray-50">Lun</div>
                    <div className="font-semibold p-2 bg-gray-50">Mar</div>
                    <div className="font-semibold p-2 bg-gray-50">Mer</div>
                    <div className="font-semibold p-2 bg-gray-50">Jeu</div>
                    <div className="font-semibold p-2 bg-gray-50">Ven</div>
                    <div className="font-semibold p-2 bg-gray-50">Sam</div>
                    <div className="font-semibold p-2 bg-gray-50">Dim</div>
                    
                    {Array.from({ length: 35 }, (_, i) => (
                      <div key={i} className="h-20 p-1 border border-gray-100 text-xs">
                        <div className="mb-1 font-medium">{(i % 31) + 1}</div>
                        {i === 5 && <div className="bg-blue-100 text-blue-800 px-1 rounded">Alpha 9h-17h</div>}
                        {i === 12 && <div className="bg-green-100 text-green-800 px-1 rounded">Lab 14h-18h</div>}
                        {i === 19 && <div className="bg-purple-100 text-purple-800 px-1 rounded">Beta 10h-16h</div>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'diplomas' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">Gestion des Diplômes</h3>
                  <button className="btn-primary">+ Nouveau diplôme</button>
                </div>

                {/* Diplomas Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { 
                      name: 'Certificate en Marketing Digital', 
                      code: 'CMD-2024', 
                      level: 'Certificat', 
                      duration: '6 mois', 
                      subjects: 5, 
                      students: 45,
                      color: '#3B82F6',
                      status: 'active'
                    },
                    { 
                      name: 'Diplôme Management & Leadership', 
                      code: 'DML-2024', 
                      level: 'Diplôme', 
                      duration: '12 mois', 
                      subjects: 8, 
                      students: 32,
                      color: '#10B981',
                      status: 'active'
                    },
                    { 
                      name: 'Certification Gestion de Projet', 
                      code: 'CGP-2024', 
                      level: 'Certification', 
                      duration: '4 mois', 
                      subjects: 4, 
                      students: 28,
                      color: '#F59E0B',
                      status: 'draft'
                    },
                    { 
                      name: 'Master en Business Intelligence', 
                      code: 'MBI-2024', 
                      level: 'Master', 
                      duration: '24 mois', 
                      subjects: 12, 
                      students: 18,
                      color: '#8B5CF6',
                      status: 'active'
                    },
                    { 
                      name: 'Certificate Développement Web', 
                      code: 'CDW-2024', 
                      level: 'Certificat', 
                      duration: '8 mois', 
                      subjects: 6, 
                      students: 52,
                      color: '#EF4444',
                      status: 'active'
                    },
                    { 
                      name: 'Diploma Communication Corporate', 
                      code: 'DCC-2024', 
                      level: 'Diplôme', 
                      duration: '10 mois', 
                      subjects: 7, 
                      students: 24,
                      color: '#06B6D4',
                      status: 'pending'
                    }
                  ].map((diploma, index) => (
                    <div key={index} className="card hover:shadow-lg transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${diploma.color}20` }}>
                          <Award className="w-6 h-6" style={{ color: diploma.color }} />
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                          diploma.status === 'active' ? 'bg-green-100 text-green-800' :
                          diploma.status === 'draft' ? 'bg-orange-100 text-orange-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {diploma.status === 'active' ? 'Actif' :
                           diploma.status === 'draft' ? 'Brouillon' : 'En attente'}
                        </span>
                      </div>
                      
                      <h4 className="font-bold text-lg text-gray-900 mb-2">{diploma.name}</h4>
                      <p className="text-sm text-gray-500 mb-4">{diploma.code}</p>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Niveau :</span>
                          <span className="font-medium">{diploma.level}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Durée :</span>
                          <span className="font-medium">{diploma.duration}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Matières :</span>
                          <span className="font-medium">{diploma.subjects} matières</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Étudiants :</span>
                          <span className="font-medium">{diploma.students} inscrits</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex space-x-2">
                        <button className="btn-secondary text-sm flex-1">Modifier</button>
                        <button className="btn-primary text-sm flex-1">Voir détails</button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add New Diploma Form */}
                <div className="card">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Créer un nouveau diplôme</h4>
                  <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nom du diplôme</label>
                      <input type="text" className="input" placeholder="Ex: Certificate en Data Science" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Code diplôme</label>
                      <input type="text" className="input" placeholder="Ex: CDS-2024" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Niveau</label>
                      <select className="input">
                        <option value="">Sélectionner un niveau</option>
                        <option value="certificat">Certificat</option>
                        <option value="diplome">Diplôme</option>
                        <option value="licence">Licence</option>
                        <option value="master">Master</option>
                        <option value="doctorat">Doctorat</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Durée</label>
                      <select className="input">
                        <option value="">Sélectionner la durée</option>
                        <option value="3">3 mois</option>
                        <option value="6">6 mois</option>
                        <option value="12">12 mois</option>
                        <option value="24">24 mois</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea className="input" rows={3} placeholder="Description du diplôme et de ses objectifs..."></textarea>
                    </div>
                    <div className="md:col-span-2">
                      <button type="submit" className="btn-primary">Créer le diplôme</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {activeTab === 'subjects' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">Gestion des Matières</h3>
                  <button className="btn-primary">+ Nouvelle matière</button>
                </div>

                {/* Subjects by Category */}
                <div className="space-y-6">
                  {[
                    {
                      category: 'Management & Leadership',
                      color: '#3B82F6',
                      subjects: [
                        { name: 'Leadership Stratégique', code: 'LS-101', hours: 40, instructor: 'Pierre Dubois', difficulty: 'Avancé' },
                        { name: 'Gestion d\'Équipe', code: 'GE-102', hours: 30, instructor: 'Marie Leroy', difficulty: 'Intermédiaire' },
                        { name: 'Communication Managériale', code: 'CM-103', hours: 25, instructor: 'Sophie Martin', difficulty: 'Débutant' }
                      ]
                    },
                    {
                      category: 'Technologies & Informatique',
                      color: '#10B981',
                      subjects: [
                        { name: 'Développement Web Frontend', code: 'DWF-201', hours: 60, instructor: 'Alexandre Petit', difficulty: 'Intermédiaire' },
                        { name: 'Base de Données SQL', code: 'BDD-202', hours: 45, instructor: 'Julie Moreau', difficulty: 'Débutant' },
                        { name: 'Intelligence Artificielle', code: 'IA-203', hours: 80, instructor: 'Thomas Bernard', difficulty: 'Avancé' }
                      ]
                    },
                    {
                      category: 'Marketing & Communication',
                      color: '#F59E0B',
                      subjects: [
                        { name: 'Marketing Digital', code: 'MD-301', hours: 35, instructor: 'Claire Durand', difficulty: 'Intermédiaire' },
                        { name: 'Réseaux Sociaux', code: 'RS-302', hours: 20, instructor: 'Antoine Roux', difficulty: 'Débutant' },
                        { name: 'SEO/SEA Avancé', code: 'SEO-303', hours: 40, instructor: 'Laura Blanc', difficulty: 'Avancé' }
                      ]
                    },
                    {
                      category: 'Finance & Gestion',
                      color: '#8B5CF6',
                      subjects: [
                        { name: 'Comptabilité Générale', code: 'CG-401', hours: 50, instructor: 'Michel Garnier', difficulty: 'Débutant' },
                        { name: 'Analyse Financière', code: 'AF-402', hours: 45, instructor: 'Nathalie Rousseau', difficulty: 'Avancé' },
                        { name: 'Contrôle de Gestion', code: 'CDG-403', hours: 55, instructor: 'Philippe Lefebvre', difficulty: 'Avancé' }
                      ]
                    }
                  ].map((category, categoryIndex) => (
                    <div key={categoryIndex} className="card">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }}></div>
                        <h4 className="text-lg font-semibold text-gray-900">{category.category}</h4>
                        <span className="text-sm text-gray-500">({category.subjects.length} matières)</span>
                      </div>
                      
                      <div className="space-y-3">
                        {category.subjects.map((subject, subjectIndex) => (
                          <div key={subjectIndex} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                            <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                <BookOpen className="w-5 h-5 text-gray-600" />
                              </div>
                              <div>
                                <h5 className="font-medium text-gray-900">{subject.name}</h5>
                                <p className="text-sm text-gray-500">{subject.code} • {subject.hours}h • {subject.instructor}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                              <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                                subject.difficulty === 'Débutant' ? 'bg-green-100 text-green-800' :
                                subject.difficulty === 'Intermédiaire' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {subject.difficulty}
                              </span>
                              
                              <div className="flex space-x-2">
                                <button className="text-blue-600 hover:text-blue-700 text-sm">Modifier</button>
                                <button className="text-green-600 hover:text-green-700 text-sm">Sessions</button>
                                <button className="text-red-600 hover:text-red-700 text-sm">Supprimer</button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Subject Form */}
                <div className="card">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Ajouter une nouvelle matière</h4>
                  <form className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nom de la matière</label>
                      <input type="text" className="input" placeholder="Ex: Python pour Data Science" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Code matière</label>
                      <input type="text" className="input" placeholder="Ex: PDS-501" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                      <select className="input">
                        <option value="">Sélectionner une catégorie</option>
                        <option value="management">Management & Leadership</option>
                        <option value="tech">Technologies & Informatique</option>
                        <option value="marketing">Marketing & Communication</option>
                        <option value="finance">Finance & Gestion</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nombre d'heures</label>
                      <input type="number" className="input" placeholder="Ex: 40" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Formateur</label>
                      <input type="text" className="input" placeholder="Nom du formateur" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Niveau de difficulté</label>
                      <select className="input">
                        <option value="">Sélectionner le niveau</option>
                        <option value="debutant">Débutant</option>
                        <option value="intermediaire">Intermédiaire</option>
                        <option value="avance">Avancé</option>
                      </select>
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea className="input" rows={3} placeholder="Objectifs pédagogiques, prérequis, contenu du programme..."></textarea>
                    </div>
                    <div className="md:col-span-3">
                      <button type="submit" className="btn-primary">Ajouter la matière</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default App