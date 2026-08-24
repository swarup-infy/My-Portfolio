import React, { useRef, useEffect, useState } from "react";

// Module-level cache to persist between remounts
const memoryCache = {};

const calculateSize = (width) => {
  if (width <= 480) {
    return Math.min(220, width - 40);
  }

  if (width <= 768) {
    return Math.min(280, width - 60);
  }

  return 400;
};

const AsciiPortrait = () => {
  const canvasRef = useRef(null);

  const mouseRef = useRef({
    x: -1000,
    y: -1000,
    active: false,
  });

  const mouseTargetRef = useRef({
    x: -1000,
    y: -1000,
  });

  const particlesRef = useRef([]);
  const startTimeRef = useRef(null);

  const [size, setSize] = useState(() =>
    calculateSize(window.innerWidth)
  );

  const [dataReady, setDataReady] = useState(false);

  // ASCII characters from light to dense
  const chars = " .:-=+*#%@".split("");

  // --------------------------------------------------
  // Handle responsive size
  // --------------------------------------------------
  useEffect(() => {
    const updateSize = () => {
      setSize(calculateSize(window.innerWidth));
    };

    window.addEventListener("resize", updateSize);

    return () => {
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  // --------------------------------------------------
  // Create animated particles
  // --------------------------------------------------
  const createParticlesFromRaw = (rawParticles, isMobileSize) => {
    const fontSize = isMobileSize ? 5 : 7;

    return rawParticles.map((particle) => ({
      x: particle.x + (Math.random() - 0.5) * 400,
      y: particle.y + (Math.random() - 0.5) * 400,

      targetX: particle.x,
      targetY: particle.y,

      vx: 0,
      vy: 0,

      char: particle.char,
      fontSize,

      baseAlpha: particle.alpha,
      currentAlpha: 0,

      delay: Math.random() * 0.4,
      shimmer: Math.random() * Math.PI * 2,
    }));
  };

  // --------------------------------------------------
  // Convert Swarup's image into ASCII particles
  // --------------------------------------------------
  const processImage = (img, targetSize) => {
    const canvasWidth = targetSize;
    const canvasHeight = targetSize;

    const offscreen = document.createElement("canvas");

    offscreen.width = canvasWidth;
    offscreen.height = canvasHeight;

    const offCtx = offscreen.getContext("2d");

    if (!offCtx) {
      return [];
    }

    // Transparent background
    offCtx.clearRect(0, 0, canvasWidth, canvasHeight);

    const scale = 0.8;

    const imgAspect = img.width / img.height;

    let drawHeight = canvasHeight * scale;
    let drawWidth = drawHeight * imgAspect;

    if (drawWidth > canvasWidth * scale) {
      drawWidth = canvasWidth * scale;
      drawHeight = drawWidth / imgAspect;
    }

    const offsetX = (canvasWidth - drawWidth) / 2;
    const offsetY = (canvasHeight - drawHeight) / 2;

    offCtx.drawImage(
      img,
      offsetX,
      offsetY,
      drawWidth,
      drawHeight
    );

    const imageData = offCtx.getImageData(
      0,
      0,
      canvasWidth,
      canvasHeight
    );

    const pixels = imageData.data;

    const rawParticles = [];

    const isMobileSize = targetSize <= 280;

    const fontSize = isMobileSize ? 5 : 7;

    const colGap = fontSize * 0.7;
    const rowGap = fontSize * 1.1;

    for (let y = 0; y < canvasHeight; y += rowGap) {
      for (let x = 0; x < canvasWidth; x += colGap) {
        const pixelX = Math.floor(x);
        const pixelY = Math.floor(y);

        const index =
          (pixelY * canvasWidth + pixelX) * 4;

        const r = pixels[index];
        const g = pixels[index + 1];
        const b = pixels[index + 2];
        const alpha = pixels[index + 3];

        // Ignore transparent pixels
        if (alpha < 80) {
          continue;
        }

        const brightness =
          (r + g + b) / (3 * 255);

        const charIndex = Math.floor(
          brightness * (chars.length - 1)
        );

        rawParticles.push({
          x: Number(x.toFixed(1)),
          y: Number(y.toFixed(1)),
          char: chars[charIndex],
          alpha: Number(
            (0.4 + brightness * 0.6).toFixed(2)
          ),
        });
      }
    }

    return rawParticles;
  };

  // --------------------------------------------------
  // Load Swarup's actual profile image
  // --------------------------------------------------
  useEffect(() => {
    const isMobileSize = size <= 280;

    // Use cached processed image if available
    if (memoryCache[size]) {
      particlesRef.current = createParticlesFromRaw(
        memoryCache[size],
        isMobileSize
      );

      setDataReady(true);

      startTimeRef.current = performance.now();

      return;
    }

    const img = new Image();

    img.onload = () => {
      const rawParticles = processImage(img, size);

      memoryCache[size] = rawParticles;

      particlesRef.current = createParticlesFromRaw(
        rawParticles,
        isMobileSize
      );

      setDataReady(true);

      startTimeRef.current = performance.now();
    };

    img.onerror = () => {
      console.error(
        "Failed to load profile image:",
        "/profile-code-swarup.png"
      );

      setDataReady(false);
    };

    // IMPORTANT:
    // This is your actual uploaded Swarup image.
    img.src = "/profile-code-swarup.png";
  }, [size]);

  // --------------------------------------------------
  // Canvas animation
  // --------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return;
    }

    const dpr = window.devicePixelRatio || 1;

    canvas.width = size * dpr;
    canvas.height = size * dpr;

    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    let animationId;

    const draw = () => {
      animationId = requestAnimationFrame(draw);

      ctx.clearRect(0, 0, size, size);

      if (
        !dataReady ||
        !particlesRef.current.length ||
        !startTimeRef.current
      ) {
        return;
      }

      const particles = particlesRef.current;

      const mouse = mouseRef.current;
      const mouseTarget = mouseTargetRef.current;

      const elapsed =
        (performance.now() - startTimeRef.current) / 1000;

      // Smooth mouse movement
      mouse.x +=
        (mouseTarget.x - mouse.x) * 0.15;

      mouse.y +=
        (mouseTarget.y - mouse.y) * 0.15;

      const isMobileSize = size <= 280;

      const fontSize = isMobileSize ? 5 : 7;

      ctx.font = `${fontSize}px monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      particles.forEach((particle) => {
        const particleTime =
          elapsed - particle.delay;

        if (particleTime < 0) {
          return;
        }

        // Fade-in animation
        const fadeProgress = Math.min(
          particleTime / 1.5,
          1
        );

        const easedFade =
          1 - Math.pow(1 - fadeProgress, 2);

        const isActive =
          mouse.active || particleTime < 3;

        // Subtle shimmer
        const shimmerValue = isActive
          ? Math.sin(
              elapsed * 2 +
                particle.shimmer
            ) * 0.1
          : 0;

        particle.currentAlpha = Math.max(
          0,
          particle.baseAlpha * easedFade +
            shimmerValue
        );

        // Formation animation
        const moveProgress = Math.min(
          particleTime / 2.5,
          1
        );

        const easedMove =
          1 -
          Math.pow(
            1 - moveProgress,
            3
          );

        // Mouse interaction
        if (mouse.active) {
          const dx =
            particle.x - mouse.x;

          const dy =
            particle.y - mouse.y;

          const distance = Math.sqrt(
            dx * dx + dy * dy
          );

          const maxDistance =
            size * 0.2;

          if (
            distance < maxDistance &&
            distance > 0
          ) {
            const force =
              (1 -
                distance /
                  maxDistance) *
              4;

            particle.vx +=
              (dx / distance) * force;

            particle.vy +=
              (dy / distance) * force;
          }
        }

        // Pull particles toward their target
        const dx =
          particle.targetX -
          particle.x;

        const dy =
          particle.targetY -
          particle.y;

        const pullStrength =
          0.01 +
          easedMove * 0.08;

        particle.vx +=
          dx * pullStrength;

        particle.vy +=
          dy * pullStrength;

        if (isActive) {
          const breathX =
            Math.sin(
              elapsed * 0.5 +
                particle.targetY *
                  0.1
            ) * 0.15;

          const breathY =
            Math.cos(
              elapsed * 0.5 +
                particle.targetX *
                  0.1
            ) * 0.15;

          particle.vx += breathX;
          particle.vy += breathY;

          particle.vx *= 0.92;
          particle.vy *= 0.92;
        } else {
          particle.vx *= 0.85;
          particle.vy *= 0.85;

          if (
            particleTime > 4 &&
            Math.abs(dx) < 0.01 &&
            Math.abs(dy) < 0.01
          ) {
            particle.x =
              particle.targetX;

            particle.y =
              particle.targetY;

            particle.vx = 0;
            particle.vy = 0;
          }
        }

        particle.x += particle.vx;
        particle.y += particle.vy;

        ctx.fillStyle = `rgba(
          100,
          255,
          218,
          ${particle.currentAlpha}
        )`;

        ctx.fillText(
          particle.char,
          particle.x,
          particle.y
        );
      });
    };

    // --------------------------------------------------
    // Mouse
    // --------------------------------------------------
    const handleMouseMove = (event) => {
      const rect =
        canvas.getBoundingClientRect();

      mouseTargetRef.current.x =
        event.clientX - rect.left;

      mouseTargetRef.current.y =
        event.clientY - rect.top;

      mouseRef.current.active = true;
    };

    // --------------------------------------------------
    // Touch
    // --------------------------------------------------
    const handleTouchMove = (event) => {
      if (!event.touches.length) {
        return;
      }

      const rect =
        canvas.getBoundingClientRect();

      const touch =
        event.touches[0];

      mouseTargetRef.current.x =
        touch.clientX - rect.left;

      mouseTargetRef.current.y =
        touch.clientY - rect.top;

      mouseRef.current.active = true;

      if (event.cancelable) {
        event.preventDefault();
      }
    };

    // --------------------------------------------------
    // Leave
    // --------------------------------------------------
    const handleLeave = () => {
      mouseRef.current.active = false;

      mouseTargetRef.current.x = -1000;
      mouseTargetRef.current.y = -1000;
    };

    canvas.addEventListener(
      "mousemove",
      handleMouseMove
    );

    canvas.addEventListener(
      "mouseleave",
      handleLeave
    );

    canvas.addEventListener(
      "touchmove",
      handleTouchMove,
      { passive: false }
    );

    canvas.addEventListener(
      "touchend",
      handleLeave
    );

    draw();

    return () => {
      cancelAnimationFrame(animationId);

      canvas.removeEventListener(
        "mousemove",
        handleMouseMove
      );

      canvas.removeEventListener(
        "mouseleave",
        handleLeave
      );

      canvas.removeEventListener(
        "touchmove",
        handleTouchMove
      );

      canvas.removeEventListener(
        "touchend",
        handleLeave
      );
    };
  }, [size, dataReady]);

  return (
    <canvas
      ref={canvasRef}
      className="simulation-container"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        cursor: "crosshair",
        touchAction: "none",
      }}
    />
  );
};

export default AsciiPortrait;