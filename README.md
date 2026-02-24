# TrainingHub - Plateforme de Gestion de Centres de Formation

## 🎯 Présentation

TrainingHub est une solution SaaS complète dédiée à la gestion de centres de formation professionnelle. Elle permet de gérer facilement les sessions de formation, qu'elles soient en présentiel, distanciel ou hybrides.

## ✨ Fonctionnalités principales

### 📚 Gestion des formations
- **Sessions multi-modalités** : Présentiel, Distanciel (Zoom/Teams), Hybride
- **Programmes personnalisables** : Création et gestion de programmes de formation
- **Calendrier intégré** : Planification et visualisation des sessions

### 👥 Gestion des participants
- **Inscriptions en ligne** : Interface simple pour les participants
- **Suivi des présences** : Gestion automatique des présences
- **Statuts de paiement** : Suivi des paiements et facturation

### 🎥 Intégrations vidéo
- **Zoom Pro** : Intégration native avec création automatique de liens
- **Microsoft Teams** : Support pour les réunions Teams
- **Salles virtuelles** : Gestion des salles permanentes et temporaires

### 📧 Automatisation email
- **Templates personnalisables** : Emails de confirmation, rappels, annulations
- **Envois automatiques** : Déclencheurs basés sur les événements
- **Statistiques d'ouverture** : Suivi des performances des campagnes
- **Liens Zoom automatiques** : Envoi 30min avant les sessions

### 📊 Tableaux de bord
- **Analytics en temps réel** : Métriques de performance
- **Rapports financiers** : Revenus, taux de présence, ROI
- **Statistiques participants** : Engagement et satisfaction

## 🛠 Technologies utilisées

- **Frontend** : React 18 + TypeScript + Vite
- **Styling** : CSS custom (Tailwind-inspired utilities)
- **Backend** : Supabase (PostgreSQL + Auth + Realtime)
- **Déploiement** : Vercel
- **Intégrations** : Zoom API, Teams API, SMTP

## 🚀 Installation locale

1. **Cloner le repository**
```bash
git clone [repository-url]
cd planning-ecole-saas
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration Supabase**
Créer un fichier `.env.local` :
```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-cle-anonyme
```

4. **Lancer en développement**
```bash
npm run dev
```

5. **Base de données**
Exécuter le script `cleanup-and-create.sql` dans l'éditeur SQL de Supabase.

## 📦 Structure du projet

```
src/
├── App.tsx              # Application principale
├── index.css           # Styles CSS utilities
├── main.tsx            # Point d'entrée React
└── components/         # (À développer)
```

## 🗄️ Schéma de base de données

### Tables principales :
- `profiles` : Utilisateurs (formateurs, coordinateurs, admins)
- `training_centers` : Centres de formation
- `rooms` : Salles physiques et virtuelles
- `programs` : Programmes de formation
- `training_sessions` : Sessions de formation
- `session_participants` : Participants aux sessions
- `email_templates` : Templates d'emails
- `email_logs` : Historique des envois

### Types personnalisés :
- `user_role` : admin, trainer, coordinator, staff
- `session_type` : in_person, online, hybrid
- `session_status` : scheduled, in_progress, completed, cancelled
- `room_type` : classroom, meeting_room, lab, auditorium, virtual

## 🔐 Sécurité

- **Row Level Security (RLS)** activé sur toutes les tables
- **Authentification Supabase** avec gestion des rôles
- **Politiques d'accès** granulaires selon les profils utilisateurs

## 🚀 Déploiement Vercel

1. **Connecter le repository à Vercel**
2. **Configurer les variables d'environnement** :
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. **Déployer automatiquement** à chaque push

## 📧 Support

Pour toute question ou support technique, contactez l'équipe de développement.

## 📄 Licence

Propriétaire - Tous droits réservés

---

**TrainingHub** - La solution complète pour votre centre de formation 🎓
