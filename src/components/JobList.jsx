import React from "react";
import PropTypes from "prop-types";
import {
  Tabs,
  Tab,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import FadeInSection from "./FadeInSection";

function TabPanel(props) {
  const { children, value, index, isMobile, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={
        isMobile
          ? `full-width-tabpanel-${index}`
          : `vertical-tabpanel-${index}`
      }
      aria-labelledby={
        isMobile
          ? `full-width-tab-${index}`
          : `vertical-tab-${index}`
      }
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
  isMobile: PropTypes.bool,
};

function a11yProps(index, isMobile) {
  if (isMobile) {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  }

  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const JobList = () => {
  const [value, setValue] = React.useState(0);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const experienceItems = {
    "Fresher": {
      jobTitle: "Aspiring Backend & AI Engineer",
      duration: "2022 - PRESENT",
      desc: [
        "B.Tech Electrical Engineering graduate from North Eastern Regional Institute of Science and Technology with a strong interest in software development, backend engineering, and artificial intelligence.",
        "Developing practical applications using Python, Java, FastAPI, React, PostgreSQL, SQLAlchemy, and REST APIs.",
        "Built an Enterprise AI Platform combining document management, authentication, semantic search, RAG-based conversations, PostgreSQL, and a modern React and FastAPI architecture.",
        "Built an AI Document Assistant focused on authenticated document upload, PDF processing, database persistence, semantic search, embeddings, and AI-powered document interaction.",
        "Currently strengthening skills in Machine Learning, NLP, LLMs, RAG systems, vector databases, and modern AI application development.",
        "Actively looking for opportunities to begin my professional career in backend development, software engineering, or AI-powered application development.",
      ],
    },
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        bgcolor: "transparent",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        height: "auto",
        minHeight: 300,
      }}
    >
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
            backgroundColor: "var(--green-bright)",
          },
          "& .MuiTabs-flexContainer": {
            borderBottom: isMobile
              ? "1px solid var(--lightest-navy)"
              : "none",
          },
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
                color: "var(--green-bright)",
              },
              "&:hover": {
                color: "var(--green-bright)",
                backgroundColor: "var(--green-tint)",
              },
            }}
          />
        ))}
      </Tabs>

      <Box sx={{ flexGrow: 1 }}>
        {Object.keys(experienceItems).map((key, i) => (
          <TabPanel
            key={i}
            value={value}
            index={i}
            isMobile={isMobile}
          >
            <span className="joblist-job-title">
              {experienceItems[key].jobTitle + " "}
            </span>

            <span className="joblist-job-company">
              Independent Projects
            </span>

            <div className="joblist-duration">
              {experienceItems[key].duration}
            </div>

            <ul className="job-description">
              {experienceItems[key].desc.map((descItem, i) => (
                <FadeInSection
                  key={i}
                  delay={(i + 1) * 100 + "ms"}
                >
                  <li>{descItem}</li>
                </FadeInSection>
              ))}
            </ul>
          </TabPanel>
        ))}
      </Box>
    </Box>
  );
};

export default JobList;