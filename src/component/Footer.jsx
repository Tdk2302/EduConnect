import React from "react";
import { Layout, Row, Col, Typography, Button, Input } from "antd";

const { Footer: AntFooter } = Layout;
const { Title, Text, Link } = Typography;

export default function Footer() {
  return (
    <AntFooter style={{ background: "#f7faff", padding: "48px 0 24px 0", borderTop: "1px solid #e5e7eb" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Row gutter={[32, 32]}>
          <Col xs={24} md={6}>
            <Title level={4} style={{ color: "#14448b", marginBottom: 12 }}>EduConnect</Title>
            <Text>Hanoi, Vietnam</Text><br />
            <Text>Email: EduConnect@hello.com</Text><br />
            <Text>Phone: +84 909 090 909</Text>
          </Col>
          <Col xs={24} md={4}>
            <Title level={5} style={{ color: "#14448b" }}>Dịch vụ</Title>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <li><Link>Chat Bot</Link></li>
              <li><Link>Lịch học</Link></li>
              <li><Link>Thông báo</Link></li>
              <li><Link>Về chúng tôi</Link></li>
              <li><Link>Liên hệ</Link></li>
            </ul>
          </Col>
          <Col xs={24} md={4}>
            <Title level={5} style={{ color: "#14448b" }}>Công ty</Title>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <li><Link>Dịch vụ</Link></li>
              <li><Link>Tính năng</Link></li>
              <li><Link>Về chúng tôi</Link></li>
              <li><Link>Liên hệ</Link></li>
            </ul>
          </Col>
          <Col xs={24} md={4}>
            <Title level={5} style={{ color: "#14448b" }}>Mạng xã hội</Title>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <li><Link>Facebook</Link></li>
              <li><Link>Instagram</Link></li>
              <li><Link>Twitter</Link></li>
              <li><Link>LinkedIn</Link></li>
              <li><Link>Youtube</Link></li>
            </ul>
          </Col>
          <Col xs={24} md={6}>
            <Title level={5} style={{ color: "#14448b" }}>Đăng ký nhận tin</Title>
            <Input placeholder="Nhập email của bạn" style={{ marginBottom: 8, borderRadius: 6 }} />
            <Button type="primary" style={{ borderRadius: 6, width: "100%" }}>Gửi</Button>
            <Text style={{ display: "block", marginTop: 16, color: "#888" }}>© EduConnect {new Date().getFullYear()}</Text>
          </Col>
        </Row>
      </div>
    </AntFooter>
  );
}
