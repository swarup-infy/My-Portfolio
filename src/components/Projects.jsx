import React from "react";
import "../styles/Projects.css";
import FolderOpenRoundedIcon from "@mui/icons-material/FolderOpenRounded";
import FadeInSection from "./FadeInSection";
import { Carousel } from "react-bootstrap";
import ExternalLinks from "./ExternalLinks";

const spotlightProjects = {
  "Journal Management Platform": {
    title: "journal management platform",
    desc: "Secure backend journaling application built using Spring Boot and MongoDB. Implemented authentication, authorization, role-based access control, transaction management, and user-specific journal ownership with a layered architecture.",
    techStack:
      "Java, Spring Boot, Spring Security, MongoDB, REST APIs",
    link: "https://github.com/ashim-roy/JournalApp",
    image: "/assets/journalApp.png",
  },

  "E-Commerce Platform": {
    title: "microservices architecture",
    desc: "Production-style e-commerce application implementing user authentication, product catalogs, shopping carts, order management, and RESTful APIs. Designed using scalable backend architecture with caching, database integration, and real-world deployment practices.",
    techStack:
      "Java, Spring Boot, MySQL, Redis, REST APIs",
    link: "https://github.com/ashim-roy/ProductServiceSpring",
    image: "/assets/E-Commerce.png",
  },

  "Distributed Logging & Monitoring Platform": {
    title: "distributed logging & monitoring",
    desc: "Centralized observability platform for microservices enabling log aggregation, service health monitoring, distributed tracing, alerting, and operational visibility across distributed systems.",
    techStack:
      "Java, Spring Boot, Kafka, Elasticsearch, Kibana, OpenTelemetry",
    link: "https://github.com/ashim-roy/Distributed-Logging-Monitoring-Platform",
    image: "/assets/Logging-Monitoring.png",
  },

  "Quarkus Clean Architecture API": {
    title: "quarkus clean architecture api",
    desc: "RESTful API built using Quarkus, Panache, and Uni following Clean Architecture principles. Optimized for low startup times and containerized deployments.",
    techStack:
      "Java, Quarkus, Panache, REST APIs",
    link: "https://github.com/ashim-roy/Quarkus-CleanArch-Uni",
    image: "/assets/quarkus.png",
  },
};

const projects = {

  "Distributed Logging & Monitoring System": {
    desc: "Centralized observability platform for microservices enabling log aggregation, monitoring, alerting, and operational visibility across distributed systems.",
    techStack: "Java, Kafka, Elasticsearch, Kibana",
    link: "https://github.com/ashim-roy/Distributed-Logging-Monitoring-Platform",
  },

  "Spotify Analytics System": {
    desc: "Large-scale music analytics platform capable of tracking top songs and albums globally using Kafka, ETL pipelines, distributed processing, and scalable storage systems.",
    techStack: "Kafka, HDFS, ETL, Distributed Systems",
    link: "https://github.com/ashim-roy/Spotify-Analytics-System",
  },

    "Algorithmic Trading Platform": {
    desc: "Event-driven algorithmic trading platform supporting strategy execution, backtesting, market data ingestion, portfolio analytics, and risk management workflows.",
    techStack: "Python, Kafka, Redis, PostgreSQL",
    link: "https://github.com/ashim-roy/Algorithmic-Trading-Platform",
  },
};

const Projects = () => {
  return (
    <div id="projects">
      <div className="section-header ">
        <span className="section-title">/ projects</span>
        <a
          href="https://github.com/ashim-roy"
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
                src={spotlightProjects[key]["image"]}
                alt={key}
              />
              <Carousel.Caption>
                <h3>{spotlightProjects[key]["title"]}</h3>
                <div>
                  {spotlightProjects[key]["desc"]}
                  <div className="techStack">
                    {spotlightProjects[key]["techStack"]}
                  </div>
                </div>
                <ExternalLinks
                  githubLink={spotlightProjects[key]["link"]}
                  openLink={spotlightProjects[key]["open"]}
                />
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>

      <div className="spotlight-projects-mobile">
        {Object.keys(spotlightProjects).map((key, i) => (
          <FadeInSection key={i} delay={(i + 1) * 100 + "ms"}>
            <div className="projects-card">
              <div className="card-header">
                <div className="folder-icon">
                  <FolderOpenRoundedIcon sx={{ fontSize: 35 }} />
                </div>
                <ExternalLinks
                  githubLink={spotlightProjects[key]["link"]}
                  openLink={spotlightProjects[key]["open"]}
                />
              </div>

              <a
                href={
                  spotlightProjects[key]["open"] ||
                  spotlightProjects[key]["link"]
                }
                target="_blank"
                rel="noopener noreferrer"
                className="project-card-link"
              >
                <div className="card-title">
                  {spotlightProjects[key]["title"]}
                </div>
                <div className="spotlight-mobile-image">
                  <img src={spotlightProjects[key]["image"]} alt={key} />
                </div>
              </a>
              <div className="card-desc">{spotlightProjects[key]["desc"]}</div>
              <div className="card-tech">{spotlightProjects[key]["techStack"]}</div>
            </div>
          </FadeInSection>
        ))}
      </div>
      <div className="project-container">
        <ul className="projects-grid">
          {Object.keys(projects).map((key, i) => (
            <FadeInSection key={i} delay={(i + 1) * 100 + "ms"}>
              <li className="projects-card">
                <div className="card-header">
                  <div className="folder-icon">
                    <FolderOpenRoundedIcon sx={{ fontSize: 35 }} />
                  </div>
                  <ExternalLinks
                    githubLink={projects[key]["link"]}
                    openLink={projects[key]["open"]}
                  />
                </div>

                <div className="card-title">{key}</div>
                <div className="card-desc">{projects[key]["desc"]}</div>
                <div className="card-tech">{projects[key]["techStack"]}</div>
              </li>
            </FadeInSection>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Projects;
