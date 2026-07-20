# Spécifications Techniques Backend - LeRéseau (V3 Définitive & Exhaustive)

Ce document liste l'intégralité de l'architecture Backend, des modèles de données et des endpoints nécessaires pour supporter **toutes** les pages développées sur le Frontend (Espace Public, Espace Membre, et Back-Office Administrateur complet).

---

## 1. Modèles de Données Exhaustifs (JSON Structures)

### 1.1 Utilisateur & Profil Complexe (`User`, `Experience`, `Education`)
Lié à `ProfilePage.tsx` et `SettingsPage.tsx`. Gère les spécificités des étudiants, professionnels et institutions.
```json
{
  "id": "uuid",
  "email": "contact@entreprise.com",
  "phone": "+225 0123456789",
  "passwordHash": "$argon2id$v=19$m=...", // Ne jamais exposer en GET
  "firstName": "Jean",
  "lastName": "Kouassi", // Ou Nom de la structure si institution
  "roleType": "student", // student, professional, institution
  "role": "USER", // USER, ADMIN, SUPER_ADMIN
  "avatarUrl": "https://...",
  "coverUrl": "https://...",
  "status": "VERIFIED", // PENDING, VERIFIED, BANNED
  "about": "Présentation de l'utilisateur ou de l'institution...",
  
  // Spécifique Étudiant
  "educationLevel": "Master 1",
  "studyDomain": "Informatique",

  // Spécifique Professionnel
  "jobTitle": "Data Engineer",
  "workDomain": "Tech",

  // Spécifique Institution
  "institutionType": "Université",
  "institutionDetails": "Détails supplémentaires (accréditations, etc...)",
  "nineaUploaded": true, // KYC Institution

  "points": 450, // Gamification
  "isPremium": false, // Booléen 
  "stripeCustomerId": "cus_xxxxxxxxx", 
  
  // Tokens & Authentification
  "refreshToken": "jwt_xxxx...", // Pour garder la session active (HTTP-Only)
  
  // Relations Profil
  "experiences": [
     { "id": 1, "title": "Stagiaire Data", "company": "Orange CI", "startDate": "2025-06", "endDate": "2025-09", "description": "..." }
  ],
  "education": [
     { "id": 1, "school": "Polytechnique", "degree": "Master", "startDate": "2024", "endDate": "2026", "description": "..." }
  ],
  "skills": ["Python", "TensorFlow", "React", "Node.js"],
  "location": "Abidjan, CI",
  "linkedin": "https://linkedin.com/in/...",
  
  // Préférences (SettingsPage)
  "settings": {
    "emailNotifications": true,
    "darkMode": "dark", // light, dark, system
    "profileVisibility": "PUBLIC" // PUBLIC, NETWORK_ONLY, PRIVATE
  },
  "lastActive": "2026-03-31T12:00:00Z",
  "createdAt": "2026-01-15T08:30:00Z"
}
```

### 1.2 Mise en Relation (`Connection`)
Lié au réseautage global (Amis, Suggestions, Mentors, Relations) sur `NetworkPage.tsx`.
```json
{
  "id": "uuid",
  "requesterId": "uuid_user1",
  "addresseeId": "uuid_user2",
  "status": "PENDING", // PENDING, ACCEPTED, REJECTED, BLOCKED
  "type": "FRIEND", // FRIEND (collègues/amis), MENTORSHIP (étudiant vers mentor)
  "createdAt": "2026-04-01T08:00:00Z"
}
```

### 1.3 Bourse et Opportunité (`Opportunity`)
Lié à `OpportunitiesPage.tsx` et la publication in-situ des Institutions limitées (`ProfilePage.tsx`).
```json
{
  "id": "uuid",
  "authorId": "uuid_institution", // Si publié par une institution via son profil
  "type": "SCHOLARSHIP", // SCHOLARSHIP, INTERNSHIP, JOB
  "title": "Bourse d'Excellence Master IA",
  "organization": "Fondation X",
  "fundingSource": "Programme d'Excellence d'État",
  "targetAudience": "Étudiants en fin de cycle universitaire (Bac +4/5)",
  "attachments": [
     { "type": "IMAGE", "url": "https://..." },
     { "type": "VIDEO", "url": "https://..." }
  ],
  "location": "Paris, France / Hybride",
  "amount": "5000 € / an",
  "duration": "1 an",
  "description": "Nous recherchons des candidats...",
  "missions": ["Participation active aux projets", "Algorithmes"],
  "benefits": ["Accompagnement", "Allocation"],
  "fundingDetails": {
    "amount": "1000 € / mois",
    "coverage": ["Frais de scolarité", "Billet d'avion", "Logement"]
  },
  "eligibilityRequirements": ["Moins de 25 ans", "Ressortissant d'un pays africain"],
  "selectionCriteria": ["Excellence académique (Moyenne > 14/20)", "Cohérence du projet professionnel", "Qualité de la lettre de motivation"],
  "applicationProcess": [
    { "step": 1, "title": "Candidature en ligne", "description": "Soumission du dossier complet sur la plateforme web." },
    { "step": 2, "title": "Entretiens de motivation", "description": "Phase d'entretien devant un jury d'experts." },
    { "step": 3, "title": "Validation technique", "description": "Test technique à distance." }
  ],
  "importantDates": [
    { "event": "Ouverture des candidatures", "date": "2026-05-01T00:00:00Z" },
    { "event": "Clôture des dépôts", "date": "2026-10-15T23:59:59Z" },
    { "event": "Résultats finaux", "date": "2026-11-20T00:00:00Z" }
  ],
  "contactPerson": {
    "name": "Marie Curie",
    "role": "Responsable des Admissions",
    "email": "m.curie@fondation-x.org"
  },
  "requiredDocuments": ["CV", "Lettre de motivation", "Relevés de notes", "Passeport"],
  "requirements": ["Master 1", "Anglais B2"],
  "domain": "Sciences", // Domaine général
  "category": "Master", // Master, Doctorat, Stage
  "tags": ["Python", "IA"],
  "deadline": "2026-10-15T23:59:59Z",
  "contactInfo": "contact@fondation-x.org",
  "applyUrl": "https://...",
  "isPremiumOnly": false,
  "isBoosted": true, // Si l'institution est Premium (Propulsion activée)
  "isActive": true,
  "aiMatchScore": 92 // Calculé dynamiquement pour l'utilisateur courant via le Radar
}
```

### 1.4 Fil d'Actualité (`FeedPost`)
Lié à `FeedPage.tsx`. Les publications supportent plusieurs formats et médias.
```json
{
  "id": "uuid",
  "authorId": "uuid_user",
  "content": "Je viens de valider mon semestre !",
  "type": "MEDIA", // TEXT, IMAGE, VIDEO, PDF, RECOMMENDED_OPPORTUNITY
  "attachments": [ 
    { "type": "IMAGE", "url": "https://...", "order": 1 },
    { "type": "IMAGE", "url": "https://...", "order": 2 },
    { "type": "VIDEO", "url": "https://..." },
    { "type": "PDF", "url": "https://...", "name": "Cours.pdf" }
  ],
  "likesCount": 12,
  "commentsCount": 4,
  "createdAt": "2026-03-31T10:00:00Z"
}
```

### 1.5 Forum (`ForumChannel`, `ForumTopic`, `ForumReply`)
Lié à `ForumPage.tsx`. Gère les popups et canaux.
```json
// Channel
{
  "id": "uuid",
  "name": "général",
  "slug": "general",
  "description": "Espace de discussion générale.",
  "unreadCount": 5 // Dynamique, calculé par utilisateur courant
}

// Topic
{
  "id": "uuid",
  "channelId": "uuid_channel",
  "authorId": "uuid_user",
  "title": "Avis sur le Master Spécialisé en IA ?",
  "content": "Quelqu'un a-t-il fait ce master ? Quels sont les débouchés ?",
  "viewsCount": 150,
  "repliesCount": 12,
  "likesCount": 8,
  "createdAt": "2026-03-31T14:20:00Z"
}

// Reply
{
  "id": "uuid",
  "topicId": "uuid_topic",
  "authorId": "uuid_user",
  "content": "C'est une excellente formation très pointue.",
  "likesCount": 3,
  "createdAt": "2026-03-31T15:00:00Z"
}
```

### 1.6 Messagerie (`Conversation` & `Message`)
Lié à `ChatPage.tsx`.
```json
// Conversation
{
  "id": "uuid",
  "participants": ["uuid_user1", "uuid_user2"],
  "lastMessageText": "À demain !",
  "lastMessageAt": "2026-03-31T14:00:00Z",
  "unreadCount": { "uuid_user1": 0, "uuid_user2": 1 }
}

// Message
{
  "id": "uuid",
  "conversationId": "uuid_conversation",
  "senderId": "uuid_user1",
  "content": "À demain !",
  "type": "TEXT", // TEXT, IMAGE, DOCUMENT
  "status": "DELIVERED", // SENT, DELIVERED, READ
  "createdAt": "2026-03-31T14:00:00Z"
}
```

### 1.7 Documents Premium & Bibliothèque (`Document`)
Lié à `LibraryPage.tsx`, aux uploads depuis le profil des Professionnels et aux achats (`DocumentDetailsPage.tsx`).
```json
{
  "id": "uuid",
  "title": "Annales Algèbre 2025",
  "category": "Mathématiques",
  "description": "Livre blanc complet sur les annales de mathématiques intégrant les sujets corrigés de 2020 à 2024.",
  "authorId": "uuid_professional", // Professionnels ou Institutions
  "authorDetails": {
    "name": "Dr Oumar Sy",
    "qualification": "Professeur Agrégé",
    "avatarUrl": "https://..."
  },
  "publicationYear": 2025,
  "publisher": "Presses Universitaires d'Afrique",
  "edition": "2ème Édition",
  "referenceKey": "ISBN-13: 978-2-1234-5680-3",
  "associatedCourse": "MAT301 - Algèbre Appliquée",
  "tags": ["Algèbre", "Annales", "Préparation", "Concours", "Master"],
  "pagesCount": 145,
  "language": "Français",
  "format": "PDF",
  "tableOfContents": [
    "Chapitre 1: Introduction", 
    "Chapitre 2: Algèbre linéaire", 
    "Chapitre 3: Espaces vectoriels"
  ],
  "fileUrl": "s3://...",
  "previewUrl": "s3://.../preview",
  "isPremium": true,
  "price": 15.00, // En euros si achat unitaire
  "downloadsCount": 340,
  "rating": 4.8,
  "status": "APPROVED" // PENDING, APPROVED, REJECTED
}
```

### 1.8 Paiements & Transactions (`Transaction`)
Lié à `DocumentCheckoutPage.tsx` et aux abonnements Premium.
```json
{
  "id": "uuid",
  "buyerId": "uuid_user",
  "documentId": "uuid_document", // Optionnel, NULL si c'est un abonnement Premium
  "type": "DOCUMENT_PURCHASE", // DOCUMENT_PURCHASE, PREMIUM_SUBSCRIPTION
  "paymentMethod": "orange", // orange, mtn, moov, wave, card
  "amountXOF": 9850,
  "currency": "XOF", // XOF, EUR
  "status": "PENDING", // PENDING, SUCCESS, FAILED
  "stripeSessionId": "cs_test_xxx", // Identifiant passerelle si carte
  "createdAt": "2026-04-03T08:00:00Z"
}
```

### 1.9 Notifications Globales (`Notification`)
Lié à `NotificationsPage.tsx` (et au widget temps réel du header).
```json
{
  "id": "uuid",
  "recipientId": "uuid_user",
  "actorId": "uuid_actor", // Celui qui déclenche l'action
  "type": "connection", // connection, like, comment, opportunity, system
  "content": "vous a envoyé une demande de connexion.",
  "isRead": false,
  "createdAt": "2026-04-03T08:00:00Z"
}
```

### 1.10 Modération & Signalements (`Report`)
Lié à `AdminModerationPage.tsx`.
```json
{
  "id": "uuid",
  "reporterId": "uuid_user",
  "reportedEntityId": "uuid_post_or_user",
  "entityType": "POST", // POST, USER, COMMENT
  "reason": "SPAM", // SPAM, INAPPROPRIATE, HARASSMENT
  "status": "OPEN", // OPEN, RESOLVED, DISMISSED
  "createdAt": "2026-03-31T15:00:00Z"
}
```

---

## 2. API Endpoints - Espace Membre (Frontend Core)

### 2.1 Authentification (`/api/auth`)
- `POST /register` : Création de compte (gère `roleType` étendu : student, professional, institution).
- `POST /login` : Authentification, génération des tokens.
- `POST /refresh` : Renouvellement du JWT (HTTP-Only Cookie).
- `POST /logout` : Déconnexion.
- `POST /reset-password` : Flux d'oubli de mot de passe (envoi d'email).

### 2.2 Profils & Réglages (`/api/users`)
- `GET /me` : Récupère le profil complet de l'utilisateur (incluant l'état Premium et le Rôle).
- `PATCH /me` : Met à jour les infos générales, les options spécifiques (nineaUploaded) et les champs dynamiques (jobTitle, educationLevel...).
- `PUT /me/password` : Changer le mot de passe (vérifie l'ancien).
- `PATCH /me/settings` : Modifie les préférences système (notifications, darkMode, visibilité).
- `POST /me/experiences` | `DELETE /me/experiences/:id` : Gestion du parcours pro depuis l'onglet modifier profil.
- `POST /me/educations` | `DELETE /me/educations/:id` : Gestion académique.
- `GET /:id` : Voir le profil public d'un tiers.

### 2.3 Réseau & Connexions (`/api/network`)
- `GET /` : Liste des relations actuelles (Amis, Mentors, Relations Professionnelles).
- `GET /suggestions` : (IA) Suggère des profils pertinents pour la `NetworkPage`.
- `POST /request/:userId` : Envoyer une invitation de connexion (`type: "FRIEND" | "MENTORSHIP"`).
- `PUT /accept/:reqId`, `PUT /decline/:reqId` : Gérer les invitations en cours.
- `DELETE /remove/:userId` : Retirer une relation.

### 2.4 LeRéseau IA (Chatbot & Moteurs Match) (`/api/ai`)
- `POST /chat` : Discute avec l'assistant virtuel IA (`ChatbotWidget`). Reçoit une question, retourne une réponse textuelle contextuelle.
- `GET /match/opportunities` : Appelle le Radar LeRéseau-Match -> Retourne les bourses triées par `aiMatchScore` (Exclusif Premium Étudiant).
- `GET /match/mentors` : Suggère des mentors compatibles (Exclusif Étudiant vers Pro).
- `GET /match/students` : (Exclusif Premium Pro) Recommande le profil à des étudiants qui cherchent du tutorat.

### 2.5 Bourses et Opportunités (`/api/opportunities`)
- `GET /` : Liste complète des pages et filtres (type, domaine, pays).
- `GET /:id` : Vue complète d'une opportunité pour Bourse Details Page.
- `POST /:id/apply` : URL de redirection externe ou candidature sur la plateforme.
- `POST /me/publish` : **Nouveau** (Pour `roleType: institution`) -> Permet à une institution de soumettre "Nos annonces & Opportunités" directement depuis l'espace Profil.

### 2.6 Bibliothèque & Téléchargement (`/api/documents`)
- `GET /` : Catalogue des documents (Filière, Catégorie).
- `POST /` : **Nouveau** (Pour `roleType: professional`) -> Déposer un document / PDF / ZIP vers la bibliothèque via la section "Mes Publications" du Profil.
- `GET /:id/preview` : Lien de prévisualisation sécurisé en iframe (filigrane).
- `GET /:id/download` : **Vérifie la session Premium ou l'achat unitaire.** Retourne un presigned URL S3 expirant dans 1 minute pour le téléchargement.

### 2.7 Fil d'Actualité (`/api/feed`)
- `GET /` : Liste paginée du flux d'actualité.
- `POST /` : Publier un contenu.
- `POST /:postId/like` | `DELETE /:postId/like` : Gérer les réactions.
- `GET /:postId/comments` : Lire l'arborescence de commentaires d'un post.
- `POST /:postId/comments` : Commenter un post.

### 2.8 Messagerie Instantanée (`/api/chat`)
- `GET /conversations` : Liste des discussions actuelles avec le dernier message et compteurs unread.
- `POST /conversations/:userId` : Initie un nouveau couloir de chat 1-to-1.
- `GET /conversations/:id/messages` : Historique scrollable dans l'interface de Chat avec pagination.
- `POST /conversations/:id/messages` : Envoyer un message (déclenche immédiatement `NEW_MESSAGE` via WebSocket).
- `PUT /conversations/:id/read` : Marquer la chaine de messages courante comme lue.

### 2.9 Forum (`/api/forum`)
- `GET /channels` : Répertorie les différents tags/canaux (`#général`, `#carrière`, `#entrepreneuriat`).
- `GET /channels/:id/topics` : Pagination des topics d'un canal particulier.
- `POST /topics` : Lancer un sujet ("Nouveau Sujet" popup implémenté).
- `GET /topics/:id` : Lire le sujet de discussion avec chargement des réponses incluses.
- `POST /topics/:id/reply` : Répondre à un sujet.

### 2.10 Paiements & Premium (`/api/checkout`)
- `POST /subscription` : Crée une session Stripe pour l'abonnement mensuel (le texte varie selon le rôle "Étudiant, Pro ou Institution" sur le front).
- `POST /document/:docId` : Crée une session Checkout Stripe unitaire temporaire pour acheter un document `DocumentDetailsPage`.
- `POST /webhook` : Écoute les évènements sécurisés Stripe (`checkout.session.completed`). **Déclenche le passage silencieux de `isPremium = true` dans le profil utilisateur en BDD.**

### 2.11 Notifications (`/api/notifications`)
- `GET /` : Flux global des petites alertes en header.
- `PUT /read/:id` : Marquer en lut statique (via dropdown).
- `PUT /read-all` : TOUT valider.

---

## 3. API Endpoints - Back-Office Admin (`/api/admin`)
Conçu spécifiquement pour supporter le Dashboard Admin V3 Kolix. Protégés au niveau Router via `requireRole("ADMIN")`.

### 3.1 Tableau de Bord (Stats) (`/api/admin/dashboard`)
- `GET /stats/kpi` : Récupère les métriques cruciales (DAU, Nouveaux inscrits sur le mois, Revenus Périodiques / MRR).
- `GET /stats/activity` : Array chronologique (points Chart JS) pour l'activité sur les 30 derniers jours.

### 3.2 Utilisateurs & CRM (`/api/admin/users`)
- `GET /` : Liste structurée Table des utilisateurs avec search/filter.
- `PATCH /:id` : Altérer l'entité (valider un compte KYC Institution `VERIFIED`, ou actionner un `BANNED`).
- `GET /crm/leads` : Récupère les leads inactifs.
- `POST /crm/mass-mail` : Envoyer un push marketing par lot d'emails.

### 3.3 Publication Bourses & Contenus (`/api/admin/publishing`)
- `POST /opportunities` : Créer / Mettre en ligne la fiche détaillée d'une bourse Officielle en tant qu'admin.
- `PUT /opportunities/:id` : Modifier ou valider ("APPROVE") une bourse soumise par une Institution (depuis sa vue profil).
- `DELETE /opportunities/:id` : Retirer une bourse / opportunité d'emploi de la liste publique.
- `POST /feed/official` : Créer un "Featured Post" ou "Official Post" épinglé en tête du feed global.
- `PUT /documents/:id/validate` : Approuver un document de cours/mentorat uploadé par un "Professional".

### 3.4 Modération (`/api/admin/moderation`)
- `GET /reports` : File d'attente (Status `OPEN`) des signalements de membres.
- `PUT /reports/:id/resolve` : Clore ce signalement (Acquittement).
- `DELETE /content/:type/:id` : Forcer la suppression Hard-Delete (post spam, commentaire abusif).

### 3.5 IA Matchmaking Tuning (`/api/admin/matchmaking`)
- `GET /weights` : Voir la configuration cachée de l'algorithme "LeRéseau Match".
- `PUT /weights` : Coder "en dur" à chaud des modifications d'importance : `Tags Domain = 50%, AcademicLevel = 40%, Location = 10%`.

### 3.6 CMS & Paramètres (`/api/admin/cms`)
- `GET /config` : Méta-données JSON pour le site Vitrine et bannières incitatives.
- `PUT /config` : Update the site's meta texts globally.

---

## 4. Architecture Globale et Bonnes Pratiques

### 4.1 Temps Réel : WebSockets / Event-Driven
- Implémentez un serveur de Socket (`Socket.io`) avec la structure de "rooms" stricte :
  - `Room: global` (annonces admin temps réel et statistiques dynamiques de posts).
  - `Room: user_{userId}` (notifications privées de Chat 1-to-1, notifications systémiques Radar IA Push, et succès du *webhook Stripe* déclenchant le passage Premium dans l'UI sans recharger la page).
- **Indicateurs de Chat** : Événements de frappe (`USER_TYPING`) pour la messagerie ou pour les attentes asynchrones du Chatbot IA.
- Privilégiez l'API pour persister en DB, **puis** émettre le socket final. Gérer la déconnexion graceful via Worker.

### 4.2 Optimistic UI (React)
- Le Frontend (géré par Zustand pour le Global State) n'attend pas la réponse HTTP `200 OK` de l'API pour basculer le cœur en rouge (Like feed) ou pour pré-afficher l'ouverture du Post de Forum. L'action et la projection Frontend sont instantanées; en cas de réponse asynchrone `500 Server Error`, le frontend rollback au dernier state et affiche un toast natif `lucide-react`.

### 4.3 Sécurité : Middlewares & Uploads
1. **Pipelines de Sécurisation (Middlewares)** :
   ```typescript
   export const requireAuth = (req, res, next) => { /* Valide le JWT Access Token et l'Expiry Date */ }
   export const requirePremium = (req, res, next) => { /* Protège la route si isPremium == false */ }
   export const requireInstitution = (req, res, next) => { /* Bloque l'accès si user.roleType !== "institution" */ }
   ```
2. **Architecture des Uploads AWS / Cloud Bucket** (Images Utilisateurs, PDF/Livres de la Librairie) :
   L'application Node/Express ou Python FastAPI ne doit jamais conserver un payload BLOB/Multipart complexe pour ne pas engorger la RAM.
   - Le Frontend demande `GET /api/uploads/presigned-url?filename=cours.pdf`
   - L'API backend renvoie une AWS S3 Pre-Signed URL. 
   - Le Frontend Vite upload directement vers le "Bucket Public/Sécurisé".
   - Le Frontend finalise son formulaire de Livre (`/api/documents POST`) en incluant seulement l'URI S3 final.

### 4.4 Pagination et Performances Database
- Appliquez impérativement une stratégie d'Indexation (B-Tree pour Postgres, ou indexes standard MongoDB) sur les champs critiques du WHERE ou ORDER BY : `createdAt`, `authorId`, et `type` des Opportunités, Posts Forume.
- Pagination "Infinie" imposée via structure Curry "Cursor-based" (`?cursor=timestamp`) pour le composant `FeedPage.tsx`. En revanche, usez de la pagination standard offset limit (`?page=1&limit=20`) pour les gros tableaux analytiques Admin du back-office.
