export interface ColorPalette {
  id: string;
  name: string;
  preview: string[]; // 4 hex colors for preview swatches
  vars: Record<string, string>;
}

export const COLOR_PALETTES: ColorPalette[] = [
  {
    id: 'green',
    name: 'Verde Natureza',
    preview: ['#628A4C', '#AFBE6C', '#C4E477', '#87B344'],
    vars: {
      '--primary': '99 29% 42%',
      '--primary-foreground': '0 0% 100%',
      '--secondary': '71 39% 58%',
      '--secondary-foreground': '20 14% 15%',
      '--accent': '78 67% 68%',
      '--accent-foreground': '20 14% 15%',
      '--muted': '78 67% 92%',
      '--ring': '99 29% 42%',
      '--border': '78 30% 88%',
      '--input': '78 30% 88%',
      '--sidebar-background': '71 39% 90%',
      '--sidebar-foreground': '20 14% 25%',
      '--sidebar-primary': '99 29% 42%',
      '--sidebar-primary-foreground': '0 0% 100%',
      '--sidebar-accent': '78 67% 88%',
      '--sidebar-accent-foreground': '20 14% 20%',
      '--sidebar-border': '71 20% 85%',
      '--sidebar-ring': '99 29% 42%',
      '--rose': '99 29% 42%',
      '--rose-light': '78 67% 68%',
      '--champagne': '71 39% 58%',
      '--gold': '84 45% 48%',
      '--gold-light': '78 67% 68%',
      '--sage': '83 43% 42%',
      '--sage-light': '71 39% 58%',
      '--success': '84 45% 48%',
      '--warning': '78 67% 68%',
    },
  },
  {
    id: 'rose',
    name: 'Rosa Romântico',
    preview: ['#C4718A', '#E8A0B5', '#F2C4D0', '#D4849A'],
    vars: {
      '--primary': '340 40% 48%',
      '--primary-foreground': '0 0% 100%',
      '--secondary': '340 45% 72%',
      '--secondary-foreground': '340 30% 15%',
      '--accent': '340 60% 82%',
      '--accent-foreground': '340 30% 15%',
      '--muted': '340 50% 94%',
      '--ring': '340 40% 48%',
      '--border': '340 30% 88%',
      '--input': '340 30% 88%',
      '--sidebar-background': '340 40% 92%',
      '--sidebar-foreground': '340 20% 25%',
      '--sidebar-primary': '340 40% 48%',
      '--sidebar-primary-foreground': '0 0% 100%',
      '--sidebar-accent': '340 50% 88%',
      '--sidebar-accent-foreground': '340 20% 20%',
      '--sidebar-border': '340 20% 85%',
      '--sidebar-ring': '340 40% 48%',
      '--rose': '340 40% 48%',
      '--rose-light': '340 60% 82%',
      '--champagne': '340 45% 72%',
      '--gold': '340 50% 55%',
      '--gold-light': '340 60% 82%',
      '--sage': '340 35% 42%',
      '--sage-light': '340 45% 72%',
      '--success': '150 45% 48%',
      '--warning': '40 67% 68%',
    },
  },
  {
    id: 'gold',
    name: 'Dourado Clássico',
    preview: ['#B8860B', '#DAA520', '#F0D060', '#C9A935'],
    vars: {
      '--primary': '43 85% 38%',
      '--primary-foreground': '0 0% 100%',
      '--secondary': '43 72% 49%',
      '--secondary-foreground': '43 50% 10%',
      '--accent': '48 82% 66%',
      '--accent-foreground': '43 50% 10%',
      '--muted': '48 60% 92%',
      '--ring': '43 85% 38%',
      '--border': '43 40% 85%',
      '--input': '43 40% 85%',
      '--sidebar-background': '43 50% 92%',
      '--sidebar-foreground': '43 30% 20%',
      '--sidebar-primary': '43 85% 38%',
      '--sidebar-primary-foreground': '0 0% 100%',
      '--sidebar-accent': '48 50% 88%',
      '--sidebar-accent-foreground': '43 30% 20%',
      '--sidebar-border': '43 25% 82%',
      '--sidebar-ring': '43 85% 38%',
      '--rose': '43 85% 38%',
      '--rose-light': '48 82% 66%',
      '--champagne': '43 72% 49%',
      '--gold': '43 85% 38%',
      '--gold-light': '48 82% 66%',
      '--sage': '43 60% 35%',
      '--sage-light': '43 72% 49%',
      '--success': '150 45% 48%',
      '--warning': '48 82% 66%',
    },
  },
  {
    id: 'lavender',
    name: 'Lavanda Suave',
    preview: ['#7B68AE', '#9B8EC4', '#C4B8E0', '#A994D0'],
    vars: {
      '--primary': '255 30% 54%',
      '--primary-foreground': '0 0% 100%',
      '--secondary': '260 30% 68%',
      '--secondary-foreground': '260 20% 15%',
      '--accent': '265 40% 80%',
      '--accent-foreground': '260 20% 15%',
      '--muted': '265 40% 93%',
      '--ring': '255 30% 54%',
      '--border': '260 25% 88%',
      '--input': '260 25% 88%',
      '--sidebar-background': '260 30% 93%',
      '--sidebar-foreground': '260 15% 25%',
      '--sidebar-primary': '255 30% 54%',
      '--sidebar-primary-foreground': '0 0% 100%',
      '--sidebar-accent': '265 35% 88%',
      '--sidebar-accent-foreground': '260 15% 20%',
      '--sidebar-border': '260 15% 85%',
      '--sidebar-ring': '255 30% 54%',
      '--rose': '255 30% 54%',
      '--rose-light': '265 40% 80%',
      '--champagne': '260 30% 68%',
      '--gold': '255 35% 50%',
      '--gold-light': '265 40% 80%',
      '--sage': '255 25% 45%',
      '--sage-light': '260 30% 68%',
      '--success': '150 45% 48%',
      '--warning': '40 67% 68%',
    },
  },
  {
    id: 'blue',
    name: 'Azul Serenidade',
    preview: ['#4A7FAF', '#6FA3CC', '#A0C8E8', '#5C94BF'],
    vars: {
      '--primary': '210 40% 49%',
      '--primary-foreground': '0 0% 100%',
      '--secondary': '208 42% 62%',
      '--secondary-foreground': '210 30% 12%',
      '--accent': '208 55% 77%',
      '--accent-foreground': '210 30% 12%',
      '--muted': '208 50% 93%',
      '--ring': '210 40% 49%',
      '--border': '208 30% 88%',
      '--input': '208 30% 88%',
      '--sidebar-background': '208 40% 93%',
      '--sidebar-foreground': '210 15% 25%',
      '--sidebar-primary': '210 40% 49%',
      '--sidebar-primary-foreground': '0 0% 100%',
      '--sidebar-accent': '208 45% 88%',
      '--sidebar-accent-foreground': '210 15% 20%',
      '--sidebar-border': '208 15% 85%',
      '--sidebar-ring': '210 40% 49%',
      '--rose': '210 40% 49%',
      '--rose-light': '208 55% 77%',
      '--champagne': '208 42% 62%',
      '--gold': '210 45% 45%',
      '--gold-light': '208 55% 77%',
      '--sage': '210 35% 42%',
      '--sage-light': '208 42% 62%',
      '--success': '150 45% 48%',
      '--warning': '40 67% 68%',
    },
  },
];

export function hexToHsl(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

function generateVarsFromHex(primary: string, secondary: string, accent: string): Record<string, string> {
  const pHsl = hexToHsl(primary);
  const sHsl = hexToHsl(secondary);
  const aHsl = hexToHsl(accent);
  
  // Parse HSL to get components for lighter/darker variants
  const [pH] = pHsl.split(' ');
  const [sH] = sHsl.split(' ');
  
  return {
    '--primary': pHsl,
    '--primary-foreground': '0 0% 100%',
    '--secondary': sHsl,
    '--secondary-foreground': '20 14% 15%',
    '--accent': aHsl,
    '--accent-foreground': '20 14% 15%',
    '--muted': `${pH} 40% 93%`,
    '--ring': pHsl,
    '--border': `${pH} 25% 88%`,
    '--input': `${pH} 25% 88%`,
    '--sidebar-background': `${sH} 30% 92%`,
    '--sidebar-foreground': '20 14% 25%',
    '--sidebar-primary': pHsl,
    '--sidebar-primary-foreground': '0 0% 100%',
    '--sidebar-accent': `${pH} 40% 88%`,
    '--sidebar-accent-foreground': '20 14% 20%',
    '--sidebar-border': `${sH} 15% 85%`,
    '--sidebar-ring': pHsl,
    '--rose': pHsl,
    '--rose-light': aHsl,
    '--champagne': sHsl,
    '--gold': pHsl,
    '--gold-light': aHsl,
    '--sage': pHsl,
    '--sage-light': sHsl,
    '--success': '150 45% 48%',
    '--warning': '40 67% 68%',
  };
}

export function applyPalette(paletteId: string) {
  const palette = COLOR_PALETTES.find(p => p.id === paletteId);
  if (!palette) return;

  const root = document.documentElement;
  Object.entries(palette.vars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
}

export function applyCustomColors(primary: string, secondary: string, accent: string) {
  const vars = generateVarsFromHex(primary, secondary, accent);
  const root = document.documentElement;
  Object.entries(vars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
}
