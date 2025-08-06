// src/components/ComparisonTable.jsx
import React from "react";
import { Table } from "react-bootstrap";

const ComparisonTable = ({ tools }) => {
  if (tools.length < 2) return null;

  const properties = [
    { label: "Name", key: "name" },
    { label: "Vendor", key: "vendor" },
    { label: "Category", key: "category" },
    {
      label: "Status",
      render: (tool) => (tool.deployed ? "Deployed" : "Not Deployed"),
    },
    {
      label: "Features",
      render: (tool) => tool.features?.join(", ") || "N/A",
    },
    {
      label: "Tags",
      render: (tool) => tool.tags?.join(", ") || "N/A",
    },
  ];

  return (
    <div className="table-responsive mt-4">
      <h5>Comparison Table</h5>
      <Table bordered striped hover>
        <thead>
          <tr>
            <th>Property</th>
            {tools.map((tool) => (
              <th key={tool._id}>{tool.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {properties.map((prop) => (
            <tr key={prop.label}>
              <td>{prop.label}</td>
              {tools.map((tool) => (
                <td key={`${tool._id}-${prop.label}`}>
                  {prop.render ? prop.render(tool) : tool[prop.key] || "N/A"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ComparisonTable;
