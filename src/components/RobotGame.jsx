import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
} from "react";
import "../styles/RobotGame.css";

const GRAVITY = 0.32;
const JUMP_FORCE = -7.8;
const MAX_SPEED = 3.2;
const ACCELERATION = 0.35;
const FRICTION = 0.82;

const PLATFORM_HEIGHT = 10;

const ROBOT_WIDTH = 64;
const ROBOT_HEIGHT = 72;

const CELL_COUNT = 5;
const LEVEL_HEIGHT = 5200;

const ROBOT_VISUAL_OFFSET_Y = 22;

const RobotGame = ({ active }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  const robotRef = useRef(null);
  const platformsRef = useRef([]);
  const cellsRef = useRef([]);

  const keysRef = useRef(new Set());
  const jumpLatchRef = useRef(false);

  const cameraYRef = useRef(0);

  const [gameStatus, setGameStatus] = useState("playing");
  const [cellsCollected, setCellsCollected] = useState(0);
  const [restartKey, setRestartKey] = useState(0);

  const targetCellIndexRef = useRef(0);
  const fireworksRef = useRef([]);
  const fireworksStartedRef = useRef(false);
  const fireworkTimersRef = useRef([]);

  const restart = useCallback(() => {
    setRestartKey((value) => value + 1);
  }, []);

  useEffect(() => {
    if (!active) {
      cancelAnimationFrame(animationRef.current);
      return undefined;
    }

    const canvas = canvasRef.current;

    if (!canvas) {
      return undefined;
    }

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return undefined;
    }

    /*
     * ---------------------------------------------------------
     * CANVAS
     * ---------------------------------------------------------
     */

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.imageSmoothingEnabled = false;

    cameraYRef.current = 0;

    setGameStatus("playing");
    setCellsCollected(0);
    targetCellIndexRef.current = 0;
    fireworksStartedRef.current = false;
    fireworksRef.current = [];

    fireworkTimersRef.current.forEach(
      (timer) => window.clearTimeout(timer)
    );
    fireworkTimersRef.current = [];

    /*
     * ---------------------------------------------------------
     * PLATFORM GENERATION
     * ---------------------------------------------------------
     *
     * Platforms are distributed across the COMPLETE screen.
     * They are not restricted to the left side.
     */

    const generatePlatforms = () => {
      const width = canvas.width;

      const platforms = [];

      const margin = Math.min(
        70,
        width * 0.08
      );

      const minX = margin;
      const maxX = Math.max(
        margin + 120,
        width - margin - 150
      );

      /*
       * Start platform.
       */

      platforms.push({
        x: width / 2 - 70,
        y: 250,
        width: 140,
        height: PLATFORM_HEIGHT,
      });

      /*
       * Create platforms through the whole level.
       */

      const totalPlatforms = 55;

      let previousX =
        width / 2 - 70;

      for (let i = 1; i < totalPlatforms; i++) {
        const y = 250 + i * 92;

        /*
         * Alternate across the screen.
         */

        let direction =
          i % 2 === 0 ? 1 : -1;

        let nextX =
          previousX +
          direction *
            (120 + Math.random() * 170);

        /*
         * Keep platform inside viewport.
         */

        if (nextX < minX) {
          nextX =
            minX +
            Math.random() * 100;
        }

        if (nextX > maxX) {
          nextX =
            maxX -
            Math.random() * 100;
        }

        /*
         * Occasionally move to a random
         * part of the screen so the level
         * does not look repetitive.
         */

        if (i % 5 === 0) {
          nextX =
            minX +
            Math.random() *
              (maxX - minX);
        }

        const platformWidth =
          110 +
          Math.random() * 70;

        platforms.push({
          x: nextX,
          y,
          width: platformWidth,
          height: PLATFORM_HEIGHT,
        });

        previousX = nextX;
      }

      return platforms;
    };

    platformsRef.current =
      generatePlatforms();

    /*
     * ---------------------------------------------------------
     * BRAIN CELLS
     * ---------------------------------------------------------
     *
     * One cell after every group of platforms.
     */

    const cellPlatformIndexes = [
      8,
      18,
      28,
      40,
      52,
    ];

    cellsRef.current =
      cellPlatformIndexes.map(
        (platformIndex, index) => {
          const platform =
            platformsRef.current[
              platformIndex
            ];

          return {
            id: index + 1,

            x:
              platform.x +
              platform.width / 2 -
              10,

            y:
              platform.y - 38,

            collected: false,
          };
        }
      );

    /*
     * ---------------------------------------------------------
     * ROBOT
     * ---------------------------------------------------------
     */

    const spawn =
      platformsRef.current[0];

    robotRef.current = {
      x:
        spawn.x +
        spawn.width / 2 -
        ROBOT_WIDTH / 2,

      y:
        spawn.y -
        ROBOT_HEIGHT,

      vx: 0,
      vy: 0,

      onGround: true,

      direction: "right",

      status: "playing",
      lastLandedPlatformIndex: 0,
    };

    /*
     * ---------------------------------------------------------
     * PLATFORM DRAW
     * ---------------------------------------------------------
     */

    const drawPlatform = (
      platform,
      screenY
    ) => {
      if (
        screenY < -30 ||
        screenY >
          canvas.height + 30
      ) {
        return;
      }

      ctx.save();

      /*
       * Shadow
       */

      ctx.fillStyle =
        "rgba(0, 0, 0, 0.28)";

      ctx.fillRect(
        platform.x + 3,
        screenY + PLATFORM_HEIGHT,
        platform.width - 3,
        4
      );

      /*
       * Main platform
       */

      ctx.fillStyle = "#112240";

      ctx.fillRect(
        platform.x,
        screenY,
        platform.width,
        PLATFORM_HEIGHT
      );

      /*
       * Green top edge
       */

      ctx.fillStyle =
        "rgba(100, 255, 218, 0.75)";

      ctx.fillRect(
        platform.x,
        screenY,
        platform.width,
        2
      );

      /*
       * Pixel details
       */

      ctx.fillStyle =
        "rgba(100, 255, 218, 0.12)";

      for (
        let x =
          platform.x + 10;
        x <
        platform.x +
          platform.width -
          8;
        x += 20
      ) {
        ctx.fillRect(
          x,
          screenY + 4,
          3,
          2
        );
      }

      ctx.restore();
    };

    /*
     * ---------------------------------------------------------
     * BRAIN CELL DRAW
     * ---------------------------------------------------------
     */

    const drawCell = (
      cell,
      screenY,
      activeCell
    ) => {
      if (
        screenY < -60 ||
        screenY >
          canvas.height + 60
      ) {
        return;
      }

      const cx = cell.x + 10;
      const cy = screenY + 10;

      const pulse =
        1 +
        Math.sin(
          performance.now() * 0.006 +
            cell.id
        ) *
          0.12;

      ctx.save();

      ctx.globalAlpha =
        activeCell ? 1 : 0.2;

      /*
       * Glow
       */

      if (activeCell) {
        ctx.fillStyle =
          "rgba(100, 255, 218, 0.15)";

        ctx.beginPath();

        ctx.arc(
          cx,
          cy,
          28 * pulse,
          0,
          Math.PI * 2
        );

        ctx.fill();
      }

      /*
       * Brain
       */

      ctx.fillStyle = activeCell
        ? "#bf9fd4"
        : "#8892b0";

      ctx.beginPath();

      ctx.arc(
        cx,
        cy,
        10,
        0,
        Math.PI * 2
      );

      ctx.fill();

      /*
       * Highlight
       */

      ctx.fillStyle = "#edddf8";

      ctx.fillRect(
        cx - 5,
        cy - 5,
        3,
        3
      );

      ctx.fillRect(
        cx + 2,
        cy - 2,
        3,
        3
      );

      /*
       * Brain detail
       */

      ctx.fillStyle = "#0a192f";

      ctx.fillRect(
        cx - 3,
        cy + 3,
        6,
        2
      );

      /*
       * Target ring
       */

      if (activeCell) {
        ctx.strokeStyle =
          "rgba(100, 255, 218, 0.65)";

        ctx.lineWidth = 1;

        ctx.beginPath();

        ctx.arc(
          cx,
          cy,
          16 * pulse,
          0,
          Math.PI * 2
        );

        ctx.stroke();
      }

      ctx.restore();
    };

    /*
     * ---------------------------------------------------------
     * FIREWORKS
     * ---------------------------------------------------------
     */

    const createFireworkBurst = () => {
      const centerX =
        80 +
        Math.random() *
          Math.max(1, canvas.width - 160);

      const centerY =
        70 +
        Math.random() *
          Math.max(1, canvas.height * 0.58);

      const hue =
        160 +
        Math.random() * 120;

      const particles = [];

      for (let i = 0; i < 46; i += 1) {
        const angle =
          (Math.PI * 2 * i) / 46 +
          Math.random() * 0.12;

        const speed =
          1.8 +
          Math.random() * 3.8;

        particles.push({
          x: centerX,
          y: centerY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          decay:
            0.012 +
            Math.random() * 0.014,
          size:
            1.5 +
            Math.random() * 2.2,
        });
      }

      fireworksRef.current.push({
        particles,
        hue,
      });
    };

    const drawFireworks = () => {
      if (!fireworksStartedRef.current) {
        fireworksStartedRef.current = true;

        for (let i = 0; i < 10; i += 1) {
          const timer = window.setTimeout(
            createFireworkBurst,
            i * 180
          );

          fireworkTimersRef.current.push(
            timer
          );
        }
      }

      ctx.save();

      ctx.fillStyle =
        "rgba(2, 12, 27, 0.12)";

      ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      fireworksRef.current =
        fireworksRef.current.filter(
          (burst) => {
            burst.particles =
              burst.particles.filter(
                (particle) => {
                  particle.x +=
                    particle.vx;

                  particle.y +=
                    particle.vy;

                  particle.vy +=
                    0.045;

                  particle.vx *=
                    0.992;

                  particle.life -=
                    particle.decay;

                  if (
                    particle.life <= 0
                  ) {
                    return false;
                  }

                  ctx.beginPath();

                  ctx.globalAlpha =
                    Math.max(
                      0,
                      particle.life
                    );

                  ctx.fillStyle =
                    `hsla(${burst.hue}, 95%, 72%, ${particle.life})`;

                  ctx.arc(
                    particle.x,
                    particle.y,
                    particle.size,
                    0,
                    Math.PI * 2
                  );

                  ctx.fill();

                  return true;
                }
              );

            return (
              burst.particles.length >
              0
            );
          }
        );

      ctx.restore();
    };

    /*
     * ---------------------------------------------------------
     * KEYBOARD
     * ---------------------------------------------------------
     */

    const handleKeyDown = (event) => {
      if (
        [
          "Space",
          "ArrowUp",
          "ArrowLeft",
          "ArrowRight",
          "KeyA",
          "KeyD",
          "KeyW",
        ].includes(event.code)
      ) {
        event.preventDefault();
      }

      if (
        gameStatus === "dead" &&
        event.code === "Space"
      ) {
        restart();
        return;
      }

      keysRef.current.add(
        event.code
      );
    };

    const handleKeyUp = (event) => {
      keysRef.current.delete(
        event.code
      );
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    window.addEventListener(
      "keyup",
      handleKeyUp
    );

    /*
     * ---------------------------------------------------------
     * COLLISION
     * ---------------------------------------------------------
     */

    const checkPlatformCollision = (
      robot
    ) => {
      const previousBottom =
        robot.y +
        ROBOT_HEIGHT -
        robot.vy;

      const currentBottom =
        robot.y +
        ROBOT_HEIGHT;

      for (
        let platformIndex = 0;
        platformIndex <
        platformsRef.current.length;
        platformIndex += 1
      ) {
        const platform =
          platformsRef.current[
            platformIndex
          ];

        const horizontal =
          robot.x +
            ROBOT_WIDTH -
            10 >
            platform.x &&
          robot.x + 10 <
            platform.x +
              platform.width;

        const vertical =
          previousBottom <=
            platform.y + 6 &&
          currentBottom >=
            platform.y &&
          robot.vy >= 0;

        if (
          horizontal &&
          vertical
        ) {
          robot.y =
            platform.y -
            ROBOT_HEIGHT;

          robot.vy = 0;

          robot.onGround = true;

          robot.lastLandedPlatformIndex =
            platformIndex;

          return platformIndex;
        }
      }

      return -1;
    };

    /*
     * ---------------------------------------------------------
     * GAME LOOP
     * ---------------------------------------------------------
     */

    const loop = () => {
      const robot =
        robotRef.current;

      if (!robot) {
        return;
      }

      if (
        robot.status === "won"
      ) {
        ctx.clearRect(
          0,
          0,
          canvas.width,
          canvas.height
        );

        drawFireworks();

        animationRef.current =
          requestAnimationFrame(
            loop
          );

        return;
      }

      if (
        robot.status !==
        "playing"
      ) {
        return;
      }

      /*
       * -------------------------------------------------------
       * INPUT
       * -------------------------------------------------------
       */

      const keys =
        keysRef.current;

      const left =
        keys.has("ArrowLeft") ||
        keys.has("KeyA");

      const right =
        keys.has("ArrowRight") ||
        keys.has("KeyD");

      const jump =
        keys.has("Space") ||
        keys.has("ArrowUp") ||
        keys.has("KeyW");

      /*
       * Direction
       */

      if (left) {
        robot.direction =
          "left";
      }

      if (right) {
        robot.direction =
          "right";
      }

      /*
       * Horizontal movement
       */

      if (left) {
        robot.vx =
          Math.max(
            robot.vx -
              ACCELERATION,
            -MAX_SPEED
          );
      } else if (right) {
        robot.vx =
          Math.min(
            robot.vx +
              ACCELERATION,
            MAX_SPEED
          );
      } else {
        robot.vx *= FRICTION;
      }

      /*
       * Jump
       */

      if (
        jump &&
        robot.onGround &&
        !jumpLatchRef.current
      ) {
        robot.vy =
          JUMP_FORCE;

        robot.onGround = false;

        jumpLatchRef.current =
          true;
      }

      if (!jump) {
        jumpLatchRef.current =
          false;
      }

      /*
       * Physics
       */

      robot.vy =
        Math.min(
          robot.vy + GRAVITY,
          10
        );

      robot.x += robot.vx;

      robot.y += robot.vy;

      /*
       * Screen boundaries
       */

      if (robot.x < 0) {
        robot.x = 0;
        robot.vx = 0;
      }

      if (
        robot.x +
          ROBOT_WIDTH >
        canvas.width
      ) {
        robot.x =
          canvas.width -
          ROBOT_WIDTH;

        robot.vx = 0;
      }

      /*
       * Platform collision
       */

      robot.onGround = false;

      const landedPlatformIndex =
        checkPlatformCollision(
          robot
        );

      /*
       * A checkpoint must be collected in order.
       *
       * Platforms before the current target are allowed.
       * Once the robot passes below the current target
       * platform, the run is lost. This prevents skipping
       * a brain cell and continuing on lower platforms.
       */
      const targetCell =
        cellsRef.current[
          targetCellIndexRef.current
        ];

      const targetPlatformIndex =
        targetCell
          ? cellPlatformIndexes[
              targetCellIndexRef.current
            ]
          : cellPlatformIndexes[
              CELL_COUNT - 1
            ];

      const targetPlatform =
        platformsRef.current[
          targetPlatformIndex
        ];

      if (
        targetPlatform &&
        robot.y >
          targetPlatform.y + 18
      ) {
        robot.status = "dead";
        setGameStatus("dead");
        return;
      }

      if (
        landedPlatformIndex >
          targetPlatformIndex &&
        !targetCell?.collected
      ) {
        robot.status = "dead";
        setGameStatus("dead");
        return;
      }

      /*
       * -------------------------------------------------------
       * CAMERA
       * -------------------------------------------------------
       *
       * Camera follows the robot only
       * when he reaches the upper half.
       */

      const cameraTarget =
        robot.y -
        canvas.height * 0.52;

      if (
        cameraTarget >
        cameraYRef.current
      ) {
        cameraYRef.current +=
          (
            cameraTarget -
            cameraYRef.current
          ) *
          0.08;
      }

      /*
       * Camera can never go backwards
       * and never exceed level.
       */

      cameraYRef.current =
        Math.max(
          0,
          Math.min(
            cameraYRef.current,
            LEVEL_HEIGHT -
              canvas.height
          )
        );

      const cameraY =
        cameraYRef.current;

      /*
       * -------------------------------------------------------
       * DRAW
       * -------------------------------------------------------
       */

      ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      /*
       * Platforms across full screen.
       */

      platformsRef.current.forEach(
        (platform) => {
          drawPlatform(
            platform,
            platform.y -
              cameraY
          );
        }
      );

      /*
       * Current cell only glows.
       */

      const currentCell =
        cellsRef.current.find(
          (cell) =>
            !cell.collected
        );

      cellsRef.current.forEach(
        (cell) => {
          drawCell(
            cell,
            cell.y -
              cameraY,
            currentCell?.id ===
              cell.id
          );
        }
      );

      /*
       * -------------------------------------------------------
       * CELL COLLECTION
       * -------------------------------------------------------
       */

      if (currentCell) {
        const robotCenterX =
          robot.x +
          ROBOT_WIDTH / 2;

        const robotCenterY =
          robot.y +
          ROBOT_HEIGHT / 2;

        const cellCenterX =
          currentCell.x + 10;

        const cellCenterY =
          currentCell.y + 10;

        if (
          Math.abs(
            robotCenterX -
              cellCenterX
          ) < 42 &&
          Math.abs(
            robotCenterY -
              cellCenterY
          ) < 58
        ) {
          currentCell.collected =
            true;

          targetCellIndexRef.current =
            Math.min(
              targetCellIndexRef.current + 1,
              CELL_COUNT
            );

          setCellsCollected(
            (value) =>
              value + 1
          );
        }
      }

      /*
       * -------------------------------------------------------
       * WIN
       * -------------------------------------------------------
       */

      if (
        cellsRef.current.every(
          (cell) =>
            cell.collected
        )
      ) {
        robot.status = "won";

        setGameStatus("won");

        animationRef.current =
          requestAnimationFrame(
            loop
          );

        return;
      }

      /*
       * -------------------------------------------------------
       * DEATH
       * -------------------------------------------------------
       */

      if (
        robot.y >
        cameraY +
          canvas.height +
          200
      ) {
        robot.status =
          "dead";

        setGameStatus(
          "dead"
        );

        return;
      }

      /*
       * -------------------------------------------------------
       * UPDATE HTML GIF
       * -------------------------------------------------------
       */

      const robotElement =
        document.querySelector(
          ".robot-game-character"
        );

      if (robotElement) {
        robotElement.style.left =
          `${Math.round(
            robot.x
          )}px`;

        robotElement.style.top =
          `${Math.round(
            robot.y -
              cameraY +
              ROBOT_VISUAL_OFFSET_Y
          )}px`;

        robotElement.style.transform =
          robot.direction ===
          "left"
            ? "scaleX(-1)"
            : "scaleX(1)";

        robotElement.style.opacity =
          "1";
      }

      animationRef.current =
        requestAnimationFrame(
          loop
        );
    };

    animationRef.current =
      requestAnimationFrame(
        loop
      );

    /*
     * ---------------------------------------------------------
     * RESIZE
     * ---------------------------------------------------------
     */

    const handleResize = () => {
      canvas.width =
        window.innerWidth;

      canvas.height =
        window.innerHeight;

      ctx.imageSmoothingEnabled =
        false;
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    /*
     * ---------------------------------------------------------
     * CLEANUP
     * ---------------------------------------------------------
     */

    return () => {
      cancelAnimationFrame(
        animationRef.current
      );

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );

      window.removeEventListener(
        "keyup",
        handleKeyUp
      );

      window.removeEventListener(
        "resize",
        handleResize
      );

      keysRef.current.clear();

      jumpLatchRef.current =
        false;

      fireworkTimersRef.current.forEach(
        (timer) => window.clearTimeout(timer)
      );

      fireworkTimersRef.current = [];
    };
  }, [
    active,
    restartKey,
    restart,
  ]);

  if (!active) {
    return null;
  }

  return (
    <>
      <canvas
        ref={canvasRef}
        className="robot-game-canvas"
      />

      <img
        src="/assets/robot.gif"
        alt=""
        className="robot-game-character"
        draggable="false"
      />

      {gameStatus ===
        "playing" && (
        <div className="cell-counter">
          <span className="cell-counter-pip" />

          <span className="cell-counter-text">
            {cellsCollected} /{" "}
            {CELL_COUNT}
          </span>
        </div>
      )}

      {gameStatus === "dead" && (
        <div className="robot-game-status robot-game-status--dead">
          <div className="robot-game-status-title">
            you fell
          </div>

          <div className="robot-game-status-sub">
            keep going — the
            next brain cell is
            waiting
          </div>

          <button
            className="robot-game-status-btn"
            onClick={restart}
          >
            try again
          </button>

          <div className="robot-game-status-hint">
            or press space
          </div>
        </div>
      )}

      {gameStatus === "won" && (
        <div className="robot-game-status robot-game-status--won">
          <div className="robot-game-status-title">
            neurons restored
          </div>

          <div className="robot-game-status-sub">
            all {CELL_COUNT}{" "}
            brain cells recovered
          </div>

          <button
            className="robot-game-status-btn"
            onClick={restart}
          >
            play again
          </button>
        </div>
      )}
    </>
  );
};

export default RobotGame;