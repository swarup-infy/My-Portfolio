import React from "react";
import PropTypes from "prop-types";
import { Tabs, Tab, Typography, Box, useTheme, useMediaQuery } from "@mui/material";
import FadeInSection from "./FadeInSection";

function TabPanel(props) {
  const { children, value, index, isMobile, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={isMobile ? `full-width-tabpanel-${index}` : `vertical-tabpanel-${index}`}
      aria-labelledby={isMobile ? `full-width-tab-${index}` : `vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
  isMobile: PropTypes.bool
};

function a11yProps(index, isMobile) {
  if (isMobile) {
    return {
      id: "full-width-tab-" + index,
      "aria-controls": "full-width-tabpanel-" + index,
    };
  } else {
    return {
      id: "vertical-tab-" + index,
      "aria-controls": "vertical-tabpanel-" + index,
    };
  }
}

const JobList = () => {
  const [value, setValue] = React.useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const experienceItems = {
    LinkedIn: {
      jobTitle: "Senior Software Engineer @",
      duration: "OCT 2024 - PRESENT",
      desc: [
        "Lead onboarding and technical enablement for LinkedIn's Verified on LinkedIn APIs, supporting integrations with enterprise partners including Adobe, Perplexity, G2, and PeerSpot.",
        "Designed and supported scalable OAuth 2.0, OpenID Connect, permissioning, and identity verification workflows for high-scale trust platforms.",
        "Architected a Data Freshness framework enabling partners to validate and refresh verification data efficiently while improving reliability and consistency.",
        "Collaborated with Product, Engineering, Mobile, and Developer Relations teams to improve developer experience, onboarding workflows, platform adoption, and integration success.",
        "Act as the primary technical counterpart for enterprise partners, troubleshooting authentication, onboarding, rate limiting, redirect handling, and production integration challenges.",
        "Contributed to backend Java services, API scalability reviews, and distributed integration workflows, improving platform reliability, scalability, and operational excellence."
      ],
    },
    Nomura: {
      jobTitle: "Lead Backend Developer @",
      duration: "MAY 2017 - SEP 2024",
      desc: [
        "Designed and developed distributed trade-processing systems handling high-volume financial transactions.",
        "Implemented Kafka, IBM MQ, Redis, and Elasticsearch based architectures to improve scalability, resiliency, and operational visibility.",
        "Implemented Redis caching and backend optimization strategies, reducing API response times from 500ms to 50ms and improving overall system throughput by 50%.",
        "Built fault-tolerant replay, retry, and recovery workflows for mission-critical financial systems, improving reliability and operational resilience.",
        "Led backend modernization initiatives focused on scalability, resiliency, asynchronous processing, and operational excellence across trade processing platforms.",
        "Led a team of 5 engineers, providing mentorship, code reviews, technical leadership, and architectural guidance across multiple backend initiatives."
      ],
    },
    Cognizant: {
      jobTitle: "Associate Software Engineer @",
      duration: "NOV 2011 - MAY 2017",
      desc: [
        "Built Java-based enterprise applications with strong focus on OOP, multithreading, testing, and maintainability.",
        "Automated operational workflows, reducing manual effort and improving support efficiency by over 60%.",
        "Developed tools for SQL execution, reporting, monitoring, and user activity tracking across enterprise systems.",
        "Improved code quality, test coverage, and application reliability while working in Agile delivery environments.",
        "Provided L3 production support, root cause analysis, incident management, and system maintenance for business-critical enterprise applications, ensuring high availability and operational stability.",
        "Collaborated with business stakeholders, QA, and engineering teams in Agile environments, contributing to successful project delivery and continuous improvement initiatives."
      ],
    },
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ 
      flexGrow: 1, 
      bgcolor: "transparent", 
      display: "flex", 
      flexDirection: isMobile ? "column" : "row",
      height: "auto",
      minHeight: 300
    }}>
      <Tabs
        orientation={!isMobile ? "vertical" : "horizontal"}
        variant="scrollable"
        scrollButtons="auto"
        value={value}
        onChange={handleChange}
        sx={{ 
          borderRight: isMobile ? 0 : 1, 
          borderBottom: isMobile ? 1 : 0,
          borderColor: "var(--lightest-navy)",
          "& .MuiTabs-indicator": {
            backgroundColor: "var(--green-bright)"
          },
          "& .MuiTabs-flexContainer": {
            borderBottom: isMobile ? "1px solid var(--lightest-navy)" : "none"
          }
        }}
      >
        {Object.keys(experienceItems).map((key, i) => (
          <Tab 
            key={i} 
            label={key} 
            {...a11yProps(i, isMobile)} 
            sx={{
              color: "var(--slate)",
              fontFamily: "NTR",
              fontSize: "14px",
              textAlign: isMobile ? "center" : "left",
              alignItems: isMobile ? "center" : "flex-start",
              textTransform: "none",
              padding: "10px 20px",
              minHeight: "48px",
              minWidth: isMobile ? "120px" : "auto",
              "&.Mui-selected": {
                color: "var(--green-bright)"
              },
              "&:hover": {
                color: "var(--green-bright)",
                backgroundColor: "var(--green-tint)"
              }
            }}
          />
        ))}
      </Tabs>
      <Box sx={{ flexGrow: 1 }}>
        {Object.keys(experienceItems).map((key, i) => (
          <TabPanel key={i} value={value} index={i} isMobile={isMobile}>
            <span className="joblist-job-title">
              {experienceItems[key]["jobTitle"] + " "}
            </span>
            <span className="joblist-job-company">{key}</span>
            <div className="joblist-duration">
              {experienceItems[key]["duration"]}
            </div>
            <ul className="job-description">
              {experienceItems[key]["desc"].map(function (descItem, i) {
                return (
                  <FadeInSection key={i} delay={(i + 1) * 100 + "ms"}>
                    <li>{descItem}</li>
                  </FadeInSection>
                );
              })}
            </ul>
          </TabPanel>
        ))}
      </Box>
    </Box>
  );
};

export default JobList;
