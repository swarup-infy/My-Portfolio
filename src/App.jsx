import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import Intro from "./components/Intro";
import Experience from "./components/Experience";
import About from "./components/About";
import Projects from "./components/Projects";
import Blogs from "./components/Blogs";
import Contact from "./components/Contact";
import Credits from "./components/Credits";
import NavBar from "./components/NavBar";
import SidebarNav from "./components/SidebarNav";
import RobotGame from "./components/RobotGame";

import "./App.css";
import "./styles/Global.css";
import "./styles/RobotGame.css";

function PortfolioPage() {
  return (
    <>
      <Intro />
      <About />
      <Experience />
      <Projects />
      <Blogs />
      <Contact />
      <Credits />
    </>
  );
}

function App() {
  const { pathname } = useLocation();

  const [gameActive, setGameActive] = useState(false);
  const [showGameInfo, setShowGameInfo] = useState(false);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname]);

  const handleGameToggle = () => {
    setGameActive((active) => {
      const nextState = !active;

      if (!nextState) {
        setShowGameInfo(false);
      }

      return nextState;
    });
  };

  return (
    <div className="App">
      <NavBar />

      {/* =====================================================
          GAME MODE CONTROLS
      ===================================================== */}

      <div className="game-toggle-fixed">
        <div className="game-toggle-row">
          <button
            type="button"
            className={`game-toggle-btn${
              gameActive ? " game-toggle-btn--on" : ""
            }`}
            onClick={handleGameToggle}
            title={
              gameActive
                ? "Disable game mode"
                : "Enable game mode"
            }
            aria-label={
              gameActive
                ? "Disable game mode"
                : "Enable game mode"
            }
            aria-pressed={gameActive}
          >
            <span
              className="game-toggle-dot"
              aria-hidden="true"
            />

            game mode
          </button>

          {gameActive && (
            <button
              type="button"
              className="game-info-btn"
              onMouseEnter={() => setShowGameInfo(true)}
              onMouseLeave={() => setShowGameInfo(false)}
              onFocus={() => setShowGameInfo(true)}
              onBlur={() => setShowGameInfo(false)}
              aria-label="How to play"
              aria-expanded={showGameInfo}
            >
              i
            </button>
          )}
        </div>

        {showGameInfo && gameActive && (
          <div className="robot-game-info">
            <div className="robot-game-info-title">
              how to play
            </div>

            <div className="robot-game-info-row">
              <span className="robot-game-key">
                ← →
              </span>
              <span>move</span>
            </div>

            <div className="robot-game-info-row">
              <span className="robot-game-key">
                space
              </span>
              <span>jump</span>
            </div>

            <div className="robot-game-info-row">
              <span className="robot-game-key">
                scroll
              </span>
              <span>explore</span>
            </div>

            <div className="robot-game-info-goal">
              collect your scattered brain cells
            </div>
          </div>
        )}
      </div>

      {/* =====================================================
          NAVIGATION
      ===================================================== */}

      <SidebarNav />

      {/* =====================================================
          ROBOT GAME
      ===================================================== */}

      <RobotGame active={gameActive} />

      {/* =====================================================
          PAGE CONTENT
      ===================================================== */}

      <div id="content">
        <Routes>
          {/* Main portfolio */}
          <Route
            path="/"
            element={<PortfolioPage />}
          />

          {/* Your existing /profile URL */}
          <Route
            path="/profile"
            element={<PortfolioPage />}
          />

          {/* Unknown routes → portfolio */}
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;