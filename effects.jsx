// effects.jsx — special components for Papa's birthday site
// - Confetti: first-load celebration burst
// - StarMap: stylized night-sky medallion for 14 May 1970
// - OpenableCard: folded card that opens on click to reveal a handwritten message

const { useState: _useState, useEffect: _useEffect, useRef: _useRef } = React;

// ─── Confetti ────────────────────────────────────────────────────────────────
// Fires once per session on first load. Uses sessionStorage so re-visits in the
// same tab don't replay it; opening a new tab will burst again.
function Confetti() {
  const cnv = _useRef(null);
  const [show, setShow] = _useState(() => {
    try { return sessionStorage.getItem("papa-confetti") !== "1"; }
    catch (e) { return true; }
  });

  _useEffect(() => {
    if (!show) return;
    try { sessionStorage.setItem("papa-confetti", "1"); } catch (e) {}
    const c = cnv.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = window.innerWidth, h = window.innerHeight;
    c.width = w * dpr; c.height = h * dpr;
    c.style.width = w + "px"; c.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const colors = ["#d4a857", "#e8c87a", "#f5efe2", "#d97a8a", "#94a989", "#e8a06b", "#ffffff"];
    const pieces = [];
    // Two bursts — one from each lower corner — for a wedding/celebration feel
    const burst = (originX, dirX) => {
      for (let i = 0; i < 110; i++) {
        const angle = (-Math.PI / 2) + (Math.random() - 0.5) * 1.4 + dirX * 0.3;
        const speed = 9 + Math.random() * 14;
        pieces.push({
          x: originX, y: h - 20,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          g: 0.18 + Math.random() * 0.08,
          drag: 0.985,
          size: 4 + Math.random() * 7,
          rot: Math.random() * Math.PI * 2,
          vr: (Math.random() - 0.5) * 0.3,
          color: colors[(Math.random() * colors.length) | 0],
          shape: Math.random() < 0.4 ? "rect" : Math.random() < 0.7 ? "circle" : "strip",
          life: 1,
        });
      }
    };
    burst(w * 0.15, 0.6);
    burst(w * 0.85, -0.6);
    // top sprinkle for fullness
    for (let i = 0; i < 60; i++) {
      pieces.push({
        x: Math.random() * w, y: -20 - Math.random() * 80,
        vx: (Math.random() - 0.5) * 2,
        vy: 2 + Math.random() * 3,
        g: 0.08, drag: 0.995,
        size: 4 + Math.random() * 6,
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.18,
        color: colors[(Math.random() * colors.length) | 0],
        shape: Math.random() < 0.5 ? "rect" : "circle",
        life: 1,
      });
    }

    let raf = 0;
    let start = performance.now();
    const draw = (now) => {
      const t = now - start;
      ctx.clearRect(0, 0, w, h);
      let alive = 0;
      for (const p of pieces) {
        p.vx *= p.drag; p.vy *= p.drag;
        p.vy += p.g;
        p.x += p.vx; p.y += p.vy;
        p.rot += p.vr;
        if (t > 2500) p.life = Math.max(0, p.life - 0.012);
        if (p.life <= 0 || p.y > h + 40) continue;
        alive++;
        ctx.save();
        ctx.globalAlpha = p.life;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        if (p.shape === "circle") {
          ctx.beginPath(); ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2); ctx.fill();
        } else if (p.shape === "strip") {
          ctx.fillRect(-p.size * 0.15, -p.size, p.size * 0.3, p.size * 2);
        } else {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        }
        ctx.restore();
      }
      if (alive > 0) {
        raf = requestAnimationFrame(draw);
      } else {
        setShow(false);
      }
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [show]);

  if (!show) return null;
  return <canvas ref={cnv} className="confetti-canvas" aria-hidden="true" />;
}

// ─── Star Map ────────────────────────────────────────────────────────────────
// Stylized night sky medallion. Stars are hand-positioned for a beautiful
// composition rather than astronomical accuracy — but the prominent shapes
// reference constellations visible in the May northern night sky:
// Ursa Major (Big Dipper), Leo, Boötes (with Arcturus), Virgo, Cygnus.
function StarMap({ date = "14 MAY 1970", name = "DHIRAJ SARMA", place = "" }) {
  const ref = _useRef(null);
  const [visible, setVisible] = _useState(false);

  _useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  // Star catalog — [x, y, magnitude(0..1)]. Coordinates in a 600×600 box.
  // Brighter stars (higher magnitude value) render larger.
  const STARS = [
    // Big Dipper
    [180, 180, 0.95], [215, 195, 0.85], [250, 200, 0.9],
    [290, 210, 0.85], [320, 240, 0.8], [340, 275, 0.95], [310, 260, 0.85],
    // Leo (Regulus + sickle)
    [420, 290, 1.0], [445, 310, 0.7], [460, 280, 0.75],
    [475, 260, 0.65], [490, 245, 0.7], [500, 290, 0.6],
    // Boötes / Arcturus
    [380, 380, 0.95], [400, 410, 0.65], [420, 430, 0.55], [365, 405, 0.5],
    // Virgo / Spica
    [475, 460, 0.9], [505, 445, 0.55],
    // Cygnus
    [150, 380, 0.85], [170, 410, 0.65], [180, 440, 0.6],
    [130, 410, 0.55], [200, 425, 0.5],
    // background scatter
    [120, 250, 0.35], [260, 320, 0.3], [350, 150, 0.4],
    [400, 200, 0.35], [220, 450, 0.3], [550, 380, 0.35],
    [80, 320, 0.3], [560, 200, 0.4], [110, 480, 0.35],
    [280, 480, 0.3], [430, 510, 0.35], [510, 330, 0.4],
    [340, 350, 0.3], [240, 250, 0.35], [380, 460, 0.3],
    [80, 200, 0.35], [550, 470, 0.3], [260, 130, 0.4],
    [490, 140, 0.3], [330, 510, 0.35], [165, 320, 0.3],
    [410, 130, 0.35], [200, 510, 0.3], [445, 380, 0.3],
    [60, 380, 0.3], [580, 290, 0.35], [285, 380, 0.3],
  ];

  const LINES = [
    // Big Dipper
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 3],
    // Leo sickle
    [7, 8], [8, 9], [9, 10], [10, 11], [11, 12], [7, 12],
    // Boötes kite
    [13, 14], [13, 16], [14, 15], [15, 16],
    // Virgo
    [17, 18],
    // Cygnus cross
    [19, 20], [20, 21], [19, 22], [20, 23],
  ];

  // Circular text along the outer rim
  const RIM_TEXT_UPPER = `★  ${name}  ★  THE NIGHT YOU WERE BORN  `;
  const RIM_TEXT_LOWER = `${date}${place ? "  ·  " + place : ""}  ·  ALL THE STARS WERE WAITING`;

  return (
    <section className="starmap-section" data-screen-label="03 Star Map" ref={ref}>
      <div className="section-head center">
        <span className="section-num">01 · A GIFT FROM THE SKY</span>
        <h2 className="section-title">The night you were <em>born</em></h2>
        <p className="section-sub">A reading of the heavens on the evening of {date}. The stars were arranging themselves, knowing the world was about to gain you.</p>
      </div>
      <div className={`starmap-wrap ${visible ? "in" : ""}`}>
        <svg viewBox="0 0 600 600" className="starmap" aria-label="Star map medallion">
          <defs>
            <radialGradient id="sm-bg" cx="50%" cy="50%" r="50%">
              <stop offset="0%"  stopColor="#1a2138" />
              <stop offset="55%" stopColor="#0d1322" />
              <stop offset="100%" stopColor="#070912" />
            </radialGradient>
            <radialGradient id="sm-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%"  stopColor="#d4a857" stopOpacity="0.18" />
              <stop offset="50%" stopColor="#d4a857" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#d4a857" stopOpacity="0" />
            </radialGradient>
            <filter id="sm-star-glow" x="-200%" y="-200%" width="500%" height="500%">
              <feGaussianBlur stdDeviation="2" />
            </filter>
            <path id="rim-upper" d="M 300 300 m -240 0 a 240 240 0 1 1 480 0" />
            <path id="rim-lower" d="M 300 300 m -240 0 a 240 240 0 1 0 480 0" />
          </defs>

          {/* outer decorative rings */}
          <circle cx="300" cy="300" r="285" fill="none" stroke="#d4a857" strokeWidth="0.4" opacity="0.5" />
          <circle cx="300" cy="300" r="278" fill="none" stroke="#d4a857" strokeWidth="0.3" opacity="0.3" />

          {/* rim text */}
          <text fontSize="12" letterSpacing="3.5" fill="#e8c87a" opacity="1" fontFamily="'JetBrains Mono', monospace" fontWeight="500">
            <textPath href="#rim-upper" startOffset="50%" textAnchor="middle">{RIM_TEXT_UPPER}</textPath>
          </text>
          <text fontSize="12" letterSpacing="3.5" fill="#e8c87a" opacity="1" fontFamily="'JetBrains Mono', monospace" fontWeight="500">
            <textPath href="#rim-lower" startOffset="50%" textAnchor="middle">{RIM_TEXT_LOWER}</textPath>
          </text>

          {/* tick marks */}
          {Array.from({ length: 60 }).map((_, i) => {
            const a = (i / 60) * Math.PI * 2 - Math.PI / 2;
            const r1 = 258, r2 = i % 5 === 0 ? 268 : 263;
            return (
              <line key={i}
                x1={300 + Math.cos(a) * r1} y1={300 + Math.sin(a) * r1}
                x2={300 + Math.cos(a) * r2} y2={300 + Math.sin(a) * r2}
                stroke="#d4a857" strokeWidth={i % 5 === 0 ? 0.7 : 0.4}
                opacity={i % 5 === 0 ? 0.8 : 0.45} />
            );
          })}

          {/* sky disc */}
          <circle cx="300" cy="300" r="248" fill="url(#sm-bg)" />
          <circle cx="300" cy="300" r="248" fill="url(#sm-glow)" />

          {/* cardinal markers (N E S W) */}
          {["N", "E", "S", "W"].map((d, i) => {
            const a = (i / 4) * Math.PI * 2 - Math.PI / 2;
            return (
              <text key={d} x={300 + Math.cos(a) * 235} y={300 + Math.sin(a) * 235 + 3.5}
                fontSize="11" fontFamily="'Cormorant Garamond', serif" fontStyle="italic"
                textAnchor="middle" fill="#d4a857" opacity="0.85">{d}</text>
            );
          })}

          {/* clip stars to sky disc */}
          <g clipPath="url(#sm-clip)">
            <defs>
              <clipPath id="sm-clip"><circle cx="300" cy="300" r="245" /></clipPath>
            </defs>

            {/* constellation lines */}
            <g stroke="#d4a857" strokeWidth="0.35" opacity="0.45">
              {LINES.map(([a, b], i) => (
                <line key={i} x1={STARS[a][0]} y1={STARS[a][1]} x2={STARS[b][0]} y2={STARS[b][1]} />
              ))}
            </g>

            {/* stars */}
            <g>
              {STARS.map(([x, y, mag], i) => (
                <g key={i}>
                  {mag > 0.7 && (
                    <circle cx={x} cy={y} r={mag * 6} fill="#fff7d4" opacity={mag * 0.25} filter="url(#sm-star-glow)" />
                  )}
                  <circle cx={x} cy={y} r={Math.max(0.6, mag * 2.2)} fill={mag > 0.7 ? "#fff7e0" : "#e8e2c8"}
                    className="sm-star" style={{ animationDelay: `${(i * 0.07) % 4}s` }} />
                </g>
              ))}
            </g>

            {/* meridian and ecliptic */}
            <line x1="300" y1="55" x2="300" y2="545" stroke="#d4a857" strokeWidth="0.3" opacity="0.18" strokeDasharray="2 4" />
            <path d="M 60 320 Q 300 260 540 320" stroke="#d4a857" strokeWidth="0.3" fill="none" opacity="0.25" strokeDasharray="3 3" />
          </g>

          {/* center compass rose */}
          <g transform="translate(300 300)" opacity="0.35">
            <circle r="14" fill="none" stroke="#d4a857" strokeWidth="0.5" />
            <path d="M 0 -8 L 1.5 0 L 0 8 L -1.5 0 Z" fill="#d4a857" />
            <path d="M -8 0 L 0 1.5 L 8 0 L 0 -1.5 Z" fill="#d4a857" opacity="0.6" />
          </g>
        </svg>

        <div className="starmap-caption">
          <span className="sm-cap-k">Latitude</span><span className="sm-cap-v">26° 09′ N</span>
          <span className="sm-cap-k">Longitude</span><span className="sm-cap-v">91° 44′ E</span>
          <span className="sm-cap-k">Bortle</span><span className="sm-cap-v">Class 3 · Rural</span>
        </div>
      </div>
    </section>
  );
}

// ─── Openable Birthday Card ──────────────────────────────────────────────────
function OpenableCard({ to, from, body, signOff = "with all my love,", dobParts = ["24", "05", "1970"], place = "Guwahati, Assam" }) {
  const [open, setOpen] = _useState(false);
  return (
    <section className="card-section" data-screen-label="02 Card">
      <div className="card-eyebrow">
        <span className="card-num">★ tap to open ★</span>
      </div>
      <div className={`gift-card ${open ? "open" : ""}`} onClick={() => setOpen((v) => !v)}>
        <div className="gift-card-shadow" />
        <div className="gift-card-outer">
          <div className="gift-card-front">
            <div className="gc-corner gc-tl"><CardCorner /></div>
            <div className="gc-corner gc-tr"><CardCorner /></div>
            <div className="gc-corner gc-bl"><CardCorner /></div>
            <div className="gc-corner gc-br"><CardCorner /></div>
            <div className="gc-front-inner">
              <div className="gc-eyebrow">A card for</div>
              <div className="gc-name">{to}</div>
              <div className="gc-ornament">
                <svg viewBox="0 0 120 30" width="120" height="30">
                  <g fill="none" stroke="currentColor" strokeWidth="0.6">
                    <path d="M0 15 H40" />
                    <path d="M80 15 H120" />
                    <circle cx="60" cy="15" r="3" />
                    <circle cx="60" cy="15" r="7" opacity="0.5" />
                    <circle cx="60" cy="15" r="1" fill="currentColor" />
                  </g>
                </svg>
              </div>
              <div className="gc-tap">tap to open</div>
            </div>
          </div>
        </div>
        <div className="gift-card-inside" onClick={(e) => e.stopPropagation()}>
          <div className="gc-inside-left">
            <div className="gc-photo-frame">
              <image-slot id="card-photo" shape="rect"
                src="photos/me n papa.jpg"
                placeholder="photos/me n papa.jpg"
                style={{ display: "block", width: "100%", aspectRatio: "3/4" }}></image-slot>
            </div>
            <div className="gc-stamp">
              <div className="gc-stamp-date">{dobParts[0]}<span>·</span>{dobParts[1]}<span>·</span>{dobParts[2]}</div>
              <div className="gc-stamp-place">{place}</div>
            </div>
          </div>
          <div className="gc-inside-right">
            <div className="gc-letter-head">
              <span className="gc-to">Happy Birthday, {to} ❤️</span>
            </div>
            <div className="gc-letter-body">
              {body.map((p, i) => <p key={i}>{p}</p>)}
            </div>
            <div className="gc-letter-sign">
              <span className="gc-signoff">{signOff}</span>
              <span className="gc-from">{from}</span>
            </div>
          </div>
        </div>
      </div>
      <p className="card-hint">{open ? "tap the cover to close" : "tap the card to read your message"}</p>
    </section>
  );
}

function CardCorner() {
  return (
    <svg viewBox="0 0 40 40" width="40" height="40">
      <g fill="none" stroke="currentColor" strokeWidth="0.6">
        <path d="M0 20 Q10 20 10 10 Q10 0 20 0" />
        <path d="M0 14 Q14 14 14 14 Q14 14 14 0" opacity="0.5" />
      </g>
    </svg>
  );
}

Object.assign(window, { Confetti, StarMap, OpenableCard });
