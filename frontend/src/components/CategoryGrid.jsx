import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { FaCode, FaShieldAlt, FaPaintBrush, FaChartLine, FaBullhorn, FaTasks } from "react-icons/fa";

const categories = [
  { name: "Development Tools", icon: <FaCode size={40} color="#106344" /> },
  { name: "Security", icon: <FaShieldAlt size={40} color="#106344" /> },
  { name: "Design", icon: <FaPaintBrush size={40} color="#106344" /> },
  { name: "Productivity", icon: <FaTasks size={40} color="#106344" /> },
  { name: "Analytics", icon: <FaChartLine size={40} color="#106344" /> },
  { name: "Marketing", icon: <FaBullhorn size={40} color="#106344" /> },
];

const CategoryGrid = () => {
  return (
    <Container className="my-5 px-4">
      <h3 className="text-center fw-bold mb-4">Popular Categories</h3>
      <Row xs={1} sm={2} md={3} className="g-4">
        {categories.map((cat, index) => (
          <Col key={index}>
            <Card className="h-100 text-center shadow-sm p-3 border-0">
              <Card.Body>
                <div className="mb-3">{cat.icon}</div>
                <Card.Title className="fw-semibold">{cat.name}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default CategoryGrid;
