/**
 * Utilitaire de génération d'avatars avec dégradé radial PULSE (Violet #A77BFF & Pink #F58AC9).
 * Utilisé pour générer des avatars de profil vectoriels par défaut basés sur une seed.
 */

/**
 * Calcule un hash déterministe à partir de la seed fournie.
 */
function hashSeed(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Extrait les initiales (1 ou 2 caractères majuscules) à partir d'une seed ou d'un nom.
 */
function getInitials(seed: string): string {
  if (!seed || !seed.trim()) return 'P';
  const clean = seed.trim().replace(/^user[-_]?/i, '');
  const parts = clean.split(/[\s-_]+/);
  if (parts.length >= 2 && parts[0][0] && parts[1][0]) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return clean.substring(0, 2).toUpperCase() || 'P';
}

/**
 * Génère une chaîne SVG complète avec un dégradé radial basé sur les couleurs '#A77BFF' et '#F58AC9'.
 *
 * @param seed - Chaîne servant d'identifiant unique ou nom d'utilisateur
 * @returns Une chaîne de balises SVG
 */
export function generateGradientAvatar(seed: string): string {
  const hash = hashSeed(seed || 'pulse');
  const initials = getInitials(seed);

  // Variations d'angle et de position focale pour le dégradé radial
  const focalX = 35 + (hash % 30);
  const focalY = 35 + ((hash >> 3) % 30);
  const id = `radial-pulse-${hash}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
  <defs>
    <radialGradient id="${id}" cx="${focalX}%" cy="${focalY}%" r="65%" fx="${focalX}%" fy="${focalY}%">
      <stop offset="0%" stop-color="#F58AC9" stop-opacity="1" />
      <stop offset="60%" stop-color="#A77BFF" stop-opacity="1" />
      <stop offset="100%" stop-color="#191827" stop-opacity="1" />
    </radialGradient>
    <filter id="glow-${id}" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Fond avec dégradé radial -->
  <rect width="100" height="100" rx="28" fill="url(#${id})" />

  <!-- Anneau subtil d'énergie Pulse -->
  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255, 255, 255, 0.25)" stroke-width="1.5" stroke-dasharray="4 3" />

  <!-- Point lumineux subtil -->
  <circle cx="${focalX}" cy="${focalY}" r="12" fill="#FFFFFF" opacity="0.2" filter="url(#glow-${id})" />

  <!-- Typographie des initiales -->
  <text
    x="50"
    y="58"
    font-family="'Plus Jakarta Sans', Inter, -apple-system, sans-serif"
    font-size="32"
    font-weight="800"
    fill="#FFFFFF"
    text-anchor="middle"
    dominant-baseline="middle"
    letter-spacing="0.5"
  >
    ${initials}
  </text>
</svg>`;
}

export default generateGradientAvatar;
