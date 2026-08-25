import React, { useEffect, useRef, useState } from "react";

/* ============================================================
   SWARUP — DENSE ASCII PORTRAIT (classic brightness-ramp style)
============================================================ */

const IMAGE_SRC = "/profile-code-swarup.png";
const cache = new Map();

const getSize = (vw) => {
  if (vw <= 480) return { width: 300, height: 470 };
  if (vw <= 768) return { width: 340, height: 520 };
  return { width: 420, height: 620 };
};

/* Classic dark→light ASCII ramp. Index 0 = emptiest (dark source),
   last index = densest glyph (bright source). This is the key fix:
   ONE ramp, driven by brightness, not two disjoint symbol sets. */
const RAMP =
  " .'`^,:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW%B@$";

const luminance = (r, g, b) => (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
const clamp = (v, min = 0, max = 1) => Math.max(min, Math.min(max, v));

const getChar = (brightness) => {
  // gamma lift so mid/dark tones still read as visible glyphs
  const v = clamp(Math.pow(clamp(brightness), 0.72));
  const i = Math.floor(v * (RAMP.length - 1));
  return RAMP[Math.max(0, Math.min(RAMP.length - 1, i))];
};

const AsciiPortrait = () => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const mouseTargetRef = useRef({ x: -9999, y: -9999 });
  const startTimeRef = useRef(0);

  const [viewportWidth, setViewportWidth] = useState(() => window.innerWidth);
  const [ready, setReady] = useState(false);

  /* -------------------- resize -------------------- */
  useEffect(() => {
    let t = null;
    const onResize = () => {
      if (t) clearTimeout(t);
      t = setTimeout(() => setViewportWidth(window.innerWidth), 120);
    };
    window.addEventListener("resize", onResize);
    return () => {
      if (t) clearTimeout(t);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  /* -------------------- image → particles -------------------- */
  const convertImage = (image, width, height) => {
    const off = document.createElement("canvas");
    off.width = width;
    off.height = height;
    // NOTE: this offscreen canvas is only used to SAMPLE brightness/color
    // for the ASCII glyphs — it never touches the visible canvas, so its
    // black fill has no effect on the transparent background.
    const ctx = off.getContext("2d", { willReadFrequently: true });
    if (!ctx) return [];

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height);

    const imgRatio = image.width / image.height;
    const canvasRatio = width / height;
    let drawW, drawH;
    if (imgRatio > canvasRatio) {
      drawW = width * 0.98;
      drawH = drawW / imgRatio;
    } else {
      drawH = height * 0.98;
      drawW = drawH * imgRatio;
    }
    const offsetX = (width - drawW) / 2;
    const offsetY = (height - drawH) / 2;
    ctx.drawImage(image, offsetX, offsetY, drawW, drawH);

    const { data } = ctx.getImageData(0, 0, width, height);

    // Fine grid — higher density than before, tuned to a monospace
    // cell aspect ratio at the font size we render with (6px).
    const cellW = 3.2;
    const cellH = 5.4;

    const sampleCell = (sx, sy) => {
      const ex = Math.min(width, Math.ceil(sx + cellW));
      const ey = Math.min(height, Math.ceil(sy + cellH));
      let r = 0, g = 0, b = 0, count = 0;
      for (let y = Math.floor(sy); y < ey; y++) {
        for (let x = Math.floor(sx); x < ex; x++) {
          const i = (y * width + x) * 4;
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count++;
        }
      }
      if (!count) return { r: 0, g: 0, b: 0, brightness: 0 };
      r /= count; g /= count; b /= count;
      return { r, g, b, brightness: luminance(r, g, b) };
    };

    const particles = [];
    for (let y = 0; y < height; y += cellH) {
      for (let x = 0; x < width; x += cellW) {
        const { r, g, b, brightness } = sampleCell(x, y);

        // Skip only genuinely black/empty cells — everything else
        // gets rendered, so the frame reads as a filled photograph.
        if (brightness < 0.015) continue;

        const character = getChar(brightness);

        // --- Color: desaturate toward gray + cool tint so glyphs
        // blend into a dark navy background instead of reading as a
        // literal skin-tone blob. Then lift shadows so dark areas
        // (outline, hairline, jaw) stay clearly visible instead of
        // fading to near-black.
        const gray = brightness * 255;
        const desat = 0.55; // 0 = full color, 1 = full grayscale
        const dr = r * (1 - desat) + gray * desat;
        const dg = g * (1 - desat) + gray * desat;
        const db = b * (1 - desat) + gray * desat;

        const boost = 0.8 + brightness * 0.35;
        const shadowLift = 70; // raises dark cells so outline reads clearly
        const cr = Math.min(255, dr * boost + shadowLift * 0.9);
        const cg = Math.min(255, dg * boost + shadowLift * 0.95);
        const cb = Math.min(255, db * boost + shadowLift * 1.15); // slight cool/blue push

        // Higher alpha floor so shadow glyphs don't disappear against
        // a transparent/dark page background.
        const alpha = clamp(0.55 + brightness * 0.45, 0.45, 1);

        particles.push({
          targetX: x,
          targetY: y,
          x: x + (Math.random() - 0.5) * 200,
          y: y + (Math.random() - 0.5) * 260,
          vx: 0,
          vy: 0,
          character,
          color: `${Math.round(cr)},${Math.round(cg)},${Math.round(cb)}`,
          alpha,
          currentAlpha: 0,
          delay: Math.random() * 0.35,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }
    return particles;
  };

  /* -------------------- load image -------------------- */
  useEffect(() => {
    const { width, height } = getSize(viewportWidth);
    const key = `${IMAGE_SRC}-${width}-${height}`;
    setReady(false);

    const seed = (particles) =>
      particles.map((p) => ({
        ...p,
        x: p.targetX + (Math.random() - 0.5) * 200,
        y: p.targetY + (Math.random() - 0.5) * 260,
        vx: 0,
        vy: 0,
        currentAlpha: 0,
        delay: Math.random() * 0.35,
      }));

    if (cache.has(key)) {
      particlesRef.current = seed(cache.get(key));
      startTimeRef.current = performance.now();
      setReady(true);
      return;
    }

    const image = new Image();
    image.decoding = "async";
    image.onload = () => {
      const particles = convertImage(image, width, height);
      cache.set(key, particles);
      particlesRef.current = seed(particles);
      startTimeRef.current = performance.now();
      setReady(true);
    };
    image.onerror = () => {
      console.error("Unable to load:", IMAGE_SRC);
      setReady(false);
    };
    image.src = IMAGE_SRC;
  }, [viewportWidth]);

  /* -------------------- canvas + animation -------------------- */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = getSize(viewportWidth);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = false;

    let frameId;

    const render = () => {
      frameId = requestAnimationFrame(render);

      // Transparent backdrop — no solid fill, so the page background
      // shows through around and between the glyphs.
      ctx.clearRect(0, 0, width, height);

      if (!ready || !particlesRef.current.length) return;

      const elapsed = (performance.now() - startTimeRef.current) / 1000;
      const particles = particlesRef.current;

      const mouse = mouseRef.current;
      const target = mouseTargetRef.current;
      // Smoother follow: slightly slower lerp so the brush glides
      // instead of snapping to the raw cursor position.
      mouse.x += (target.x - mouse.x) * 0.09;
      mouse.y += (target.y - mouse.y) * 0.09;

      ctx.font = "6px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const age = elapsed - p.delay;
        if (age < 0) continue;

        const progress = Math.min(age / 2.0, 1);
        const ease = 1 - Math.pow(1 - progress, 3);

        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const radius = 260; // even bigger brush area
          if (dist > 0 && dist < radius) {
            // Smooth (quadratic) falloff instead of linear — glyphs
            // near the center push more, edges taper off gently
            // instead of cutting off sharply.
            const t = 1 - dist / radius;
            const force = t * t * 0.95;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }

        const dx = p.targetX - p.x;
        const dy = p.targetY - p.y;
        const spring = 0.008 + ease * 0.06;
        p.vx += dx * spring;
        p.vy += dy * spring;

        p.vx += Math.sin(elapsed * 0.5 + p.phase) * 0.006;
        p.vy += Math.cos(elapsed * 0.45 + p.phase) * 0.006;

        p.vx *= 0.92;
        p.vy *= 0.92;
        p.x += p.vx;
        p.y += p.vy;

        const fade = Math.min(age / 1.1, 1);
        const fadeEase = 1 - Math.pow(1 - fade, 2);
        p.currentAlpha = Math.max(0, p.alpha * fadeEase);

        ctx.fillStyle = `rgba(${p.color},${p.currentAlpha})`;
        ctx.fillText(p.character, p.x, p.y);
      }
    };

    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseTargetRef.current.x = e.clientX - rect.left;
      mouseTargetRef.current.y = e.clientY - rect.top;
      mouseRef.current.active = true;
    };
    const onMouseLeave = () => {
      mouseRef.current.active = false;
      mouseTargetRef.current.x = -9999;
      mouseTargetRef.current.y = -9999;
    };
    const onTouchMove = (e) => {
      if (!e.touches.length) return;
      const rect = canvas.getBoundingClientRect();
      const t = e.touches[0];
      mouseTargetRef.current.x = t.clientX - rect.left;
      mouseTargetRef.current.y = t.clientY - rect.top;
      mouseRef.current.active = true;
      if (e.cancelable) e.preventDefault();
    };

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    canvas.addEventListener("touchend", onMouseLeave);

    render();

    return () => {
      cancelAnimationFrame(frameId);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onMouseLeave);
    };
  }, [viewportWidth, ready]);

  const { width, height } = getSize(viewportWidth);

  return (
    <canvas
      ref={canvasRef}
      className="simulation-container"
      width={width}
      height={height}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        display: "block",
        cursor: "crosshair",
        touchAction: "none",
        background: "transparent",
      }}
      aria-label="Animated ASCII portrait of Swarup Kar Chaudhuri"
    />
  );
};

export default AsciiPortrait;