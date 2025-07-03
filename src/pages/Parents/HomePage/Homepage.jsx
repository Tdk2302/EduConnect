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
import Header from "../../../component/Header";
import heroImg from "../../../assets/hero.jpeg";
import chatDemoImg from "../../../assets/chat-demo.jpeg";
import teamImg from "../../../assets/team.jpeg";
import hp1 from "../../../assets/HP1.png";
import hp2 from "../../../assets/HP2.jpeg";
import hp3 from "../../../assets/HP3.jpeg";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Footer from "../../../component/Footer";

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
                  <span className="highlight">AI-powered</span>
                  <br />
                  Hệ thống hỗ trợ
                  <br />
                  phụ huynh
                </Typography>
                <Typography variant="body1" className="hero-subtitle">
                  Nhận thông tin nhanh chóng, cá nhân hóa
                  <br />
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
                    Cho Trường
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
                  <Typography>Phụ huynh nhận được báo cáo học tập</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box className="stats" sx={{ textAlign: "center" }}>
                  <Typography variant="h3">12,000+</Typography>
                  <Typography>Câu hỏi được trả lời bởi AI</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box className="stats" sx={{ textAlign: "center" }}>
                  <Typography variant="h3">98%</Typography>
                  <Typography>Hỗ trợ AI</Typography>
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
                    Tính năng chính
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
                        <b>Báo cáo học tập cá nhân</b>
                        <br />
                        Nhận được báo cáo học tập cá nhân từ AI, dựa trên dữ
                        liệu học tập của con bạn.
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
                        <b>Hỗ trợ AI</b>
                        <br />
                        Hỗ trợ AI giúp phụ huynh theo dõi học tập của con bạn
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
                        <b>Hệ thống hỏi đáp</b>
                        <br />
                        Tham gia vào diễn đàn hỏi đáp với các phụ huynh khác để
                        giải đáp các câu hỏi của bạn
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
                        <b>Hệ thống hỏi đáp</b>
                        <br />
                        Tham gia vào diễn đàn hỏi đáp với các phụ huynh khác để
                        giải đáp các câu hỏi của bạn
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
                  Tại sao chọn chúng tôi?
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
                  Tăng tỷ lệ thành công
                  <br />
                  Tỷ lệ thành công đã được chứng minh:
                </Typography>
                <Typography variant="body1" sx={{ mb: 4 }}>
                  các học sinh của chúng tôi được nhận vào trường đại học mà họ
                  muốn.
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
                      Tăng khả năng
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
                      Nhận vào trường đại học hàng đầu
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
                Đánh giá của phụ huynh
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
                          Đánh giá 5/5 sao
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
                          Học sinh đã xác thực
                        </Typography>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <span style={{ color: "#7C3AED", fontSize: 16 }}>
                            ●
                          </span>
                          <Typography variant="body2">2022 Lớp</Typography>
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
              Câu hỏi thường gặp
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
              Truy cập công cụ hỗ trợ AI của chúng tôi ngay!
            </Typography>
            <StyledButton
              variant="contained"
              color="primary"
              endIcon={<ArrowForwardIosIcon />}
              onClick={() => navigate("/register")}
            >
              Đăng ký miễn phí
            </StyledButton>
          </Container>
        </Box>
        <Footer />
      </Box>
    </>
  );
};

const testimonials = [
  {
    name: "Nguyễn Văn A",
    university: "Trường Đại học Bách Khoa Hà Nội",
    content:
      "Chúng tôi rất hài lòng về chất lượng dịch vụ của chúng tôi. Chúng tôi đã nhận được nhiều báo cáo học tập cá nhân và hỗ trợ AI rất hữu ích.",
  },
  {
    name: "Nguyễn Văn B",
    university: "Trường Đại học Bách Khoa Hà Nội",
    content:
      "Chúng tôi rất hài lòng về chất lượng dịch vụ của chúng tôi. Chúng tôi đã nhận được nhiều báo cáo học tập cá nhân và hỗ trợ AI rất hữu ích.",
  },
  {
    name: "Nguyễn Văn C",
    university: "Trường Đại học Bách Khoa Hà Nội",
    content:
      "Chúng tôi rất hài lòng về chất lượng dịch vụ của chúng tôi. Chúng tôi đã nhận được nhiều báo cáo học tập cá nhân và hỗ trợ AI rất hữu ích.",
  },
];

const faqs = [
  {
    question: "Làm thế nào để tôi hỏi AI về hiệu suất học tập của con tôi?",
    answer:
      "Bạn có thể đăng nhập vào hệ thống, chọn tính năng 'Hỏi AI', và nhập các câu hỏi về điểm số, tiến trình học tập, hoặc bất kỳ vấn đề học tập nào. AI sẽ trả lời dựa trên dữ liệu học tập gần nhất của con bạn.",
  },
  {
    question:
      "AI có thể giúp tôi theo dõi điểm số, tiến trình học tập, môn học nào mà con tôi đang gặp khó khăn, lịch sử điểm danh của con tôi, và đề xuất các phương pháp hỗ trợ phù hợp.",
    answer:
      "AI có thể cung cấp thông tin về điểm số, tiến trình học tập, môn học nào mà con tôi đang gặp khó khăn, lịch sử điểm danh của con tôi, và đề xuất các phương pháp hỗ trợ phù hợp.",
  },
  {
    question:
      "Tôi có thể nhận được báo cáo học tập cá nhân hàng tuần hoặc hàng tháng không?",
    answer:
      "Có. Hệ thống cho phép bạn đăng ký nhận báo cáo học tập cá nhân hàng tuần hoặc hàng tháng qua email hoặc thông báo trong ứng dụng.",
  },
  {
    question: "Thông tin của con tôi có được bảo mật không?",
    answer:
      "Chúng tôi cam kết bảo mật tất cả thông tin cá nhân và học tập của học sinh. Dữ liệu chỉ được sử dụng để hỗ trợ phụ huynh và không được chia sẻ với bên thứ ba.",
  },
  {
    question:
      "Tôi nên làm gì nếu AI báo cáo rằng con tôi đang gặp khó khăn trong học tập?",
    answer:
      "Bạn nên liên hệ với giáo viên chủ nhiệm hoặc phòng tư vấn của trường để tìm ra giải pháp phù hợp. Bạn cũng có thể hỏi AI về các gợi ý hỗ trợ học tập thêm cho con bạn.",
  },
];

export default Homepage;
