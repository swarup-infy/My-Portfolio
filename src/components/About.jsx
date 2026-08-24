import React from "react";
import "../styles/About.css";
import FadeInSection from "./FadeInSection";
import profileSwarup from "../assets/profile-swarup.webp";

const About = () => {
  const one = (
    <p>
      I am a <b>B.Tech Electrical Engineering graduate</b> from{" "}
      <b>North Eastern Regional Institute of Science and Technology</b>.
      Although my academic background is in Electrical Engineering, I have
      developed a strong interest in software development, backend engineering,
      web technologies, and artificial intelligence. I enjoy building practical
      applications and continuously improving my programming and problem-solving
      skills.
    </p>
  );

  const two = (
    <p>
      I enjoy learning by building real-world projects and exploring how
      software and AI can be used to solve practical problems. My recent work
      includes an Enterprise AI Platform and an AI Document Assistant involving
      backend APIs, authentication, PostgreSQL, document processing, semantic
      search, embeddings, RAG, and LLM-based applications. I am currently
      focused on growing as a backend developer while exploring Machine
      Learning, NLP, LLMs, AI agents, and modern AI application development.
    </p>
  );

  const techStack = [
    "Python",
    "Java",
    "FastAPI",
    "React",
    "REST APIs",
    "PostgreSQL",
    "SQLAlchemy",
    "Git & GitHub",
    "Docker",
    "Vercel",
  ];

  const currentlyExploring = [
    "Machine Learning",
    "NLP",
    "LLMs",
    "RAG Systems",
    "Vector Databases",
    "AI Agents",
    "AI Application Development",
  ];

  return (
    <div id="about">
      <FadeInSection>
        <div className="section-header">
          <span className="section-title">/ about me</span>
        </div>

        <div className="about-content">
          <div className="about-description">
            {one}

            {"Core technologies and tools I work with:"}

            <ul className="tech-stack">
              {techStack.map((techItem, i) => (
                <FadeInSection
                  key={techItem}
                  delay={(i + 1) * 100 + "ms"}
                >
                  <li>{techItem}</li>
                </FadeInSection>
              ))}
            </ul>

            <div className="currently-exploring">
              <h3>Currently Exploring</h3>

              <ul className="tech-list">
                {currentlyExploring.map((item, i) => (
                  <FadeInSection
                    key={item}
                    delay={(i + 1) * 100 + "ms"}
                  >
                    <li>{item}</li>
                  </FadeInSection>
                ))}
              </ul>
            </div>

            {two}
          </div>

          <div className="about-image">
            <img
              src={profileSwarup}
              alt="Swarup Kar Chaudhuri"
            />
          </div>
        </div>
      </FadeInSection>
    </div>
  );
};

export default About;