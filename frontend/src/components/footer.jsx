import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <Container>
        <Row className="text-center text-md-start">
          <Col md={4} className="mb-3 mb-md-0">
            <h5>Enterprise Software Directory</h5>
            <p className="mb-0">Helping you find the right software for your enterprise needs.</p>
          </Col>
          <Col md={4} className="mb-3 mb-md-0">
            <h6>Quick Links</h6>
            <ul className="list-unstyled">
              <li><a href="#" className="text-light text-decoration-none">Categories</a></li>
              <li><a href="#" className="text-light text-decoration-none">Vendors</a></li>
              <li><a href="#" className="text-light text-decoration-none">Login</a></li>
            </ul>
          </Col>
          <Col md={4}>
            <h6>Contact Us</h6>
            <p className="mb-1">Email: support@enterprisesoftware.com</p>
            <p>Phone: +91-123-456-7890</p>
          </Col>
        </Row>
        <hr className="border-light mt-4" />
        <p className="text-center mb-0">&copy; {new Date().getFullYear()} Enterprise Software Directory</p>
      </Container>
    </footer>
  );
};

export default Footer;
