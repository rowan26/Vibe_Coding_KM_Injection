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
- **Publication** : quand vous êtes prêt, publiez votre jeu dans la galerie publique.
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

## 🌍 Activer la galerie communautaire partagée (optionnel)

Sans configuration, la galerie affiche des jeux d'exemple et vos jeux restent privés dans
votre navigateur. Pour que tous les utilisateurs partagent une même galerie publique :

1. Créez un projet gratuit sur https://supabase.com.
2. Dans l'éditeur SQL de Supabase, exécutez :

```sql
create table public.games (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  prompt text,
  html text not null,
  emoji text default '🎮',
  author text default 'anonyme',
  created_at timestamptz default now()
);

alter table public.games enable row level security;

-- Tout le monde peut lire la galerie publique
create policy "lecture publique" on public.games for select using (true);

-- Tout le monde peut publier un jeu (v1 sans comptes)
create policy "publication ouverte" on public.games for insert with check (true);
```

3. Récupérez l'**URL du projet** et la **clé anon** (Settings → API) et collez-les dans
   les **Réglages** du site.

> V1 volontairement simple : pas de comptes, publication ouverte. Une évolution possible
> est d'ajouter l'authentification Supabase (gratuite) pour lier chaque jeu à son auteur.

## 🏗️ Architecture

- **React + Vite** — interface du site.
- **Un jeu = un fichier HTML autonome** (CSS et JS inclus, zéro dépendance externe),
  généré par l'IA et joué dans une `<iframe sandbox="allow-scripts">`.
- **localStorage** — bibliothèque privée de jeux et réglages.
- **Supabase REST** (optionnel) — galerie publique partagée, sans aucune dépendance npm.

Voir [PROGRESSION.md](PROGRESSION.md) pour l'état d'avancement du projet.
