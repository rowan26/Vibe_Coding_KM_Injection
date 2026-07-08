// Lecteur de jeu sécurisé : le HTML généré par l'IA tourne dans une iframe
// sandbox qui n'autorise que l'exécution de scripts — pas d'accès au site,
// au localStorage de la plateforme, ni au réseau de la page parente.
export default function GameFrame({ html, className = 'play-frame', title = 'Jeu' }) {
  return (
    <iframe
      className={className}
      srcDoc={html}
      sandbox="allow-scripts allow-pointer-lock"
      title={title}
    />
  )
}
