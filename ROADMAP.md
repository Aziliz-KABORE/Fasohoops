# Roadmap & État du Projet Fasohoops

## 📌 État Actuel du Projet

Fasohoops est une plateforme web moderne destinée à connecter les acteurs du basketball burkinabè (Joueurs, Clubs, Entraîneurs, Agents, Fans).

### ✅ Ce qui est accompli
- **Authentification complète** : Inscription, Connexion par Email/Mot de passe et Google OAuth, avec persistance en base de données.
- **Interface Utilisateur (UI)** :
  - Design moderne et épuré (thème clair/sombre, palettes professionnelles).
  - Navbar dynamique avec menu profil intégré pour les utilisateurs connectés.
  - Page d'accueil, Tableau de bord personnalisé.
- **Pages Fonctionnelles** :
  - `/recrutement` : Offres d'emploi pour les basketteurs, filtres par poste et niveau.
  - `/statistiques` : Graphiques et tableaux professionnels pour les statistiques de joueur.
  - `/abonnements` : Plans tarifaires pour chaque catégorie d'utilisateur.
  - `/profil` & `/profil/edit` : Interface utilisateur pour gérer son profil public (en cours de finalisation avec portfolio).
- **Base de Données** :
  - Configuration de Prisma ORM avec SQLite (LibSQL).
  - Schéma de base défini pour les Utilisateurs, Profils Joueurs, Clubs, et Offres.

### ⏳ Ce qui reste à faire (Prochaines étapes)
- **Stockage Cloud (Portfolio)** : Intégrer Cloudinary, AWS S3 ou Supabase Storage pour le stockage réel des vidéos de highlights et photos d'action.
- **Messagerie en Temps Réel** : Remplacer l'interface statique de la messagerie par des WebSockets ou Server-Sent Events.
- **Backend Complet (API)** : Finaliser les points de terminaison CRUD pour toutes les entités (Offres, Matchs, Clubs) afin que le frontend n'utilise plus de données statiques (mock).
- **Déploiement** : Mise en production sur Vercel (Frontend) avec une base de données distante (ex: Turso pour LibSQL).

---

## 🛠️ Stack Technologique (Technologies Utilisées)

### Frontend (Interface Utilisateur)
- **Framework** : [Next.js 15 (App Router)](https://nextjs.org/) - React framework permettant un rendu côté serveur et client ultra-rapide.
- **Langage** : TypeScript - Pour garantir un code robuste et sans erreurs de type.
- **Style** : TailwindCSS - Pour un design "utility-first" et la gestion facile du Dark Mode.
- **Icônes** : Heroicons (SVG inline).
- **Composants d'UI** : Composants React sur-mesure (sans bibliothèques externes lourdes).

### Backend (Serveur & Base de données)
- **API & Serveur** : Les **Route Handlers** (`app/api/.../route.ts`) et les **Server Actions** de Next.js font office de backend intégré. Pas besoin de serveur Express/Node externe.
- **Authentification** : [NextAuth.js (Auth.js)](https://next-auth.js.org/) - Gère les sessions JWT, OAuth (Google), et la sécurité.
- **Base de données** : SQLite local (pour le développement).
- **ORM** : [Prisma](https://www.prisma.io/) avec l'adaptateur LibSQL pour communiquer avec la base de données de manière typée.

---

## 🔗 Architecture : Comment le Frontend et le Backend communiquent ?

Fasohoops utilise une **architecture unifiée full-stack** permise par Next.js (App Router).

1. **La Base de données (Le socle)** : Prisma communique avec le fichier SQLite (`dev.db`). Le schéma définit l'organisation des données (`User`, `Profile`, etc.).
2. **Le Backend (Les contrôleurs)** : Dans `src/app/api/`, nous avons créé des "Routes API" (comme `/api/auth/register`). Ces fonctions sont exécutées **côté serveur**, elles ont accès à Prisma et donc à la base de données. Elles retournent du JSON.
3. **Le Frontend (Les vues)** : 
   - **Client Components (`"use client"`)** : Comme la page de connexion ou d'édition de profil. Ils interagissent avec l'utilisateur (formulaires, clics) et utilisent la fonction `fetch()` ou `NextAuth` pour envoyer des données au backend.
   - **Server Components** : Les composants par défaut dans Next.js. Ils peuvent lire directement la base de données via Prisma avant même d'envoyer l'HTML au navigateur, ce qui est extrêmement rapide et sécurisé.

**En résumé, le Frontend et le Backend sont bel et bien liés.** Les actions utilisateur (comme se connecter via Google ou s'inscrire) interagissent directement avec la base de données via le pont sécurisé que constituent les Routes API de Next.js et Prisma.
