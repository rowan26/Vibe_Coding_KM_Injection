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

## 🔜 À faire (idées pour les prochaines sessions)

- [ ] Activer GitHub Pages dans les réglages du dépôt (Settings → Pages → GitHub Actions).
- [ ] Créer le projet Supabase partagé et mettre l'URL/clé anon par défaut dans le code
      (pour que les visiteurs n'aient rien à configurer pour *jouer*).
- [ ] Comptes utilisateurs (Supabase Auth, gratuit) : lier chaque jeu à son auteur,
      permettre de dépublier/mettre à jour ses jeux publics.
- [ ] Recherche et catégories dans la galerie, votes/étoiles.
- [ ] Miniatures des jeux (capture du canvas).
- [ ] Modération basique des publications (liste de signalement).

## 🗒️ Notes techniques

- Base Vite : `/Vibe_Coding_KM_Injection/` (nom du dépôt) — à changer si le dépôt est renommé.
- Les jeux générés ne doivent utiliser ni réseau ni localStorage (imposé par le
  prompt système **et** par le sandbox de l'iframe).
- Branche de développement : `claude/ai-game-creation-platform-j4jgwu`.
