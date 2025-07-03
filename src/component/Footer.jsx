import React from "react";
import "./Footer.scss";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Company Info Section */}
        <div className="footer-section">
          <div className="company-info">
            <h3 className="logo">EduConnect</h3>
            <p className="address">
              <i className="location-icon"></i>
              Hanoi, Vietnam
            </p>
            <p className="email">
              <i className="email-icon"></i>
              EduConnect@hello.com
            </p>
            <p className="phone">
              <i className="phone-icon"></i>
              +84 909 090 909
            </p>
          </div>
        </div>

        {/* Service Section */}
        <div className="footer-section">
          <h4>Service</h4>
          <ul>
            <li>
              <a href="#">Chat Bot</a>
            </li>
            <li>
              <a href="#">Schedule</a>
            </li>
            <li>
              <a href="#">Notifications</a>
            </li>
            <li>
              <a href="#">About Us</a>
            </li>
            <li>
              <a href="#">Contact Us</a>
            </li>
            <li>
              <a href="#">Development</a>
            </li>
          </ul>
        </div>

        {/* Company Section */}
        <div className="footer-section">
          <h4>Company</h4>
          <ul>
            <li>
              <a href="#">Service</a>
            </li>
            <li>
              <a href="#">Features</a>
            </li>
            <li>
              <a href="#">About Us</a>
            </li>
            <li>
              <a href="#">Contact Us</a>
            </li>
            <li>
              <a href="#">Development</a>
            </li>
          </ul>
        </div>

        {/* Social Media Section */}
        <div className="footer-section">
          <h4>Our Social Media</h4>
          <ul>
            <li>
              <a href="#">Facebook</a>
            </li>
            <li>
              <a href="#">Instagram</a>
            </li>
            <li>
              <a href="#">Twitter</a>
            </li>
            <li>
              <a href="#">LinkedIn</a>
            </li>
            <li>
              <a href="#">Youtube</a>
            </li>
          </ul>
        </div>

        {/* Newsletter Section */}
        <div className="footer-section">
          <h4>Join a Newsletter</h4>
          <div className="newsletter-form">
            <label htmlFor="email">Your Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter Your Email"
              className="email-input"
            />
            <button className="send-button">Send</button>
          </div>
          <p className="copyright">Copyright EduConnect</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
