// ISIS design tokens. Two hand-mixed palettes; every color in the app is read
// from here through the active theme object (single source of truth).

export type ThemeName = "light" | "dark";

export interface Palette {
  canvas: string;
  canvasAlt: string;
  paper: string;
  ink: string;
  inkSoft: string;
  poppy: string;
  marigold: string;
  teal: string;
  violet: string;
  sage: string;
  rose: string;
  line: string;
  shadow: (hex: string) => string;
}

const withAlpha = (hex: string, a: number) => {
  const n = hex.replace("#", "");
  const r = parseInt(n.slice(0, 2), 16);
  const g = parseInt(n.slice(2, 4), 16);
  const b = parseInt(n.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

export const alpha = withAlpha;

export const palettes: Record<ThemeName, Palette> = {
  light: {
    canvas: "#FAF6EF",
    canvasAlt: "#F1E9D8",
    paper: "#FFFDF8",
    ink: "#241F3D",
    inkSoft: "#5B547A",
    poppy: "#E23E57",
    marigold: "#F2A93B",
    teal: "#1D7874",
    violet: "#7B5EA7",
    sage: "#5C8A6B",
    rose: "#C9707D",
    line: "rgba(36,31,61,0.14)",
    shadow: (hex) => `0 18px 40px -22px ${withAlpha(hex, 0.55)}`,
  },
  dark: {
    canvas: "#17151F",
    canvasAlt: "#211D2E",
    paper: "#1E1A29",
    ink: "#F3EFE6",
    inkSoft: "#B8AFCB",
    poppy: "#FF6B7F",
    marigold: "#FFC661",
    teal: "#45C4BC",
    violet: "#A98FE0",
    sage: "#8FC49E",
    rose: "#E7A0AC",
    line: "rgba(243,239,230,0.14)",
    shadow: (hex) => `0 0 34px -6px ${withAlpha(hex, 0.35)}`,
  },
};

export const TORN_TOP =
  "polygon(0% 4%, 6% 0.5%, 14% 3%, 23% 0%, 33% 3.5%, 44% 0.5%, 56% 3%, 67% 0%, 78% 3.5%, 88% 0.5%, 96% 3%, 100% 1%, 100% 97%, 93% 100%, 82% 96.5%, 71% 100%, 60% 96.5%, 48% 99.5%, 36% 96.5%, 25% 100%, 14% 96.5%, 5% 99.5%, 0% 96%)";
