// Bibliothèque locale de jeux (localStorage). Chaque jeu est un fichier
// HTML autonome, comme un .swf de l'époque Flash.

const KEY = 'vibe-arcade.games'

function readAll() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  } catch {
    return []
  }
}

function writeAll(games) {
  localStorage.setItem(KEY, JSON.stringify(games))
}

export function listMyGames() {
  return readAll().sort((a, b) => b.updatedAt - a.updatedAt)
}

export function getMyGame(id) {
  return readAll().find(g => g.id === id) || null
}

export function saveMyGame({ id, title, prompt, html, emoji }) {
  const games = readAll()
  const now = Date.now()
  const existing = id ? games.find(g => g.id === id) : null
  if (existing) {
    Object.assign(existing, { title, prompt, html, emoji, updatedAt: now })
    writeAll(games)
    return existing
  }
  const game = {
    id: crypto.randomUUID(),
    title,
    prompt,
    html,
    emoji: emoji || '🎮',
    createdAt: now,
    updatedAt: now,
  }
  games.push(game)
  writeAll(games)
  return game
}

export function deleteMyGame(id) {
  writeAll(readAll().filter(g => g.id !== id))
}

/** Exporte un jeu en fichier .html téléchargeable (partage hors plateforme). */
export function downloadGame(game) {
  const blob = new Blob([game.html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${game.title.replace(/[^\p{L}\p{N}\- ]/gu, '').trim() || 'jeu'}.html`
  a.click()
  URL.revokeObjectURL(url)
}
