import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import "./Homepage.scss";
import Header from "../../../../component/Header";
import heroImg from "../../../../assets/hero.jpeg";
import chatDemoImg from "../../../../assets/chat-demo.jpeg";
import teamImg from "../../../../assets/team.jpeg";
import hp1 from "../../../../assets/HP1.png";
import hp2 from "../../../../assets/HP2.jpeg";
import hp3 from "../../../../assets/HP3.jpeg";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const StyledButton = styled(Button)({
  borderRadius: "25px",
  textTransform: "none",
  padding: "10px 20px",
});

const Homepage = () => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(0);

  return (
    <>
      <Header />
      <Box className="homepage">
        {/* Hero Section */}
        <Box className="hero-section">
          <Container>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="h1" className="hero-title">
                  Your <span className="highlight">AI-powered</span>
                  <br />
                  Parent Support
                  <br />
                  Assistant
                </Typography>
                <Typography variant="body1" className="hero-subtitle">
                  Get instant, personalized and guidance
                  <br />
                  about your child's learning and progress
                </Typography>
                <Box mt={3}>
                  <StyledButton
                    variant="contained"
                    color="primary"
                    className="signup-button"
                    onClick={() => navigate("/register")}
                  >
                    Sign up for free
                  </StyledButton>
                  <StyledButton
                    variant="outlined"
                    className="school-button"
                    startIcon={<ArrowForwardIcon />}
                  >
                    For School
                  </StyledButton>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box className="chat-preview" sx={{ textAlign: "center" }}>
                  <img
                    src={heroImg}
                    alt="Hero"
                    style={{ maxWidth: "100%", borderRadius: 16 }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Features Section */}
        <Box className="features-section">
          <Container>
            <Grid container spacing={28}>
              <Grid item xs={12} md={4}>
                <Box className="stats" sx={{ textAlign: "center" }}>
                  <Typography variant="h3">8,500+</Typography>
                  <Typography>Parents received learning reports</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box className="stats" sx={{ textAlign: "center" }}>
                  <Typography variant="h3">12,000+</Typography>
                  <Typography>Questions answered by AI</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box className="stats" sx={{ textAlign: "center" }}>
                  <Typography variant="h3">98%</Typography>
                  <Typography>AI support</Typography>
                </Box>
              </Grid>
            </Grid>
            <Grid container spacing={4} sx={{ mt: 4 }}>
              <Grid item xs={12} md={6}>
                <Box className="chat-demo" sx={{ textAlign: "center" }}>
                  <img
                    src={hp2}
                    alt="Chat Demo"
                    style={{ maxWidth: 220, borderRadius: 16 }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box className="key-features">
                  <Typography variant="subtitle2" color="error" sx={{ mb: 1 }}>
                    Key Features
                  </Typography>
                  <ul style={{ listStyle: "none", padding: 0 }}>
                    <li
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: 12,
                      }}
                    >
                      <span
                        style={{
                          color: "#7C3AED",
                          fontSize: 24,
                          marginRight: 8,
                        }}
                      >
                        ●
                      </span>
                      <span>
                        <b>Personalized Feedback</b>
                        <br />
                        Benefit from data-driven, custom feedback provided by
                        our advanced AI algorithms.
                      </span>
                    </li>
                    <li
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: 12,
                      }}
                    >
                      <span
                        style={{
                          color: "#7C3AED",
                          fontSize: 24,
                          marginRight: 8,
                        }}
                      >
                        ●
                      </span>
                      <span>
                        <b>Insider Strategies</b>
                        <br />
                        Discover insider strategies and practical advice for
                        navigating every phase of the admissions journey
                      </span>
                    </li>
                    <li
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: 12,
                      }}
                    >
                      <span
                        style={{
                          color: "#7C3AED",
                          fontSize: 24,
                          marginRight: 8,
                        }}
                      >
                        ●
                      </span>
                      <span>
                        <b>Community Q&A Forum</b>
                        <br />
                        Engage with other members in our interactive forum to
                        collaboratively address your questions
                      </span>
                    </li>
                    <li
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: 12,
                      }}
                    >
                      <span
                        style={{
                          color: "#7C3AED",
                          fontSize: 24,
                          marginRight: 8,
                        }}
                      >
                        ●
                      </span>
                      <span>
                        <b>UK Admissions Test Question Bank</b>
                        <br />
                        Access an extensive collection of ad missions test
                        questions for thorough preparation
                      </span>
                    </li>
                  </ul>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Success Stats Section */}
        <Box className="success-section">
          <Container>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography
                  variant="subtitle1"
                  sx={{ color: "#7C3AED", fontWeight: 700, mb: 1 }}
                >
                  Why TechEd?
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
                  Boost Your Admission
                  <br />
                  Proven Success Rate:
                </Typography>
                <Typography variant="body1" sx={{ mb: 4 }}>
                  our students gain admission to their first-choice university.
                </Typography>
                <Box
                  className="stats-container"
                  sx={{ display: "flex", gap: 6, mb: 2 }}
                >
                  <Box className="stat-item" sx={{ textAlign: "center" }}>
                    <Typography
                      variant="h2"
                      sx={{ color: "#7C3AED", fontWeight: 700 }}
                    >
                      4x ↑
                    </Typography>
                    <Typography sx={{ fontWeight: 500 }}>
                      Increase Chance
                    </Typography>
                  </Box>
                  <Box className="stat-item" sx={{ textAlign: "center" }}>
                    <Typography
                      variant="h2"
                      sx={{ color: "#7C3AED", fontWeight: 700 }}
                    >
                      70% ↑
                    </Typography>
                    <Typography sx={{ fontWeight: 500 }}>
                      Admission to top university
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Testimonials Section */}
        <Box className="testimonials-section">
          <Container>
            <Box
              className="section-header"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 4,
              }}
            >
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, textAlign: "center", flex: 1 }}
              >
                Testimonials
              </Typography>
              <Box
                className="navigation-buttons"
                sx={{ display: "flex", gap: 1 }}
              >
                <IconButton
                  sx={{ color: "#7C3AED", border: "1px solid #7C3AED" }}
                >
                  <ArrowBackIcon />
                </IconButton>
                <IconButton
                  sx={{ color: "#7C3AED", border: "1px solid #7C3AED" }}
                >
                  <ArrowForwardIcon />
                </IconButton>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 4,
                overflowX: "auto",
                pb: 2,
              }}
            >
              {testimonials.map((testimonial, index) => (
                <Card
                  key={index}
                  className="testimonial-card"
                  sx={{
                    minWidth: 320,
                    maxWidth: 360,
                    flex: "0 0 auto",
                    border: "1.5px solid #7C3AED",
                    borderRadius: 4,
                    boxShadow: "none",
                    height: "100%",
                  }}
                >
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ color: "#7C3AED", fontWeight: 700, mb: 1 }}
                    >
                      {testimonial.name}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 700, mb: 1 }}
                    >
                      {testimonial.university}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {testimonial.content}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mt: "auto",
                        pt: 2,
                      }}
                    >
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          Rated 5/5 stars
                        </Typography>
                        <Box sx={{ color: "#7C3AED" }}>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span
                              key={i}
                              style={{ fontSize: 18, marginRight: 2 }}
                            >
                              ★
                            </span>
                          ))}
                        </Box>
                      </Box>
                      <Box sx={{ textAlign: "right" }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          Verified Student
                        </Typography>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <span style={{ color: "#7C3AED", fontSize: 16 }}>
                            ●
                          </span>
                          <Typography variant="body2">2022 Batch</Typography>
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Container>
        </Box>

        {/* FAQ Section */}
        <Box className="faq-section">
          <Container>
            <Typography
              variant="h4"
              align="center"
              sx={{ fontWeight: 700, mb: 4 }}
            >
              FAQ
            </Typography>
            <Box>
              {faqs.map((faq, index) => (
                <Accordion
                  key={index}
                  className="custom-accordion"
                  disableGutters
                  sx={{
                    mb: 2,
                    borderRadius: index === 0 ? "20px" : "0",
                    border: index === 0 ? "1.5px solid #7C3AED" : "none",
                    boxShadow: "none",
                    "&:before": { display: "none" },
                  }}
                  expanded={expanded === index}
                  onChange={() =>
                    setExpanded(expanded === index ? false : index)
                  }
                >
                  <AccordionSummary
                    expandIcon={
                      <ExpandMoreIcon
                        sx={{
                          color: "#7C3AED",
                          transform:
                            expanded === index ? "rotate(180deg)" : "none",
                          transition: "0.2s",
                        }}
                      />
                    }
                    aria-controls={`faq-content-${index}`}
                    id={`faq-header-${index}`}
                    sx={{
                      fontWeight: expanded === index ? 700 : 600,
                      fontSize: 24,
                      color: "#000",
                      borderBottom:
                        expanded === index ? "none" : "1.5px solid #7C3AED",
                      minHeight: 64,
                    }}
                  >
                    {faq.question}
                  </AccordionSummary>
                  <AccordionDetails
                    sx={{
                      fontSize: 16,
                      color: "#222",
                      background: "#fff",
                      borderRadius: "0 0 20px 20px",
                    }}
                  >
                    {faq.answer}
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          </Container>
        </Box>

        {/* CTA Section */}
        <Box className="cta-section">
          <Container>
            <Typography variant="h4">
              Access your AI university counselor now!
            </Typography>
            <StyledButton
              variant="contained"
              color="primary"
              endIcon={<ArrowForwardIosIcon />}
            >
              Sign up for free
            </StyledButton>
          </Container>
        </Box>
      </Box>
    </>
  );
};

const features = [
  {
    title: "Personalized Feedback",
    description:
      "Benefit from data-driven custom feedback provided by our experts",
  },
  {
    title: "Insider Strategies",
    description:
      "Discover insider strategies and practical advice for navigating every phase of the admissions journey",
  },
  {
    title: "Community Q&A Forum",
    description:
      "Engage with other members in our interactive forum to collaboratively address your questions",
  },
  {
    title: "UK Admissions Test Question Bank",
    description:
      "Access an extensive collection of admission test questions for thorough preparation",
  },
];

const testimonials = [
  {
    name: "Enoch",
    university: "Harvard University",
    content:
      "Writing a university application essay is a lengthy process. I love talking efficiency without sacrificing depth.",
  },
  {
    name: "Nat",
    university: "Duke University",
    content:
      "TechEd program is highly effective because it guides you through each step of the admissions process.",
  },
  {
    name: "Isaac",
    university: "University of Pennsylvania",
    content:
      "The university application process can be overwhelming, but TechEd helped guide me through the process.",
  },
];

const faqs = [
  {
    question: "How can I ask the AI about my child's academic performance?",
    answer:
      "You can log in to the system, select the 'Ask AI' feature, and enter your questions about grades, progress, or any academic concerns. The AI will respond based on your child's latest learning data.",
  },
  {
    question: "What can the AI help me track about my child?",
    answer:
      "The AI can provide information on grades, learning progress, subjects your child is struggling with, class attendance history, and suggest suitable support methods.",
  },
  {
    question: "Can I receive regular reports on my child's academic status?",
    answer:
      "Yes. The system allows you to subscribe to weekly or monthly reports via email or in-app notifications.",
  },
  {
    question: "Is my child's information kept confidential?",
    answer:
      "We are committed to keeping all student personal and academic information strictly confidential. Data is only used to support parents and is not shared with third parties.",
  },
  {
    question:
      "What should I do if the AI reports my child is struggling academically?",
    answer:
      "You should contact the homeroom teacher or the school's counseling department for appropriate solutions. You can also ask the AI for additional learning support suggestions for your child.",
  },
];

export default Homepage;
