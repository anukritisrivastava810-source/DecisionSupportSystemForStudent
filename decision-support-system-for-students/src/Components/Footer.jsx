import React from 'react';
import { Camera, Mail } from 'lucide-react';

/**
 * Footer component
 * Standard footer for the application.
 */
function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-inner">
          <div className="footer-brand">
            <h3>DSS for Students</h3>
            <p>Empowering students to make structured, informed decisions about their academic and career future.</p>
          </div>
          <div className="footer-links">
            <h4>Contact</h4>
            <div className="footer-contact">
              <a href="tel:+919876543210">📞 +91 98765 43210</a>
              <a href="https://instagram.com/dss_students" target="_blank" rel="noreferrer">
                <Camera size={18} style={{ marginRight: "6px" }} /> @dss_students
              </a>
              <a href="https://twitter.com/dss_students" target="_blank" rel="noreferrer">
                🐦 @dss_students
              </a>
              <a href="mailto:support@dssstudents.in">
                <Mail size={18} style={{ marginRight: "6px" }} /> support@dssstudents.in
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">© 2026 Decision Support System for Students. All rights reserved.</div>
      </div>
    </footer>
  );
}

export default Footer;
