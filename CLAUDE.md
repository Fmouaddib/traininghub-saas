# TrainingHub SaaS - Guide de Configuration

## 🏗️ Architecture
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **Styling**: CSS personnalisé (sans Tailwind pour éviter les conflits)
- **Déploiement**: Vercel

## 📧 Email - Brevo (9000 emails gratuits/mois)
```bash
# Variables d'environnement nécessaires
VITE_BREVO_API_KEY=your_brevo_api_key_here
```

**Configuration Brevo:**
1. Créer un compte sur https://www.brevo.com
2. Aller dans "SMTP & API" > "API Keys"
3. Créer une nouvelle clé API
4. Ajouter la clé dans `.env.production`

## 🎥 Zoom Integration
```bash
# Variables d'environnement nécessaires
VITE_ZOOM_ACCOUNT_ID=your_zoom_account_id_here
VITE_ZOOM_CLIENT_ID=your_zoom_client_id_here
VITE_ZOOM_CLIENT_SECRET=your_zoom_client_secret_here
```

**Configuration Zoom:**
1. Créer une app Zoom sur https://marketplace.zoom.us
2. Choisir "Server-to-Server OAuth"
3. Récupérer Account ID, Client ID, Client Secret
4. Ajouter les clés dans `.env.production`

## 💳 Stripe Paiements
```bash
# Variables d'environnement nécessaires
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
VITE_STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
```

**Configuration Stripe:**
1. Créer un compte sur https://stripe.com
2. Récupérer les clés API (test puis live)
3. Ajouter les clés dans `.env.production`

## 🚀 Commandes de Développement
```bash
# Démarrer en développement
npm run dev

# Build de production
npm run build

# Linter
npm run lint

# Preview du build
npm run preview
```

## 🗄️ Base de Données Supabase
Le schéma complet est dans `cleanup-and-create.sql`:
- Tables: profiles, training_centers, rooms, programs, training_sessions, session_participants
- RLS policies configurées
- Triggers pour les timestamps

## 📂 Structure des Fichiers
```
src/
  lib/
    email.ts      # Service email Brevo
    zoom.ts       # API Zoom integration
    stripe.ts     # Paiements Stripe
    supabase.ts   # Client Supabase
  components/     # Composants React
  App.tsx         # Application principale
  index.css       # Styles personnalisés
```

## 🔧 Mode Simulation
L'application fonctionne en mode simulation si les clés API ne sont pas configurées:
- ✅ Emails simulés avec logs console
- ✅ Meetings Zoom simulés
- ✅ Paiements Stripe simulés

## 🌐 Déploiement Vercel
```bash
# Installer Vercel CLI
npm install -g vercel

# Déployer
vercel

# Configurer les variables d'environnement sur vercel.com
```

## 📊 Fonctionnalités
- ✅ Gestion des centres de formation
- ✅ Sessions multi-modales (présentiel, en ligne, hybride)
- ✅ Système d'inscription et de paiement
- ✅ Automation email avec templates professionnels
- ✅ Intégration Zoom pour sessions en ligne
- ✅ Dashboard avec statistiques
- ✅ Authentification utilisateurs
- ✅ Responsive design

## 🔒 Sécurité
- Row Level Security (RLS) activée
- Authentification Supabase
- Variables d'environnement sécurisées
- Validation des formulaires avec Zod