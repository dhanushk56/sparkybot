export const THEME_CSS = `
  :root {
    --bg: #0a0a14;
    --text: #e8e0d8;
    --muted: #a09890;
    --faint: #606070;
    --gold: #d4af37;
    --gold-light: #e8c84a;
    --card: rgba(255,255,255,0.02);
    --card-border: rgba(255,255,255,0.06);
    --card-hover: rgba(255,255,255,0.04);
    --ok: #4ade80;
    --err: #f87171;
    --warn: #fbbf24;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
  }
  a { color: var(--gold); text-decoration: none; transition: color .3s; }
  a:hover { color: var(--gold-light); }
`;
