# LeRéseau - Application Frontend (React/Vite)

> Interface utilisateur de la plateforme **LeRéseau**, une solution numérique innovante connectant les étudiants, les professionnels, les mentors certifiés et les institutions académiques/entreprises.

## 🛠️ Stack Technique Frontend

| Technologie | Rôle |
|---|---|
| **React 18** | Bibliothèque UI principale |
| **Vite** | Bundler ultra-rapide et environnement de dev |
| **TypeScript** | Typage statique pour la sécurité du code |
| **Tailwind CSS** | Styling utilitaire et mode sombre (`dark mode`) |
| **React Router DOM** | Gestion des routes et navigation SPA |
| **Lucide React** | Bibliothèque d'icônes vectorielles |
| **Socket.IO Client** | Communication temps-réel (Chat, Notifications) |
| **React Player** | Lecteur multimédia natif (MP4, YouTube, Vimeo) |
| **React Markdown / KaTeX**| Rendu du texte riche, formules mathématiques (Forum/Feed) |

---

## 🗺️ Parcours Utilisateurs (User Journeys)

La plateforme est conçue autour de plusieurs expériences utilisateurs distinctes, adaptées au rôle de la personne connectée.

### 1. 🚪 Parcours Visiteur & Onboarding (Authentification)
*Dossier : `src/pages/auth/`*

Le premier contact avec la plateforme garantit sécurité et simplicité :
- **Inscription** : L'utilisateur choisit son type de profil (Étudiant, Professionnel, ou Institution). Il renseigne ses informations de base.
- **Vérification OTP** : Un code à 6 chiffres est envoyé par email. L'utilisateur doit le saisir pour valider son compte.
- **Récupération de compte** : En cas de perte de mot de passe, un flux sécurisé via OTP par email permet de redéfinir le mot de passe sans friction.

---

### 2. 🎓 Parcours Étudiant
L'étudiant est au centre de l'écosystème d'apprentissage.
- **Accueil / Fil d'actualité (`/feed`)** : Il accède à un flux d'actualités contenant des posts, vidéos, images, et articles publiés par le réseau et les institutions. Il peut liker, commenter et interagir.
- **Réseautage (`/network`)** : Il peut envoyer des demandes de connexion à d'autres étudiants ou à des professionnels pour demander du mentorat.
- **Bibliothèque (`/library`)** : Il recherche des documents, annales, ou cours (PDF/DOCX). Certains sont gratuits, d'autres sont payants (Premium).
- **Forum (`/forum`)** : Il peut rejoindre des chaînes thématiques, poser des questions, lire les réponses des mentors et liker les meilleures interventions.
- **Chatbot IA (`/chatbot`)** : Il bénéficie d'un assistant virtuel (propulsé par IA) pour répondre à ses questions d'orientation ou de méthodologie.

---

### 3. 💼 Parcours Professionnel & Mentor
Le professionnel partage son expertise et peut monétiser son savoir.
- **Profil Public & CV (`/profile`)** : Il peut renseigner son parcours académique (`Educations`) et ses expériences professionnelles (`Experiences`).
- **Demande de Certification** : Depuis son profil, il peut soumettre une demande de certification (via l'upload de justificatifs). Une fois approuvé par un admin, il obtient un badge "Mentor Certifié".
- **Abonnement Premium** : Il peut souscrire à un abonnement (via Stripe/CinetPay) pour devenir Premium.
- **Publication Autonome (Premium)** : 
  - Il peut publier directement dans le **Fil d'actualité** (Images, Galeries, Vidéos YouTube/MP4).
  - Il peut publier des **Documents** payants ou gratuits dans la bibliothèque et générer des revenus.
- **Mentorat** : Il reçoit des demandes de connexion d'étudiants, peut y répondre via le **Chat en direct (`/chat`)** et interagir sur le **Forum**.

---

### 4. 🏛️ Parcours Institution (Écoles, Universités, Entreprises)
L'institution gère sa visibilité et sa marque employeur/académique.
- **Page Institutionnelle** : Vitrine publique affichant les informations de l'entité. Les étudiants peuvent "S'abonner" (Follow) à l'institution.
- **Publications Officielles** : Comme les mentors Premium, l'institution peut publier des communiqués, des vidéos institutionnelles, et des documents officiels.
- **Opportunités (`/opportunities`)** : (À venir) Publication d'offres de stage, d'alternance ou de bourses.

---

### 5. 🛡️ Parcours Administrateur (CMS Back-Office)
*Dossier : `src/pages/admin/cms/`*

Un espace dédié et ultra-sécurisé pour gérer la santé de la plateforme :
- **Tableau de Bord (`AdminCMSDashboardTab`)** : Vue d'ensemble des KPIs (nombre d'utilisateurs, revenus, activité du forum).
- **Gestion des Utilisateurs (`AdminCMSUsersTab`)** : Suspension, suppression, et gestion des rôles.
- **Validation des Requêtes (`AdminCMSCertificationsTab` / Premium)** : Examen manuel des justificatifs (NINEA, CNI, Diplômes) pour approuver ou rejeter le statut Mentor ou Premium.
- **Modération du Forum (`AdminCMSForumTab`)** : Gestion des signalements (Reports). L'admin peut supprimer un topic/commentaire inapproprié ou ignorer le signalement. Gestion des chaînes du forum.
- **Publication Officielle (`AdminCMSLibraryTab`, `AdminCMSFeedTab`)** : L'équipe LeRéseau peut publier du contenu natif, épingler des annonces globales ou alimenter la bibliothèque.

---

## 🏗️ Architecture des Dossiers

```text
src/
├── assets/             # Images statiques, logos
├── components/         # Composants réutilisables
│   ├── auth/           # Composants liés à la connexion (RequireAuth)
│   ├── layout/         # Navigation, Sidebar, Footer, Header
│   ├── network/        # Cartes de connexion, boutons d'abonnement
│   ├── profile/        # Formulaires d'édition de profil, listes de publications
│   └── ui/             # Composants génériques (Boutons, Modales, Inputs)
├── contexts/           # React Contexts (AuthContext, ThemeContext)
├── i18n/               # Fichiers de traduction (multilingue)
├── pages/              # Vues complètes par route
│   ├── admin/          # Vues du Back-Office CMS
│   ├── auth/           # Vues Login, Register, OTP
│   ├── main/           # Vues privées (Feed, Library, Forum, Chat, Network)
│   └── public/         # Vues publiques (Landing Page, About, Contact)
├── services/           # Appels API Axios (auth.ts, feed.ts, publishing.ts...)
├── types/              # Interfaces TypeScript (User, Document, FeedPost)
└── main.tsx            # Point d'entrée de l'application
```

---

## 🧩 Fonctionnalités UI Clés

- **Modales d'Aperçu Intelligentes** : Lorsqu'un utilisateur clique sur un post ou un document depuis son profil, une modale dynamique s'ouvre. Elle affiche intelligemment les médias (reconnaissance auto des URL YouTube vs MP4), les grilles d'images, et charge les commentaires en temps réel.
- **Mode Sombre (Dark Mode)** : Intégration native dans tous les composants Tailwind (`dark:bg-slate-900`, `dark:text-white`), basculable par l'utilisateur.
- **Responsive Design** : L'interface est mobile-first. Les sidebars se transforment en menus "hamburger" sur smartphone, garantissant une expérience fluide sur mobile et tablette.
- **Feedback Utilisateur** : Utilisation de "Toasts" pour les messages de succès/erreur, et de "Skeleton Screens" (écrans de chargement animés) pour masquer la latence réseau pendant le chargement des données (ex: Bibliothèque).

---

## 🚀 Installation & Démarrage Rapide

### Prérequis
- Node.js (v18+)
- NPM ou Yarn

### Commandes

```bash
# 1. Cloner le projet
git clone https://github.com/lereseau/frontend.git
cd frontend

# 2. Installer les dépendances
npm install

# 3. Variables d'environnement
cp .env.example .env
# Modifier VITE_API_URL pour pointer vers le backend (ex: http://localhost:8000)

# 4. Lancer le serveur de développement
npm run dev
```

L'application sera accessible sur `http://localhost:5173`.
