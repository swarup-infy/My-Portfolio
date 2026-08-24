import React from "react";
import "../styles/Intro.css";
import { TypeAnimation } from "react-type-animation";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import FadeInSection from "./FadeInSection";
import AsciiPortrait from "./AsciiPortrait";

const Intro = () => {
  return (
    <div id="intro">
      <div className="intro-simulation">
        <AsciiPortrait />
      </div>

      <div className="intro-block">
        <div className="intro-title">
          {"hi, "}
          <span className="intro-name">
            <TypeAnimation
              sequence={["Swarup"]}
              wrapper="span"
              cursor={false}
              repeat={0}
            />
          </span>
          {" here."}
          <span className="intro-cursor">|</span>
        </div>

        <FadeInSection>
          <div className="intro-role">
            Backend Developer | Python & Java | AI/ML Enthusiast
          </div>

          <div className="intro-desc">
            Building practical web applications and backend systems using
            Python, Java, FastAPI, React, and PostgreSQL.
            <br />
            <br />
            Currently exploring Machine Learning, NLP, LLMs, Gen AI RAG,
            vector databases, and AI-powered applications.
            <br />
            <br />
            Passionate about learning through real-world projects and
            building reliable, useful software.
          </div>

          <a
            href="mailto:officially.swarup@gmail.com"
            className="intro-contact"
          >
            <EmailRoundedIcon />
            {" Say hiii!"}
          </a>
        </FadeInSection>
      </div>
    </div>
  );
};

export default Intro;