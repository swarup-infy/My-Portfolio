import React from "react";
import "../styles/About.css";
import FadeInSection from "./FadeInSection";

const About = () => {
    const one = (
    <p>
      I am a <b>Senior Software Engineer</b> with 10+ years of experience
      designing and building scalable backend platforms, APIs, and distributed
      systems. Currently at <a href="https://www.linkedin.com">LinkedIn</a>, I
      build and operate high-scale backend systems serving millions of
      professionals worldwide, with a focus on reliability, scalability,
      and performance.
    </p>
  );
  const two = (
  <p>
    I enjoy solving complex engineering problems, designing distributed
    architectures, optimizing system performance, and mentoring engineers.
    Outside of work, I actively study system design, backend architecture,
    financial markets, and emerging technologies.
  </p>
);

    const techStack = [
    "Java",
    "Spring Boot",
    "Kafka",
    "AWS",
    "Redis",
    "PostgreSQL",
    "MongoDB",
    "Microservices",
    "Distributed Systems",
    "Docker",
  ];

    const currentlyExploring = [
    "OpenAI & Anthropic APIs",
    "Vector Databases",
    "RAG Systems",
    "AI Agents",
    "LangChain",
    "MCP",
    "Kubernetes",
  ];

  return (
    <div id="about">
      <FadeInSection>
        <div className="section-header ">
          <span className="section-title">/ about me</span>
        </div>
        <div className="about-content">
          <div className="about-description">
            {one}
            {"Core technologies and platforms I work with:"}
            <ul className="tech-stack">
              {techStack.map((techItem, i) => (
                <FadeInSection key={i} delay={(i + 1) * 100 + "ms"}>
                  <li>{techItem}</li>
                </FadeInSection>
              ))}
            </ul>
            <div className="currently-exploring">
              <h3>Currently Exploring</h3>

        <ul className="tech-list">
            {currentlyExploring.map((item, i) => (
              <FadeInSection key={item} delay={(i + 1) * 100 + "ms"}>
                <li>{item}</li>
              </FadeInSection>
            ))}
          </ul>
        </div>
            {two}
          </div>
          <div className="about-image">
            <img alt="Ashim Roy" src={"/assets/profile-ashim.png"} />
          </div>
        </div>
      </FadeInSection>
    </div>
  );
};

export default About;
