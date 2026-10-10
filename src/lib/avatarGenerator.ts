/**
 * Utilitaires de génération d'avatars et de bannières avec dégradés dynamiques PULSE (Violet-Pink).
 * Génère des motifs abstraits et élégants basés sur le nom ou un identifiant unique (seed).
 */

const VIOLET_PINK_PALETTES = [
  {
    from: '#A77BFF',
    via: '#F58AC9',
    to: '#48D9E6',
    accent: '#FFFFFF',
    angle: '135deg',
  },
  {
    from: '#8F5BFF',
    via: '#E064AE',
    to: '#F58AC9',
    accent: '#FFFFFF',
    angle: '120deg',
  },
  {
    from: '#B993FF',
    via: '#F58AC9',
    to: '#82E3B1',
    accent: '#FFFFFF',
    angle: '145deg',
  },
  {
    from: '#7042E0',
    via: '#B868C8',
    to: '#F58AC9',
    accent: '#FFFFFF',
    angle: '160deg',
  },
  {
    from: '#F58AC9',
    via: '#A77BFF',
    to: '#242139',
    accent: '#FFFFFF',
    angle: '110deg',
  },
];

/**
 * Hashing simple pour obtenir un indice déterministe à partir d'une chaîne
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Récupère les initiales à partir du nom (ex: "Alex Rivera" -> "AR")
 */
export function getInitials(name?: string): string {
  if (!name || !name.trim()) return 'P';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Retourne la palette de dégradé déterministe pour une seed donnée
 */
export function getDynamicGradientPalette(seed: string = 'pulse') {
  const hash = hashString(seed || 'pulse');
  const palette = VIOLET_PINK_PALETTES[hash % VIOLET_PINK_PALETTES.length];
  return {
    ...palette,
    cssLinear: `linear-gradient(${palette.angle}, ${palette.from} 0%, ${palette.via} 50%, ${palette.to} 100%)`,
    radialBg: `radial-gradient(circle at 30% 30%, ${palette.via} 0%, ${palette.from} 40%, #191827 90%)`,
  };
}

/**
 * Génère un SVG encodé en Data URL pour un avatar avec dégradé Violet-Pink et initiales nettes
 */
export function generateDynamicAvatar(seed: string, initials?: string, size: number = 120): string {
  const hash = hashString(seed || 'user');
  const palette = VIOLET_PINK_PALETTES[hash % VIOLET_PINK_PALETTES.length];
  const displayInitials = initials || getInitials(seed);

  // Éléments géométriques décoratifs déterministes
  const circleRadius = 28 + (hash % 16);
  const cx1 = 20 + (hash % 30);
  const cy1 = 25 + ((hash >> 2) % 30);
  const cx2 = 70 + ((hash >> 4) % 20);
  const cy2 = 65 + ((hash >> 6) % 25);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}">
    <defs>
      <linearGradient id="g_${hash}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${palette.from}" />
        <stop offset="50%" stop-color="${palette.via}" />
        <stop offset="100%" stop-color="${palette.to}" />
      </linearGradient>
      <radialGradient id="rg1_${hash}" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="${palette.via}" stop-opacity="0.8" />
        <stop offset="100%" stop-color="${palette.from}" stop-opacity="0" />
      </radialGradient>
      <radialGradient id="rg2_${hash}" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="${palette.to}" stop-opacity="0.6" />
        <stop offset="100%" stop-color="${palette.via}" stop-opacity="0" />
      </radialGradient>
      <filter id="glow_${hash}" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <!-- Fond principal -->
    <rect width="100" height="100" fill="#10101B" />
    <rect width="100" height="100" fill="url(#g_${hash})" opacity="0.85" />
    
    <!-- Sphères d'ambiance et ondes lumineuses -->
    <circle cx="${cx1}" cy="${cy1}" r="${circleRadius}" fill="url(#rg1_${hash})" />
    <circle cx="${cx2}" cy="${cy2}" r="${circleRadius - 6}" fill="url(#rg2_${hash})" />
    
    <!-- Anneau d'onde PULSE -->
    <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" stroke-dasharray="3 4" />
    
    <!-- Initiales au centre avec typographie Plus Jakarta Sans -->
    <text x="50" y="58" font-family="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" font-weight="900" font-size="34" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">
      ${displayInitials}
    </text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Génère un SVG encodé en Data URL pour une bannière panoramique avec ondes lumineuses Violet-Pink
 */
export function generateDynamicBanner(seed: string, width: number = 800, height: number = 240): string {
  const hash = hashString(seed || 'banner');
  const palette = VIOLET_PINK_PALETTES[hash % VIOLET_PINK_PALETTES.length];

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 240" width="${width}" height="${height}" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id="bg_${hash}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#10101B" />
        <stop offset="35%" stop-color="#191827" />
        <stop offset="100%" stop-color="#242139" />
      </linearGradient>
      <linearGradient id="wave1_${hash}" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="${palette.from}" stop-opacity="0.6" />
        <stop offset="50%" stop-color="${palette.via}" stop-opacity="0.85" />
        <stop offset="100%" stop-color="${palette.to}" stop-opacity="0.4" />
      </linearGradient>
      <linearGradient id="wave2_${hash}" x1="100%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="${palette.via}" stop-opacity="0.4" />
        <stop offset="100%" stop-color="${palette.from}" stop-opacity="0.1" />
      </linearGradient>
      <radialGradient id="spot_${hash}" cx="75%" cy="30%" r="60%">
        <stop offset="0%" stop-color="${palette.via}" stop-opacity="0.35" />
        <stop offset="100%" stop-color="transparent" stop-opacity="0" />
      </radialGradient>
    </defs>
    
    <!-- Fond -->
    <rect width="800" height="240" fill="url(#bg_${hash})" />
    <rect width="800" height="240" fill="url(#spot_${hash})" />
    
    <!-- Ondes dynamiques PULSE -->
    <path d="M 0,160 Q 200,60 400,140 T 800,90 L 800,240 L 0,240 Z" fill="url(#wave2_${hash})" />
    <path d="M 0,190 Q 250,110 500,180 T 800,130 L 800,240 L 0,240 Z" fill="url(#wave1_${hash})" opacity="0.6" />
    <path d="M 0,110 Q 180,180 380,120 T 800,160" fill="none" stroke="${palette.via}" stroke-width="2" opacity="0.4" stroke-dasharray="4 6" />
    
    <!-- Lueur subtile -->
    <circle cx="680" cy="70" r="90" fill="${palette.from}" opacity="0.15" filter="blur(20px)" />
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
