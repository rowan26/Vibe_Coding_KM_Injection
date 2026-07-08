# 📈 Progression du projet Vibe Arcade

## ✅ Fait

### Étape 1 — Structure du site et lecteur de jeux
- Projet React + Vite, routage (HashRouter, compatible GitHub Pages).
- Lecteur de jeu sécurisé : iframe `sandbox="allow-scripts allow-pointer-lock"`,
  les jeux ne peuvent toucher ni au site, ni au réseau, ni au stockage.
- 2 jeux d'exemple intégrés (Neon Snake, Casse-Briques Cosmique) pour que la
  galerie ne soit jamais vide.

### Étape 2 — Créateur de jeux par IA
- Page **Créer** : description → génération d'un fichier HTML autonome ;
  aperçu en direct ; itération ("rends le personnage plus rapide") ; sauvegarde.
- Deux fournisseurs gratuits au choix : **Google Gemini** (recommandé) et **Groq**.
  Chaque utilisateur colle sa propre clé gratuite dans les Réglages ; la clé
  reste dans le navigateur.

### Étape 3 — Bibliothèque privée et publication
- Page **Mes jeux** : jeux privés stockés en localStorage — modifier, jouer,
  supprimer, exporter en `.html`.
- Publication vers la galerie publique via Supabase (offre gratuite), en REST
  pur, sans dépendance npm. SQL de mise en place documenté dans le README.
- Page **Galerie** : liste des jeux publics de la communauté (ou les jeux
  d'exemple si Supabase n'est pas configuré).

### Déploiement
- Workflow GitHub Actions : build + déploiement automatique sur GitHub Pages
  à chaque push sur `main`.

### Étape 4 — Comptes OAuth 2.0 et assistant clé API
- Authentification gratuite via Supabase Auth : connexion **GitHub** ou **Google**
  (OAuth 2.0, flux PKCE). Bouton "Se connecter" dans l'en-tête, avatar + pseudo affichés.
- Publication liée au compte : chaque jeu public porte le pseudo et l'`user_id` de son
  auteur ; seul l'auteur peut le dépublier (politiques RLS côté base).
- Configuration plateforme centralisée dans `src/config.js` (URL + clé anon Supabase,
  commitables) — les visiteurs n'ont rien à configurer pour jouer et publier.
- **Assistant clé Gemini intégré** : popup pas-à-pas dans la plateforme (pages Créer et
  Réglages) qui ouvre Google AI Studio, puis teste la clé collée avant de l'enregistrer.

## 🔜 À faire (idées pour les prochaines sessions)

- [x] Fusionner la branche dans `main` puis activer GitHub Pages
      (dépôt passé en public le 08/07/2026, activation automatique par le workflow).
- [ ] Créer le projet Supabase partagé, exécuter le SQL du README, activer les
      fournisseurs OAuth (GitHub/Google) et remplir `src/config.js`.
- [ ] Recherche et catégories dans la galerie, votes/étoiles.
- [ ] Miniatures des jeux (capture du canvas).
- [ ] Modération basique des publications (liste de signalement).
- [ ] Mettre à jour un jeu déjà publié (update au lieu de republier).

## 🗒️ Notes techniques

- Base Vite : `/Vibe_Coding_KM_Injection/` (nom du dépôt) — à changer si le dépôt est renommé.
- Les jeux générés ne doivent utiliser ni réseau ni localStorage (imposé par le
  prompt système **et** par le sandbox de l'iframe).
- Branche de développement : `claude/ai-game-creation-platform-j4jgwu`.
