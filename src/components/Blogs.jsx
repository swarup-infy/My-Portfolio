import React from "react";
import "../styles/Blogs.css";
import FadeInSection from "./FadeInSection";

const Blogs = () => {

const blogs = [
  {
    title: "System Design Behind Stripe Webhooks",
    desc: "A deep dive into webhook architecture, event delivery guarantees, retries, idempotency, and scalable integration patterns.",
    link: "https://www.linkedin.com/pulse/system-design-behind-stripe-webhooks-step-ashim-roy-1aoqe/",
  },
  {
    title: "Buzz Words in AI",
    desc: "Breaking down common AI terminology and concepts to help engineers navigate the rapidly evolving AI landscape.",
    link: "https://www.linkedin.com/pulse/buzz-words-air-ashim-roy/",
  },
  {
    title: "Python Pandas",
    desc: "Practical introduction to data analysis and manipulation using Python Pandas, with examples and real-world use cases.",
    link: "https://www.linkedin.com/pulse/pythonpandas-ashim-roy/",
  },
];


  return (
    <div id="blogs">
      <div className="section-header">
        <span className="section-title">/ blogs</span>
        <a
          href="https://www.linkedin.com/in/ashim-roy/recent-activity/articles/"
          target="_blank"
          rel="noopener noreferrer"
          className="explore-link"
        >
          View all articles
        </a>
      </div>
      <FadeInSection delay="200ms">
        <div className="blogs-description">
          Thoughts, architecture notes, and engineering learnings on distributed systems, backend development, system design, and software engineering.
        </div>
      </FadeInSection>
        <div className="blogs-grid">
          {blogs.map((blog, i) => (
            <FadeInSection key={i} delay={(i + 1) * 100 + "ms"}>
             <div className="blogs-card">
              <div className="card-title">{blog.title}</div>

              <div className="card-desc">
                {blog.desc}
              </div>

              <a
                href={blog.link}
                target="_blank"
                rel="noopener noreferrer"
                className="project-badge"
              >
                Read Article
              </a>
            </div>
          </FadeInSection>
        ))}
      </div>
    </div>
  );
};

export default Blogs;
