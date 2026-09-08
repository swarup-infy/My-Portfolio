import React from "react";
import "../styles/Projects.css";
import FolderOpenRoundedIcon from "@mui/icons-material/FolderOpenRounded";
import FadeInSection from "./FadeInSection";
import { Carousel } from "react-bootstrap";
import ExternalLinks from "./ExternalLinks";

const spotlightProjects = {
  "Enterprise AI Platform": {
    title: "enterprise ai platform",
    desc: "Production-oriented AI workspace for securely managing documents, searching knowledge, and interacting with document-aware AI. Combines a React frontend with a FastAPI backend, PostgreSQL, semantic search, RAG-based conversations, authentication, and modular AI services.",
    techStack:
      "Python, FastAPI, React, PostgreSQL, SQLAlchemy, RAG, Embeddings, Vector Search",
    link: "https://github.com/swarup-infy/enterprise-ai-platform",
    image: "/assets/E-Commerce.png",
  },

  "AI Document Assistant": {
    title: "ai document assistant",
    desc: "Backend-focused document intelligence platform for authenticated document upload, PDF text extraction, document management, semantic search, and an extensible RAG and LLM pipeline.",
    techStack:
      "Python, FastAPI, PostgreSQL, SQLAlchemy, PyMuPDF, ChromaDB, Embeddings, RAG",
    link: "https://github.com/swarup-infy/AI-DOC-Assistant",
    open: "https://ai-doc-assistant-nu.vercel.app/login",
    image: "/assets/Logging-Monitoring.png",
  },

  "Modelling And Simulation of UPQC For Power Quality Improvement": {
    title: "modelling and simulation of UPQC for power quality improvement",
    desc: "Designed and simulated a Unified Power Quality Conditioner (UPQC) in MATLAB/Simulink to mitigate voltage and current disturbances in electrical distribution systems. The study evaluates voltage sag, swell, harmonics, power factor, and THD using coordinated series and shunt compensation.",
    techStack:
      "MATLAB/Simulink, Power Electronics, UPQC, VSI, PWM, PI Control, p-q Theory, THD Analysis",
    open: "/upqc-report.pdf",
    image: "/assets/upqc.png",
  },
};

const projects = {
  "Enterprise AI Platform": {
    desc: "A modular AI workspace combining document management, semantic search, RAG conversations, authentication, PostgreSQL persistence, and a modern React + FastAPI architecture.",
    techStack:
      "Python, FastAPI, React, PostgreSQL, RAG, Embeddings",
    link: "https://github.com/swarup-infy/enterprise-ai-platform",
  },

  "AI Document Assistant": {
    desc: "Document intelligence platform focused on authenticated document upload, PDF processing, text extraction, database persistence, semantic search, and AI-powered document interaction.",
    techStack:
      "Python, FastAPI, PostgreSQL, SQLAlchemy, PyMuPDF",
    link: "https://github.com/swarup-infy/AI-DOC-Assistant",
    open: "https://ai-doc-assistant-nu.vercel.app/login",
  },

  "Modelling And Simulation of UPQC For Power Quality Improvement": {
    desc: "MATLAB/Simulink-based modelling and simulation of a Unified Power Quality Conditioner for improving power quality by compensating voltage disturbances, current harmonics, reactive power, and load-side distortions.",
    techStack:
      "MATLAB/Simulink, UPQC, Power Electronics, PWM, PI Control, p-q Theory, THD",
    open: "/upqc-report.pdf",
  },
};

const Projects = () => {
  return (
    <div id="projects">
      <div className="section-header">
        <span className="section-title">/ projects</span>

        <a
          href="https://github.com/swarup-infy"
          className="explore-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          View all projects
        </a>
      </div>

      <div className="spotlight-projects-desktop">
        <Carousel interval={null}>
          {Object.keys(spotlightProjects).map((key, i) => (
            <Carousel.Item key={i}>
              <img
                className="d-block w-100"
                src={spotlightProjects[key].image}
                alt={key}
              />

              <Carousel.Caption>
                <h3>{spotlightProjects[key].title}</h3>

                <div>
                  {spotlightProjects[key].desc}

                  <div className="techStack">
                    {spotlightProjects[key].techStack}
                  </div>
                </div>

                <ExternalLinks
                  githubLink={spotlightProjects[key].link}
                  openLink={spotlightProjects[key].open}
                />
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>

      <div className="spotlight-projects-mobile">
        {Object.keys(spotlightProjects).map((key, i) => (
          <FadeInSection
            key={i}
            delay={(i + 1) * 100 + "ms"}
          >
            <div className="projects-card">
              <div className="card-header">
                <div className="folder-icon">
                  <FolderOpenRoundedIcon sx={{ fontSize: 35 }} />
                </div>

                <ExternalLinks
                  githubLink={spotlightProjects[key].link}
                  openLink={spotlightProjects[key].open}
                />
              </div>

              <a
                href={
                  spotlightProjects[key].open ||
                  spotlightProjects[key].link ||
                  "#"
                }
                target="_blank"
                rel="noopener noreferrer"
                className="project-card-link"
              >
                <div className="card-title">
                  {spotlightProjects[key].title}
                </div>

                <div className="spotlight-mobile-image">
                  <img
                    src={spotlightProjects[key].image}
                    alt={key}
                  />
                </div>
              </a>

              <div className="card-desc">
                {spotlightProjects[key].desc}
              </div>

              <div className="card-tech">
                {spotlightProjects[key].techStack}
              </div>
            </div>
          </FadeInSection>
        ))}
      </div>

      <div className="project-container">
        <ul className="projects-grid">
          {Object.keys(projects).map((key, i) => (
            <FadeInSection
              key={i}
              delay={(i + 1) * 100 + "ms"}
            >
              <li className="projects-card">
                <div className="card-header">
                  <div className="folder-icon">
                    <FolderOpenRoundedIcon sx={{ fontSize: 35 }} />
                  </div>

                  <ExternalLinks
                    githubLink={projects[key].link}
                    openLink={projects[key].open}
                  />
                </div>

                <div className="card-title">{key}</div>

                <div className="card-desc">
                  {projects[key].desc}
                </div>

                <div className="card-tech">
                  {projects[key].techStack}
                </div>
              </li>
            </FadeInSection>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Projects;