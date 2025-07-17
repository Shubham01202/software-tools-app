import React from "react";
import { Card, Badge, Button } from "react-bootstrap";

const ToolCard = ({
  name,
  vendor,
  deployed,
  description,
  features,
  tags,
  onSelect,
  isSelected,
}) => {
  return (
    <Card className="h-100 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <Card.Title>{name}</Card.Title>
            <Card.Subtitle className="text-muted">{vendor}</Card.Subtitle>
          </div>
          <Badge bg={deployed ? "success" : "warning"} className="ms-2">
            {deployed ? "Deployed" : "Not Deployed"}
          </Badge>
        </div>
        <Card.Text className="mt-3">{description}</Card.Text>
        <strong>Key Features</strong>
        <ul>
          {features.map((f, i) => (
            <li key={i}>{f}</li>
          ))}
        </ul>
        <div className="d-flex flex-wrap gap-2 mt-2 mb-3">
          {tags.map((tag, i) => (
            <Badge key={i} bg="light" text="dark">
              {tag}
            </Badge>
          ))}
        </div>

        {onSelect && (
          <Button
            variant={isSelected ? "danger" : "primary"}
            onClick={() =>
              onSelect({
                name,
                vendor,
                deployed,
                features,
                tags,
                description,
              })
            }
          >
            {isSelected ? "Remove from Compare" : "Compare"}
          </Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default ToolCard;
