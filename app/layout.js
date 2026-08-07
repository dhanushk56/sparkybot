/* ========== FONTS ========== */
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700;800;900&display=swap');

/* ========== TAILWIND DIRECTIVES ========== */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ========== BASE STYLES ========== */
@layer base {
  body {
    font-family: 'Inter', sans-serif;
    background-color: #050507;
    color: #fff;
  }
  h1, h2, h3, h4, .font-orbitron {
    font-family: 'Orbitron', sans-serif;
  }
}

/* ========== COMPONENTS ========== */
@layer components {
  /* Glass navigation */
  .glass-nav {
    background: rgba(12, 18, 38, 0.72);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow: 0 18px 50px rgba(0, 0, 0, 0.45);
  }
  
  /* Glass cards */
  .glass-card {
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.05);
  }
  .glass-card:hover {
    border-color: rgba(255, 215, 0, 0.4);
  }

  /* Primary button */
  .btn-primary {
    background: linear-gradient(135deg, #FFD700, #FFA500);
    color: #0a0a0a;
    font-weight: 800;
    padding: 0.75rem 2rem;
    border-radius: 9999px;
    transition: all 0.3s ease;
    box-shadow: 0 8px 24px rgba(255, 215, 0, 0.4);
  }
  .btn-primary:hover {
    transform: scale(1.03);
    box-shadow: 0 12px 32px rgba(255, 215, 0, 0.6);
  }

  /* Secondary button */
  .btn-secondary {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: #fff;
    font-weight: 700;
    padding: 0.75rem 2rem;
    border-radius: 9999px;
    transition: all 0.3s ease;
  }
  .btn-secondary:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: #FFD700;
  }

  /* Gradient text */
  .gradient-text {
    background: linear-gradient(135deg, #FFD700, #FF8C00);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* Grid background pattern */
  .bg-grid-pattern {
    background-image: 
      linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
    background-size: 40px 40px;
  }
}

/* ========== UTILITIES ========== */
@layer utilities {
  .animation-delay-1000 { animation-delay: 1000ms; }
  .animation-delay-2000 { animation-delay: 2000ms; }
  .animation-delay-3000 { animation-delay: 3000ms; }
  /* Scroll dot animation */
  @keyframes scrollDot {
    0% { transform: translateY(0); opacity: 1; }
    100% { transform: translateY(16px); opacity: 0; }
  }
  .animate-scroll-dot {
    animation: scrollDot 2s infinite;
  }
}

/* ========== CUSTOM SCROLLBAR ========== */
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: #0a0a0a; }
::-webkit-scrollbar-thumb { background: #FFD700; border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: #FFA500; }
