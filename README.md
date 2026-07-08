# 🕹️ Vibe Arcade

Une plateforme **100 % gratuite** de création et de partage de jeux web, dans l'esprit
des jeux Flash de l'époque : décrivez votre jeu en français, l'IA écrit le code, vous
jouez immédiatement dans le navigateur — puis vous partagez votre création avec tout le monde.

## ✨ Fonctionnalités

- **Création par prompt** : décrivez un jeu ("un snake néon", "un shoot'em up spatial"…),
  l'IA génère un jeu HTML complet et jouable.
- **Itération** : "rends le personnage plus rapide", "ajoute des ennemis" — le jeu est
  mis à jour, pas besoin de repartir de zéro.
- **Jeux privés** : vos créations sont sauvegardées dans votre navigateur, visibles par vous seul.
- **Comptes OAuth 2.0** : connexion gratuite via GitHub ou Google (Supabase Auth) —
  nécessaire uniquement pour publier ; jouer et créer restent possibles sans compte.
- **Publication** : quand vous êtes prêt, publiez votre jeu dans la galerie publique,
  à votre nom. Vous seul pouvez le dépublier.
- **Assistant clé API intégré** : un popup guide chaque créateur pour générer sa clé
  Gemini gratuite sans quitter la plateforme, la teste et l'enregistre.
- **Lecture sécurisée** : chaque jeu tourne dans une iframe *sandbox*, isolée du site.
- **Export .html** : téléchargez n'importe lequel de vos jeux en un seul fichier autonome.

## 🆓 Pourquoi c'est gratuit

| Brique | Service | Coût |
|---|---|---|
| Site web | GitHub Pages | gratuit |
| IA de génération | Google Gemini **ou** Groq, avec *votre* clé API personnelle | quota gratuit |
| Exécution des jeux | le navigateur du joueur (comme Flash à l'époque) | gratuit |
| Galerie partagée (optionnel) | Supabase (offre gratuite) | gratuit |

Chaque créateur utilise **sa propre clé API gratuite** (obtenue en 1 minute, sans carte
bancaire). La clé reste dans le navigateur et n'est envoyée qu'au fournisseur d'IA choisi.

- Clé Gemini : https://aistudio.google.com/apikey (recommandé)
- Clé Groq : https://console.groq.com/keys

## 🚀 Lancer en local

```bash
npm install
npm run dev
```

Puis ouvrez http://localhost:5173, allez dans **Réglages** et collez votre clé API gratuite.

## 🌐 Déployer sur GitHub Pages

1. Dans les réglages du dépôt GitHub : **Settings → Pages → Source : GitHub Actions**.
2. Poussez sur `main` : le workflow `.github/workflows/deploy.yml` construit et déploie le site.
3. Le site est disponible sur `https://<votre-compte>.github.io/Vibe_Coding_KM_Injection/`.

## 🌍 Activer la galerie partagée + connexion OAuth 2.0 (une fois, par le propriétaire du site)

Sans configuration, la galerie affiche des jeux d'exemple et les jeux de chacun restent
privés dans son navigateur. Pour que tous les utilisateurs partagent une même galerie
publique avec des comptes (OAuth 2.0 gratuit via GitHub et Google) :

### 1. Créer le projet Supabase (gratuit)

Créez un projet sur https://supabase.com, puis dans l'**éditeur SQL**, exécutez :

```sql
create table public.games (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  prompt text,
  html text not null,
  emoji text default '🎮',
  author text default 'anonyme',
  user_id uuid references auth.users (id) on delete set null,
  created_at timestamptz default now()
);

alter table public.games enable row level security;

-- Tout le monde peut lire la galerie publique
create policy "lecture publique" on public.games
  for select using (true);

-- Publier exige d'être connecté, et le jeu est lié à son auteur
create policy "publication connectée" on public.games
  for insert to authenticated with check (auth.uid() = user_id);

-- Chacun ne peut dépublier / modifier que ses propres jeux
create policy "dépublier ses jeux" on public.games
  for delete to authenticated using (auth.uid() = user_id);
create policy "modifier ses jeux" on public.games
  for update to authenticated using (auth.uid() = user_id);
```

### 2. Activer les fournisseurs OAuth (gratuit)

Dans Supabase → **Authentication → Sign In / Up → Auth Providers** :

- **GitHub** : créez une "OAuth App" sur GitHub (Settings → Developer settings →
  OAuth Apps → New OAuth App). *Authorization callback URL* :
  `https://<votre-projet>.supabase.co/auth/v1/callback`. Copiez le Client ID et le
  Client Secret dans Supabase.
- **Google** (optionnel) : même principe via https://console.cloud.google.com
  (APIs & Services → Credentials → OAuth client ID, type "Web application", même
  URL de callback).

Puis dans **Authentication → URL Configuration** :
- *Site URL* : `https://<votre-compte>.github.io/Vibe_Coding_KM_Injection/`
- Ajoutez la même adresse dans *Redirect URLs* (plus `http://localhost:5173/Vibe_Coding_KM_Injection/` pour le dev local).

### 3. Brancher la plateforme

Copiez l'**URL du projet** et la **clé anon** (Settings → API) dans
[`src/config.js`](src/config.js), commitez et poussez. C'est tout : la clé anon est
publique par conception, la sécurité vient des politiques RLS ci-dessus.

## 🏗️ Architecture

- **React + Vite** — interface du site.
- **Un jeu = un fichier HTML autonome** (CSS et JS inclus, zéro dépendance externe),
  généré par l'IA et joué dans une `<iframe sandbox="allow-scripts">`.
- **localStorage** — bibliothèque privée de jeux et réglages.
- **Supabase** (gratuit) — galerie publique partagée + authentification OAuth 2.0
  (GitHub / Google, flux PKCE via `@supabase/supabase-js`), sécurisée par RLS.

Voir [PROGRESSION.md](PROGRESSION.md) pour l'état d'avancement du projet.
