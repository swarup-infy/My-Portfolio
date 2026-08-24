import React from "react";
import "../styles/Contact.css";
import FadeInSection from "./FadeInSection";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";

const Contact = () => {
  return (
    <div id="contact">
      <div className="section-header">
        <span className="section-title">/ contact</span>
      </div>

      <FadeInSection delay="200ms">
        <div className="contact-card">
          <h2>Let's Connect</h2>

          <p className="contact-description">
            Interested in backend development, software engineering,
            artificial intelligence, machine learning, or AI-powered
            applications? Feel free to reach out and connect with me.
          </p>

          <div className="contact-links">
            <a
              href="mailto:officially.swarup@gmail.com"
              aria-label="Email"
            >
              <EmailRoundedIcon />
              Email → officially.swarup@gmail.com
            </a>

            <a
              href="https://www.linkedin.com/in/swarup-kar-chaudhuri-4266a7260"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <LinkedInIcon />
              LinkedIn → swarup-kar-chaudhuri
            </a>

            <a
              href="https://github.com/swarup-infy"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <GitHubIcon />
              GitHub → github.com/swarup-infy
            </a>
          </div>

          <a
            href="mailto:officially.swarup@gmail.com"
            className="contact-button"
            aria-label="Email Me"
          >
            Email Me
          </a>
        </div>
      </FadeInSection>
    </div>
  );
};

export default Contact;