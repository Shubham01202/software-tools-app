import React, { useState } from "react";
import {
  Navbar,
  Nav,
  Container,
  Form,
  FormControl,
  Button,
  Modal,
} from "react-bootstrap";
import { BsPersonCircle } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function NavbarComponent() {
  const [showModal, setShowModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("adminToken");

  const toggleModal = () => {
    setShowModal(!showModal);
    setError("");
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setFormData({ name: "", email: "", password: "" });
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

   const url = isLogin
  ? "https://software-tools-app-2.onrender.com/api/admin/login"
  : "https://software-tools-app-2.onrender.com/api/admin/signup";

    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : formData;

    try {
      const res = await axios.post(url, payload);

      if (isLogin && res.data.token) {
        localStorage.setItem("adminToken", res.data.token);
        setShowModal(false);
        navigate("/admin"); // Redirect to admin panel
      } else if (!isLogin) {
        alert("Admin created! Please log in.");
        switchMode();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    }
  };

  // ✅ Updated logout function
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/tools"; // Redirect directly to tools page
  };

  return (
    <>
      <Navbar bg="light" expand="lg" className="shadow-sm w-100 px-3">
        <Container fluid>
          <Navbar.Brand as={Link} to="/">Enterprise Software Directory</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Form className="d-flex mx-auto my-2" style={{ maxWidth: "500px", flex: 1 }}>
              <FormControl type="search" placeholder="Search for software..." className="me-2" />
            </Form>
            <Nav className="ms-auto align-items-center">
              <Nav.Link as={Link} to="/development-tools">Categories</Nav.Link>
              <Nav.Link as={Link} to="/vendors">Vendors</Nav.Link>

              {isLoggedIn ? (
                <Button
                  variant="outline-danger"
                  onClick={handleLogout}
                  className="ms-2"
                >
                  Logout
                </Button>
              ) : (
                <Button
                  variant="outline-secondary"
                  onClick={toggleModal}
                  className="ms-2 d-flex align-items-center justify-content-center"
                  style={{ width: "40px", height: "40px", padding: 0 }}
                >
                  <BsPersonCircle size={24} />
                </Button>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Modal for login/signup */}
      <Modal show={showModal} onHide={toggleModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{isLogin ? "Admin Login" : "Admin Sign Up"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            {!isLogin && (
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            )}
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Form.Group>
            {error && <div className="text-danger mb-2">{error}</div>}
            <Button variant="primary" type="submit" className="w-100">
              {isLogin ? "Login" : "Sign Up"}
            </Button>
          </Form>
          <div className="text-center mt-3">
            <small>
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <span
                style={{ color: "blue", cursor: "pointer" }}
                onClick={switchMode}
              >
                {isLogin ? "Sign Up" : "Login"}
              </span>
            </small>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default NavbarComponent;
