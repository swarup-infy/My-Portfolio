import React from "react";
import "../styles/Contact.css";
import FadeInSection from "./FadeInSection";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import PhoneIcon from "@mui/icons-material/Phone";
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
          Interested in backend engineering, distributed systems,
          platform architecture, AI-powered systems, or leadership
          opportunities? Feel free to reach out.
        </p>

        <div className="contact-links">
          <a
            href="mailto:hi.ashimroy@gmail.com"
            aria-label="Email"
          >
            <EmailRoundedIcon /> Email → hi.ashimroy@gmail.com
          </a>

          <a
            href="tel:+917738766478"
            aria-label="Phone"
          >
            <PhoneIcon /> Phone → +91 77387 66478
          </a>

          <a
            href="https://www.linkedin.com/in/ashim-roy/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <LinkedInIcon /> LinkedIn → linkedin.com/in/ashim-roy
          </a>

          <a
            href="https://github.com/ashim-roy"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <GitHubIcon /> GitHub → github.com/ashim-roy
          </a>
        </div>

        <a
          href="mailto:hi.ashimroy@gmail.com"
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