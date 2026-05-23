// main.jsx — Happy Birthday Papa
// Editorial tribute site for Dhiraj Sarma · 24 May 1970
// Phone-first layout. Loads after effects.jsx (Confetti, StarMap,
// OpenableCard) and tweaks-panel.jsx.

const { useState, useEffect, useRef } = React;

// ─── Content ────────────────────────────────────────────────────────────────
const FATHER = {
  name: "Dhiraj Sarma",
  call: "Papa",
  nameScript: "ধীৰাজ শৰ্মা",
  nameScriptLabel: "অসমীয়াত",
  dob: "24 May 1970",
  dobNum: ["24", "05", "1970"],
  age: 56,
  birthplace: "Guwahati, Assam",
};

const HERO = {
  kicker: `A celebration · 24 May 2026 · 56 years of him`,
  line1: "Happy Birthday,",
  line2: "Papa.",
  sub: "Today we set aside an evening — and a corner of the internet — to say what we don't say often enough. Here are blessings, wishes and voices from the people who are here because you are.",
};

// User's exact words (preserved)
const LETTER_BODY = [
  "You know how bad I am when it comes to expressing my feelings for you or Maa verbally, but today, on the most special day for me, I want to express all my gratitude, love, and thankfulness for you being my father.",
  "Your presence is everything that matters to me, and you are truly the center of my universe.",
  "There's something no one knows: I always thank Maa Kamakhya for blessing me with a father like you — someone who has taught me how to be strong and brave, how to keep the family together, and how to give love and support to others selflessly.",
  "I cannot ever imagine my life without your presence in it. Whatever I am today is only because of Maa Kamakhya and you.",
  "I love you a lot.",
  "And most importantly — I know I shout at you sometimes, because deep inside I know that no matter what happens, you are mine, and you will always understand me. Whatever I feel inside, even when I show anger because I'm vulnerable, I know it will never change your love for me.",
  "I'm sorry if I hurt you, but please never tell me not to show my anger — because the only place where I truly feel safe enough to show it is with you and Maa.",
  "I love you infinity squared and back ♾️ ❤️",
];
const LETTER_SIGNOFF = "yours, always —";
const LETTER_FROM = "your child";

// Family wishes section removed — voice notes carry that role now.

// Audio voice notes — paths MUST be relative with forward slashes.
// NEVER use C:\... — those break JavaScript. Always relative from project folder.
const AUDIO = [
  {
    id: "wife-son",
    eyebrow: "01 · the home you built",
    title: "From your wife & son",
    intro: "The two voices that share a roof with you. The ones who know the rhythm of your breathing in the next room.",
    accent: "rose",
    slots: [
      { id: "wife", label: "Maa",   src: "audio/wife-son/maa.mp3" },
      { id: "son",  label: "Sunny", src: "audio/wife-son/sunny.mp3" },
    ],
  },
  {
    id: "sister",
    eyebrow: "02 · the one who loved you longest",
    title: "From your sister & her husband",
    intro: "She has loved you since before you could walk. Today she sends every prayer a sister can carry — and her husband, who has been a brother to you, sends his with her.",
    accent: "gold",
    slots: [
      { id: "sister-pehi",    label: "Pehi",    src: "audio/pehi/pehi.mp3" },
      { id: "sister-husband", label: "Bhindow", src: "audio/pehi/peha.mp3" },
    ],
  },
  {
    id: "nieces-nephews",
    eyebrow: "03 · the cousins who grew up in your shade",
    title: "From your nieces & nephews",
    intro: "You spoil them, you scold them, you remember every one of their birthdays. Here they are, one at a time — in the order they could not stop interrupting each other.",
    accent: "sage",
    slots: [
      { id: "nn-01", label: "Diti",             src: "audio/neice-nephew/diti.mp3" },
      { id: "nn-02", label: "Rup",              src: "audio/neice-nephew/rup.mp3" },
      { id: "nn-03", label: "Momi",             src: "audio/neice-nephew/momi.mp3" },
      { id: "nn-04", label: "Kinku",            src: "audio/neice-nephew/kinku.mp3" },
      { id: "nn-05", label: "Munni",            src: "audio/neice-nephew/munni.mp3" },
      { id: "nn-06", label: "Mono",             src: "audio/neice-nephew/mono.mp3" },
      { id: "nn-07", label: "Pooja & Chanakya", src: "audio/neice-nephew/pooja.mp3" },
      { id: "nn-08", label: "Rahul",            src: "audio/neice-nephew/rahull.mp3" },
      { id: "nn-09", label: "Binita",           src: "audio/neice-nephew/binita.mp3" },
      { id: "nn-10", label: "Munu",             src: "audio/neice-nephew/munu.mp3" },
      { id: "nn-11", label: "Babu",             src: "audio/neice-nephew/babu.mp3" },
    ],
  },
  {
    id: "grandchildren",
    eyebrow: "04 · the tiny ones who call you Dadu",
    title: "From your beloved grandchildren",
    intro: "Best played at full volume. They have a lot to say, and almost none of it is in order.",
    accent: "rose",
    slots: [
      { id: "gc-1", label: "Monuma",  src: "audio/grandchildren/onuma.mp3" },
      { id: "gc-2", label: "Mon",     src: "audio/grandchildren/mon.mp3" },
      { id: "gc-3", label: "Krish",   src: "audio/grandchildren/krish.mp3" },
      { id: "gc-4", label: "Devansh", src: "audio/grandchildren/devansh.mp3" },
    ],
  },
];

// People who are gone but still bless us — 1 frame.
const BLESSINGS = [
  { id: "blessing-1", name: "in loving memory", src: "photos/aitama.jpg" },
];

// ─── Palettes ───────────────────────────────────────────────────────────────
const PALETTES = {
  midnight: { bg: "#0a0c12", fg: "#f5efe2", muted: "#a39b88", accent: "#d4a857", soft: "#1a1d28", card: "rgba(245,239,226,0.04)", border: "rgba(245,239,226,0.10)" },
  ember:    { bg: "#120a08", fg: "#f8ece0", muted: "#b29c8a", accent: "#e8a06b", soft: "#241612", card: "rgba(248,236,224,0.04)", border: "rgba(248,236,224,0.10)" },
  garden:   { bg: "#0a120e", fg: "#eef0e7", muted: "#9ea69a", accent: "#c8b46e", soft: "#152017", card: "rgba(238,240,231,0.04)", border: "rgba(238,240,231,0.10)" },
  cream:    { bg: "#f4ede1", fg: "#1c1a16", muted: "#736a5b", accent: "#a87b3a", soft: "#e8dfcb", card: "rgba(28,26,22,0.04)", border: "rgba(28,26,22,0.12)" },
};

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "bgStyle": "petals",
  "palette": "midnight",
  "music": false
}/*EDITMODE-END*/;

// ─── Cinematic Canvas Background ────────────────────────────────────────────
function CinematicBackground({ style, palette }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const cnv = canvasRef.current;
    if (!cnv) return;
    const ctx = cnv.getContext("2d");
    let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      w = cnv.clientWidth; h = cnv.clientHeight;
      cnv.width = w * dpr; cnv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const palCol = PALETTES[palette] || PALETTES.midnight;
    const isLight = palette === "cream";
    const particles = [];

    const init = () => {
      particles.length = 0;
      const count = style === "bokeh" ? 28 : style === "embers" ? 60 : style === "aurora" ? 0 : 45;
      for (let i = 0; i < count; i++) {
        if (style === "petals") {
          particles.push({
            x: Math.random() * w, y: Math.random() * h,
            r: 6 + Math.random() * 16,
            vx: -0.15 - Math.random() * 0.25,
            vy: 0.15 + Math.random() * 0.35,
            rot: Math.random() * Math.PI * 2,
            vr: (Math.random() - 0.5) * 0.015,
            sway: Math.random() * Math.PI * 2,
            o: 0.25 + Math.random() * 0.5,
            hue: Math.random(),
          });
        } else if (style === "bokeh") {
          particles.push({
            x: Math.random() * w, y: Math.random() * h,
            r: 30 + Math.random() * 90,
            vx: (Math.random() - 0.5) * 0.08,
            vy: -0.04 - Math.random() * 0.12,
            o: 0.06 + Math.random() * 0.14,
            phase: Math.random() * Math.PI * 2,
          });
        } else if (style === "embers") {
          particles.push({
            x: Math.random() * w, y: h + Math.random() * h,
            r: 0.6 + Math.random() * 1.8,
            vx: (Math.random() - 0.5) * 0.3,
            vy: -0.3 - Math.random() * 0.9,
            life: Math.random(),
            decay: 0.0015 + Math.random() * 0.003,
            o: 0.4 + Math.random() * 0.5,
          });
        }
      }
    };
    init();

    const draw = (now) => {
      const g = ctx.createLinearGradient(0, 0, 0, h);
      if (isLight) {
        g.addColorStop(0, "#f6efe1"); g.addColorStop(0.5, "#efe5d0"); g.addColorStop(1, "#e6d9bd");
      } else {
        g.addColorStop(0, palCol.bg);
        g.addColorStop(0.55, palette === "ember" ? "#1c0e0a" : palette === "garden" ? "#0d1812" : "#11141d");
        g.addColorStop(1, palCol.bg);
      }
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      if (style === "aurora") {
        const time = now * 0.00015;
        for (let i = 0; i < 5; i++) {
          const cx = w * (0.2 + 0.7 * (0.5 + 0.5 * Math.sin(time * (1 + i * 0.3) + i)));
          const cy = h * (0.3 + 0.4 * (0.5 + 0.5 * Math.cos(time * (1.1 + i * 0.2) + i * 1.7)));
          const rad = Math.max(w, h) * (0.25 + i * 0.06);
          const rg = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
          const hueCol = isLight
            ? `rgba(168,123,58,${0.10 - i * 0.012})`
            : i % 2 === 0
              ? `rgba(212,168,87,${0.13 - i * 0.015})`
              : `rgba(120,84,180,${0.10 - i * 0.012})`;
          rg.addColorStop(0, hueCol);
          rg.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = rg;
          ctx.fillRect(0, 0, w, h);
        }
      }

      if (style === "bokeh") {
        for (const p of particles) {
          p.x += p.vx; p.y += p.vy; p.phase += 0.005;
          if (p.y + p.r < 0) { p.y = h + p.r; p.x = Math.random() * w; }
          if (p.x < -p.r) p.x = w + p.r;
          if (p.x > w + p.r) p.x = -p.r;
          const breath = 0.85 + 0.15 * Math.sin(p.phase);
          const r = p.r * breath;
          const rg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
          const c = palCol.accent;
          rg.addColorStop(0, hexToRgba(c, p.o));
          rg.addColorStop(0.6, hexToRgba(c, p.o * 0.3));
          rg.addColorStop(1, hexToRgba(c, 0));
          ctx.fillStyle = rg;
          ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2); ctx.fill();
        }
      }

      if (style === "embers") {
        ctx.globalCompositeOperation = "lighter";
        for (const p of particles) {
          p.x += p.vx + Math.sin(p.life * 6) * 0.2; p.y += p.vy;
          p.life -= p.decay;
          if (p.life <= 0 || p.y < -10) { p.y = h + 10; p.x = Math.random() * w; p.life = 1; }
          const alpha = p.o * p.life;
          ctx.fillStyle = hexToRgba(palCol.accent, alpha);
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = hexToRgba(palCol.accent, alpha * 0.15);
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2); ctx.fill();
        }
        ctx.globalCompositeOperation = "source-over";
      }

      if (style === "petals") {
        for (const p of particles) {
          p.sway += 0.01;
          p.x += p.vx + Math.sin(p.sway) * 0.3;
          p.y += p.vy; p.rot += p.vr;
          if (p.y - p.r > h) { p.y = -p.r; p.x = Math.random() * w; }
          if (p.x + p.r < 0) p.x = w + p.r;
          ctx.save();
          ctx.translate(p.x, p.y); ctx.rotate(p.rot);
          const col = p.hue < 0.5
            ? hexToRgba(palCol.accent, p.o)
            : hexToRgba(isLight ? "#8a6b3a" : "#e8d4a4", p.o * 0.8);
          ctx.fillStyle = col;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.r * 0.45, p.r, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      const vg = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.3, w / 2, h / 2, Math.max(w, h) * 0.75);
      vg.addColorStop(0, "rgba(0,0,0,0)");
      vg.addColorStop(1, isLight ? "rgba(80,60,30,0.18)" : "rgba(0,0,0,0.45)");
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, w, h);

      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [style, palette]);

  return <canvas ref={canvasRef} className="bg-canvas" aria-hidden="true" />;
}

function hexToRgba(hex, a) {
  const h = hex.replace("#", "");
  const x = h.length === 3 ? h.replace(/./g, (c) => c + c) : h;
  const n = parseInt(x, 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return `rgba(${r},${g},${b},${a})`;
}

// ─── Decorative SVGs ────────────────────────────────────────────────────────
function FlourishOrnament() {
  return (
    <svg viewBox="0 0 240 24" className="flourish" aria-hidden="true">
      <path d="M0 12 H92" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.5" />
      <path d="M148 12 H240" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.5" />
      <g transform="translate(120 12)" stroke="currentColor" strokeWidth="0.6" fill="none">
        <circle r="3" /><circle r="6" opacity="0.6" />
        <path d="M-14 0 L-9 0 M9 0 L14 0" opacity="0.7" />
      </g>
    </svg>
  );
}
function CornerOrnament() {
  return (
    <svg viewBox="0 0 60 60" className="corner-orn" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="0.5">
        <path d="M0 30 Q15 30 15 15 Q15 0 30 0" />
        <path d="M0 30 Q20 30 20 20 Q20 10 30 10" opacity="0.5" />
        <circle cx="30" cy="0" r="1.5" fill="currentColor" />
      </g>
    </svg>
  );
}

// ─── Header ─────────────────────────────────────────────────────────────────
function Header() {
  return (
    <header className="site-hd">
      <div className="site-hd-mark">
        <svg viewBox="0 0 32 32" width="18" height="18" aria-hidden="true">
          <g fill="none" stroke="currentColor" strokeWidth="1">
            <circle cx="16" cy="16" r="6" />
            <circle cx="16" cy="16" r="11" opacity="0.5" />
            <circle cx="16" cy="16" r="15" opacity="0.25" />
          </g>
        </svg>
        <span>est. 1970</span>
      </div>
      <nav className="site-nav">
        <a href="#card">Card</a>
        <a href="#sky">Sky</a>
        <a href="#voices">Voices</a>
        <a href="#album">Album</a>
        <a href="#blessings">Blessings</a>
        <a href="#cheers">Cheers</a>
      </nav>
      <div className="site-hd-date">24 · 05 · 2026</div>
    </header>
  );
}

// ─── Hero ───────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="hero" data-screen-label="01 Hero">
      <div className="hero-kicker">
        <span className="dot" />
        <span>{HERO.kicker}</span>
      </div>
      <h1 className="hero-title">
        <span className="hero-l1">{HERO.line1}</span>
        <span className="hero-l2">{HERO.line2}</span>
      </h1>

      <div className="hero-script-block">
        <div className="hero-script-label">
          <span className="dash" />
          <span>your name, {FATHER.nameScriptLabel}</span>
          <span className="dash" />
        </div>
        <div className="hero-script-name">{FATHER.nameScript}</div>
        <div className="hero-script-romanized">{FATHER.name}</div>
      </div>

      <p className="hero-sub">{HERO.sub}</p>
      <div className="hero-meta">
        <div className="hero-meta-col">
          <span className="hero-meta-k">Honouring</span>
          <span className="hero-meta-v">{FATHER.name}</span>
        </div>
        <div className="hero-meta-divider" />
        <div className="hero-meta-col">
          <span className="hero-meta-k">Year</span>
          <span className="hero-meta-v">Fifty&#8209;six</span>
        </div>
        <div className="hero-meta-divider" />
        <div className="hero-meta-col">
          <span className="hero-meta-k">Born</span>
          <span className="hero-meta-v">{FATHER.dob}</span>
        </div>
      </div>
      <div className="hero-scroll">
        <span>scroll · open the card</span>
        <svg viewBox="0 0 12 24" width="12" height="24"><path d="M6 2 V20 M2 16 L6 20 L10 16" stroke="currentColor" strokeWidth="0.8" fill="none" /></svg>
      </div>
    </section>
  );
}

// ─── Portrait + Quote ───────────────────────────────────────────────────────
function PortraitBlock() {
  return (
    <section className="portrait-row" data-screen-label="02 Portrait">
      <div className="portrait-frame">
        <div className="portrait-img">
          <image-slot id="papa-portrait" shape="rect"
            src="photos/happyphoto.jpg"
            placeholder="photos/happyphoto.jpg"
            style={{ display: "block", width: "100%", aspectRatio: "4/5" }}></image-slot>
          <span className="portrait-tag">№ 01 · the man himself</span>
        </div>
      </div>
      <div className="portrait-quote">
        <FlourishOrnament />
        <blockquote>
          <span className="quote-mark">&ldquo;</span>
          The measure of a man is not the storms he avoids, but the ones his family never has to weather.
        </blockquote>
        <cite>— a thing Papa has never said, but lives by</cite>
      </div>
    </section>
  );
}

function SectionHead({ num, title, sub, center }) {
  return (
    <div className={center ? "section-head center" : "section-head"}>
      {num && <span className="section-num">{num}</span>}
      <h2 className="section-title" dangerouslySetInnerHTML={{ __html: title }} />
      {sub && <p className="section-sub">{sub}</p>}
    </div>
  );
}

// ─── Audio Slot (one row inside an audio band) ──────────────────────────────
function AudioSlot({ slot, index }) {
  const audioRef = useRef(null);
  const [state, setState] = useState({
    error: false, playing: false, current: 0, duration: 0,
  });

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onMeta = () => setState((s) => ({ ...s, error: false, duration: a.duration || 0 }));
    const onTime = () => setState((s) => ({ ...s, current: a.currentTime }));
    const onPlay = () => setState((s) => ({ ...s, playing: true }));
    const onPause = () => setState((s) => ({ ...s, playing: false }));
    const onErr  = () => setState((s) => ({ ...s, error: true }));
    const onEnd  = () => setState((s) => ({ ...s, playing: false, current: 0 }));
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    a.addEventListener("error", onErr);
    a.addEventListener("ended", onEnd);
    return () => {
      a.removeEventListener("loadedmetadata", onMeta);
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("error", onErr);
      a.removeEventListener("ended", onEnd);
    };
  }, [slot.src]);

  const toggle = () => {
    const a = audioRef.current;
    if (!a || state.error) return;
    document.querySelectorAll("audio.papa-audio").forEach((el) => {
      if (el !== a) el.pause();
    });
    if (a.paused) a.play().catch(() => setState((s) => ({ ...s, error: true })));
    else a.pause();
  };
  const seek = (e) => {
    const a = audioRef.current;
    if (!a || !state.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    a.currentTime = Math.max(0, Math.min(state.duration, (x / rect.width) * state.duration));
  };
  const fmt = (s) => {
    if (!isFinite(s)) return "0:00";
    const m = Math.floor(s / 60), r = Math.floor(s % 60);
    return `${m}:${r < 10 ? "0" : ""}${r}`;
  };
  const pct = state.duration > 0 ? (state.current / state.duration) * 100 : 0;

  return (
    <div className={`audio-slot ${state.error ? "is-error" : ""} ${state.playing ? "is-playing" : ""}`}>
      <audio ref={audioRef} className="papa-audio" preload="metadata" src={slot.src} />
      <div className="audio-slot-label">
        <span className="slot-idx">№ {String(index + 1).padStart(2, "0")}</span>
        <span className="slot-name">{slot.label}</span>
      </div>
      <button className={`audio-play sm ${state.playing ? "playing" : ""}`} onClick={toggle}
        disabled={state.error} aria-label={state.playing ? "pause" : "play"}>
        {state.error ? (
          <svg viewBox="0 0 24 24" width="18" height="18"><path d="M12 2 L22 20 L2 20 Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /><line x1="12" y1="10" x2="12" y2="15" stroke="currentColor" strokeWidth="1.5" /><circle cx="12" cy="17.5" r="0.8" fill="currentColor" /></svg>
        ) : state.playing ? (
          <svg viewBox="0 0 24 24" width="18" height="18"><rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" /><rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" /></svg>
        ) : (
          <svg viewBox="0 0 24 24" width="18" height="18"><path d="M7 4 L20 12 L7 20 Z" fill="currentColor" /></svg>
        )}
      </button>
      <div className="audio-slot-track" onClick={seek}>
        <div className="audio-wave" aria-hidden="true">
          {Array.from({ length: 36 }).map((_, i) => {
            const h = 22 + Math.sin(i * 0.7 + index * 1.3) * 22 + Math.cos(i * 0.4 + index * 2.1) * 16;
            const passed = (i / 36) * 100 < pct;
            return <span key={i} className={passed ? "on" : ""} style={{ height: `${Math.min(72, Math.max(8, h))}%` }} />;
          })}
        </div>
      </div>
      <div className="audio-slot-time">
        {state.error ? (
          <span className="missing">no file</span>
        ) : (
          <>
            <span>{fmt(state.current)}</span>
            <span className="dim">/ {fmt(state.duration)}</span>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Audio Band (one section per relation) ──────────────────────────────────
function AudioBand({ entry, index }) {
  const flipped = index % 2 === 1;
  const missingFiles = entry.slots.map((s) => s.src);

  return (
    <article className={`band band-${entry.accent} ${flipped ? "flip" : ""}`} id={`band-${entry.id}`}>
      <div className="band-marker">
        <span className="band-eyebrow">{entry.eyebrow}</span>
        <span className="band-rule" />
        <span className="band-voices">{entry.slots.length} {entry.slots.length === 1 ? "voice" : "voices"}</span>
      </div>

      <h3 className="band-title">{entry.title}</h3>
      <p className="band-intro">{entry.intro}</p>

      <div className="audio-slots">
        {entry.slots.map((s, i) => <AudioSlot key={s.id} slot={s} index={i} />)}
      </div>

      <details className="band-fileguide">
        <summary>Where to put the {entry.slots.length === 1 ? "file" : "files"}</summary>
        <p>Place {entry.slots.length === 1 ? "this file" : "these files"} in your project to play {entry.slots.length === 1 ? "it" : "them"} here:</p>
        <ul>
          {missingFiles.map((f) => <li key={f}><code>{f}</code></li>)}
        </ul>
      </details>
    </article>
  );
}

function AudioMessages() {
  return (
    <section id="voices" className="voices" data-screen-label="04 Voices">
      <SectionHead
        num="03 · VOICES FOR YOU"
        title="Press <em>play</em>. We're all here."
        sub="Voice notes from the people who could not say it small enough to fit in writing. Each one is its own little world — the way it should be."
      />
      <div className="bands">
        {AUDIO.map((a, i) => <AudioBand key={a.id} entry={a} index={i} />)}
      </div>
    </section>
  );
}

// ─── Family Album ───────────────────────────────────────────────────────────
function FamilyAlbum() {
  return (
    <section id="album" className="family-album" data-screen-label="05 Album">
      <SectionHead
        center
        num="04 · THE FAMILY ALBUM"
        title="Some pictures, <em>for the record.</em>"
        sub="Drop your favourites in. Tap a slot from your phone to pick a photo from your gallery."
      />
      <div className="photo-strip three">
        <image-slot id="papa-photo-1" shape="rect" src="photos/old photo.jpg"
          placeholder="photos/old photo.jpg"
          style={{ display: "block", width: "100%", aspectRatio: "3/4" }}></image-slot>
        <image-slot id="papa-photo-2" shape="rect" src="photos/last photo.jpg"
          placeholder="photos/last photo.jpg"
          style={{ display: "block", width: "100%", aspectRatio: "3/4" }}></image-slot>
        <image-slot id="papa-photo-3" shape="rect" src="photos/happyphoto.jpg"
          placeholder="photos/happyphoto.jpg"
          style={{ display: "block", width: "100%", aspectRatio: "3/4" }}></image-slot>
      </div>
    </section>
  );
}

// ─── Blessings From Above ───────────────────────────────────────────────────
function Blessings() {
  return (
    <section id="blessings" className="blessings" data-screen-label="06 Blessings">
      <SectionHead
        center
        num="05 · GONE — BUT NEVER FAR"
        title="Watching over you, <em>still.</em>"
        sub="The ones whose love did not leave when they did. Today, they are blessing you too."
      />
      <div className="blessings-row single">
        {BLESSINGS.map((b, i) => (
          <figure key={b.id} className="blessing">
            <div className="blessing-halo" aria-hidden="true">
              <svg viewBox="0 0 100 100" width="100%" height="100%">
                <defs>
                  <radialGradient id={`halo-${i}`} cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#d4a857" stopOpacity="0.35" />
                    <stop offset="60%" stopColor="#d4a857" stopOpacity="0.10" />
                    <stop offset="100%" stopColor="#d4a857" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <circle cx="50" cy="50" r="48" fill={`url(#halo-${i})`} />
              </svg>
            </div>
            <div className="blessing-frame">
              <image-slot id={b.id} shape="circle" src={b.src}
                placeholder={b.src}
                style={{ display: "block", width: "100%", aspectRatio: "1/1" }}></image-slot>
            </div>
            <figcaption>{b.name}</figcaption>
          </figure>
        ))}
      </div>
      <div className="blessings-foot">
        <FlourishOrnament />
        <p>
          May the love they left behind keep watch over this day, and over every day that follows. They are with us.
        </p>
      </div>
    </section>
  );
}

// ─── Closing — Cheers To You ────────────────────────────────────────────────
function Closing() {
  return (
    <section id="cheers" className="closing" data-screen-label="07 Cheers">
      <div className="cheers-eyebrow">
        <FlourishOrnament />
      </div>

      <h2 className="closing-line">
        <em>Cheers,</em> <span className="closing-papa">Papa</span><span className="closing-dot">.</span>
      </h2>

      {/* Two clinking glasses */}
      <svg className="glasses" viewBox="0 0 220 140" width="180" height="120" aria-hidden="true">
        <defs>
          <linearGradient id="glass-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f5efe2" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#f5efe2" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <g fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
          {/* left glass */}
          <g transform="translate(72 70) rotate(-14)">
            <path d="M -20 -40 L 20 -40 Q 22 -10 0 5 Q -22 -10 -20 -40 Z" fill="url(#glass-grad)" />
            <path d="M -22 -38 Q 0 -33 22 -38" opacity="0.5" />
            <line x1="0" y1="5" x2="0" y2="40" />
            <ellipse cx="0" cy="42" rx="18" ry="3" />
            {/* liquid */}
            <path d="M -18 -34 L 18 -34 Q 20 -16 0 -3 Q -20 -16 -18 -34 Z" fill="currentColor" opacity="0.18" stroke="none" />
          </g>
          {/* right glass */}
          <g transform="translate(148 70) rotate(14)">
            <path d="M -20 -40 L 20 -40 Q 22 -10 0 5 Q -22 -10 -20 -40 Z" fill="url(#glass-grad)" />
            <path d="M -22 -38 Q 0 -33 22 -38" opacity="0.5" />
            <line x1="0" y1="5" x2="0" y2="40" />
            <ellipse cx="0" cy="42" rx="18" ry="3" />
            <path d="M -18 -34 L 18 -34 Q 20 -16 0 -3 Q -20 -16 -18 -34 Z" fill="currentColor" opacity="0.18" stroke="none" />
          </g>
          {/* clink sparks */}
          <g opacity="0.75">
            <path d="M 100 18 L 104 26 M 110 12 L 110 24 M 120 18 L 116 26" strokeWidth="1.5" />
          </g>
        </g>
      </svg>

      <div className="closing-sig">
        <span className="sig-line">with all the love in the world,</span>
        <span className="sig-line dim">from every person you have ever held —</span>
      </div>

      <div className="signers">
        <span>your wife</span>
        <span className="sep">·</span>
        <span>your son</span>
        <span className="sep">·</span>
        <span>your daughter</span>
        <span className="sep">·</span>
        <span>your sister</span>
        <span className="sep">·</span>
        <span>your nieces</span>
        <span className="sep">·</span>
        <span>your nephews</span>
        <span className="sep">·</span>
        <span>your grandbabies</span>
        <span className="sep">·</span>
        <span>and the ones watching from above</span>
      </div>

      <div className="closing-stamp">
        <div className="closing-stamp-line">— infinity squared and back —</div>
        <div className="closing-stamp-inf">♾️ ❤️</div>
      </div>

      <div className="closing-script">{FATHER.nameScript}</div>

      <div className="closing-foot">
        <span>built with love · 24 may 2026</span>
        <span>♡</span>
      </div>
    </section>
  );
}

// ─── Music chip (placeholder) ───────────────────────────────────────────────
function MusicToggle({ on }) {
  if (!on) return null;
  return (
    <div className="music-chip">
      <span className="music-pulse" />
      <span>now playing · "for him" — a family playlist</span>
    </div>
  );
}

// ─── App ────────────────────────────────────────────────────────────────────
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const pal = PALETTES[t.palette] || PALETTES.midnight;

  useEffect(() => {
    const r = document.documentElement;
    Object.entries(pal).forEach(([k, v]) => r.style.setProperty(`--c-${k}`, v));
    r.dataset.palette = t.palette;
  }, [pal, t.palette]);

  return (
    <div className="app">
      <CinematicBackground style={t.bgStyle} palette={t.palette} />
      <Confetti />
      <div className="content">
        <Header />
        <Hero />
        <div id="card">
          <OpenableCard
            to={FATHER.call}
            from={LETTER_FROM}
            body={LETTER_BODY}
            signOff={LETTER_SIGNOFF}
            dobParts={FATHER.dobNum}
            place={FATHER.birthplace}
          />
        </div>
        <PortraitBlock />
        <div id="sky">
          <StarMap date="24 MAY 1970" name={FATHER.name.toUpperCase()} place={FATHER.birthplace.toUpperCase()} />
        </div>
        <AudioMessages />
        <FamilyAlbum />
        <Blessings />
        <Closing />
      </div>
      <MusicToggle on={t.music} />
      <TweaksPanel title="Tweaks">
        <TweakSection label="Background">
          <TweakSelect label="Style" value={t.bgStyle}
            options={[
              { value: "petals", label: "Drifting petals" },
              { value: "bokeh",  label: "Warm bokeh" },
              { value: "embers", label: "Rising embers" },
              { value: "aurora", label: "Slow aurora" },
            ]}
            onChange={(v) => setTweak("bgStyle", v)} />
        </TweakSection>
        <TweakSection label="Palette">
          <TweakColor label="Theme" value={[pal.bg, pal.fg, pal.accent]}
            options={[
              [PALETTES.midnight.bg, PALETTES.midnight.fg, PALETTES.midnight.accent],
              [PALETTES.ember.bg,    PALETTES.ember.fg,    PALETTES.ember.accent],
              [PALETTES.garden.bg,   PALETTES.garden.fg,   PALETTES.garden.accent],
              [PALETTES.cream.bg,    PALETTES.cream.fg,    PALETTES.cream.accent],
            ]}
            onChange={(arr) => {
              const match = Object.entries(PALETTES).find(([, p]) => p.bg === arr[0]);
              if (match) setTweak("palette", match[0]);
            }} />
          <TweakSelect label="Named" value={t.palette}
            options={[
              { value: "midnight", label: "Midnight (dark)" },
              { value: "ember",    label: "Ember (warm dark)" },
              { value: "garden",   label: "Garden (forest dark)" },
              { value: "cream",    label: "Cream (light)" },
            ]}
            onChange={(v) => setTweak("palette", v)} />
        </TweakSection>
        <TweakSection label="Extras">
          <TweakToggle label="Music indicator" value={t.music}
            onChange={(v) => setTweak("music", v)} />
          <TweakButton label="Replay confetti" secondary
            onClick={() => { try { sessionStorage.removeItem("papa-confetti"); } catch(e){} location.reload(); }} />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
