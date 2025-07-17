import React from "react";
import { Container, Form, FormControl } from "react-bootstrap";

const Hero = () => {
  return (
    <div style={{ backgroundColor: "#106344", padding: "60px 0", color: "white" }}>
      <Container className="text-center px-3">
        <h1 className="fw-bold display-5 mb-3">Enterprise Software Directory</h1>
        <p className="lead mb-4">
          Search and discover licensed software available for use
        </p>
        <Form className="d-flex justify-content-center">
          <FormControl
            type="search"
            placeholder="Search for software by name, features, or category..."
            className="p-3"
            style={{
              maxWidth: "600px",
              width: "100%",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
        </Form>
      </Container>
    </div>
  );
};

export default Hero;
