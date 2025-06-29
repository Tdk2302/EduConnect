import React from "react";
import "./Footer.scss";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Company Info Section */}
        <div className="footer-section">
          <div className="company-info">
            <h3 className="logo">Satyamstudio</h3>
            <p className="address">
              <i className="location-icon"></i>
              8819 Ohio St. South Gate,
              <br />
              CA 90280
            </p>
            <p className="email">
              <i className="email-icon"></i>
              Ourstudio@hello.com
            </p>
            <p className="phone">
              <i className="phone-icon"></i>
              +1 386-688-3295
            </p>
          </div>
        </div>

        {/* Service Section */}
        <div className="footer-section">
          <h4>Service</h4>
          <ul>
            <li>
              <a href="#">Illustration</a>
            </li>
            <li>
              <a href="#">Mobile Design</a>
            </li>
            <li>
              <a href="#">Motion Graphic</a>
            </li>
            <li>
              <a href="#">Web Design</a>
            </li>
            <li>
              <a href="#">Development</a>
            </li>
            <li>
              <a href="#">SEO</a>
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
              <a href="#">Our Team</a>
            </li>
            <li>
              <a href="#">Portfolio</a>
            </li>
            <li>
              <a href="#">Blog</a>
            </li>
            <li>
              <a href="#">Contact Us</a>
            </li>
          </ul>
        </div>

        {/* Social Media Section */}
        <div className="footer-section">
          <h4>Our Social Media</h4>
          <ul>
            <li>
              <a href="#">Dribbble</a>
            </li>
            <li>
              <a href="#">Behance</a>
            </li>
            <li>
              <a href="#">Medium</a>
            </li>
            <li>
              <a href="#">Instagram</a>
            </li>
            <li>
              <a href="#">Facebook</a>
            </li>
            <li>
              <a href="#">Twitter</a>
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
          <p className="copyright">Copyright Satyam Studio</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
