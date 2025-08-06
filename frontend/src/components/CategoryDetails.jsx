// src/components/CategoryDetails.jsx
import React from "react";
import { Container, Row, Col, Form, Button, Dropdown } from "react-bootstrap";
import ToolCard from "./ToolCard";

const tools = [
  {
    name: "Visual Studio Code",
    vendor: "Microsoft",
    deployed: true,
    description: "A lightweight but powerful source code editor...",
    features: ["Code Editing", "Debugging", "Git Integration", "Extensions", "IntelliSense"],
    tags: ["IDE", "Code Editor", "Development"],
  },
  {
    name: "IntelliJ IDEA",
    vendor: "JetBrains",
    deployed: true,
    description: "Advanced Java IDE with deep code analysis...",
    features: ["Java Development", "Database Tools", "Code Analysis"],
    tags: ["IDE", "Java", "Development"],
  },
  {
    name: "GitHub Desktop",
    vendor: "GitHub",
    deployed: true,
    description: "Seamless Git integration with user-friendly interface...",
    features: ["Git Management", "GitHub Integration", "Pull Requests"],
    tags: ["Version Control", "Git", "Development"],
  },
  {
    name: "Docker Desktop",
    vendor: "Docker",
    deployed: false,
    description: "Build, ship, and run containerized applications.",
    features: ["Container Management", "DevOps", "Kubernetes"],
    tags: ["DevOps", "Containers", "Shipping"],
  },
  {
  name: "Postman",
  vendor: "Postman Inc.",
  deployed: false,
  description: "Collaborate on building, testing, and documenting APIs.",
  features: ["API Testing", "Automation", "Collaboration"],
  tags: ["API", "Testing", "Documentation"],
},
  {
  name: "Jenkins",
  vendor: "Jenkins Project",
  deployed: true,
  description: "Open-source automation server for building, testing, and deploying code.",
  features: ["Pipeline Support", "Plugins", "Continuous Integration"],
  tags: ["CI/CD", "Automation", "Open Source"],
},

  // Add more tools here
];

const CategoryDetails = () => {
  return (
    <Container className="my-5">
      <h2 className="mb-1">🛠️ Development Tools</h2>
      <p className="text-muted">Essential tools and utilities for software development</p>

      {/* Search Bar */}
      <Form className="my-3">
        <Form.Control placeholder="Search in Development Tools..." />
      </Form>

      {/* Sort and Filter */}
      <div className="d-flex justify-content-end gap-2 mb-4">
        <Dropdown>
          <Dropdown.Toggle variant="light" size="sm">Sort by</Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>Alphabetical</Dropdown.Item>
            <Dropdown.Item>Deployment Status</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown>
          <Dropdown.Toggle variant="light" size="sm">Filter</Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>Show All</Dropdown.Item>
            <Dropdown.Item>Deployed Only</Dropdown.Item>
            <Dropdown.Item>Not Deployed</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {/* Grid */}
      <Row xs={1} sm={2} md={3} className="g-4">
        {tools.map((tool, i) => (
          <Col key={i}>
            <ToolCard {...tool} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default CategoryDetails;
