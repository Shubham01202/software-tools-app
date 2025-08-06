// src/pages/AdminAuth.jsx

import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Card, Container, Alert } from "react-bootstrap";

function AdminAuth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `http://localhost:1000/api/admin/${isLogin ? "login" : "signup"}`;

    try {
      const res = await axios.post(url, formData);
      localStorage.setItem("adminToken", res.data.token);
      setMessage("Success!");
      onLogin(); // notify App that login was successful
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Card style={{ width: "100%", maxWidth: "400px" }} className="p-4 shadow">
        <Card.Title className="text-center mb-3">
          {isLogin ? "Admin Login" : "Admin Signup"}
        </Card.Title>

        {message && <Alert variant="info">{message}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              required
              onChange={handleChange}
              placeholder="Enter email"
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              required
              onChange={handleChange}
              placeholder="Password"
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100 mb-3">
            {isLogin ? "Login" : "Sign Up"}
          </Button>

          <Button
            variant="link"
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage("");
            }}
            className="w-100"
          >
            {isLogin
              ? "Don't have an account? Sign Up"
              : "Already have an account? Log In"}
          </Button>
        </Form>
      </Card>
    </Container>
  );
}

export default AdminAuth;
