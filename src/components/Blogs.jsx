import React from "react";
import "../styles/Blogs.css";
import FadeInSection from "./FadeInSection";

const Blogs = () => {
  const blogs = [
    {
      title: "Backend Development",
      desc: "Exploring backend development with Python, Java, REST APIs, databases, authentication, and practical software engineering.",
      link: "https://medium.com/@officially.swarup",
    },
    {
      title: "Artificial Intelligence & Machine Learning",
      desc: "Learning and exploring machine learning, NLP, LLMs, embeddings, and modern AI application development through practical projects.",
      link: "https://medium.com/@officially.swarup",
    },
    {
      title: "RAG & AI Applications",
      desc: "Exploring Retrieval-Augmented Generation, vector databases, semantic search, and building AI-powered applications.",
      link: "https://medium.com/@officially.swarup",
    },
  ];

  return (
    <div id="blogs">
      <div className="section-header">
        <span className="section-title">/ blogs</span>

        <a
          href="https://medium.com/@officially.swarup"
          target="_blank"
          rel="noopener noreferrer"
          className="explore-link"
        >
          Visit my Medium
        </a>
      </div>

      <FadeInSection delay="200ms">
        <div className="blogs-description">
          Writing and learning about backend development, Python, Java,
          artificial intelligence, machine learning, NLP, LLMs, and
          practical software engineering.
        </div>
      </FadeInSection>

      <div className="blogs-grid">
        {blogs.map((blog, i) => (
          <FadeInSection key={i} delay={`${(i + 1) * 100}ms`}>
            <div className="blogs-card">
              <div className="card-title">{blog.title}</div>

              <div className="card-desc">{blog.desc}</div>

              <a
                href={blog.link}
                target="_blank"
                rel="noopener noreferrer"
                className="project-badge"
              >
                Visit Medium
              </a>
            </div>
          </FadeInSection>
        ))}
      </div>
    </div>
  );
};

export default Blogs;