import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import axios from "axios";

function EditToolModal({ show, onClose, tool, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    vendor: "",
    deployed: false,
    tags: "",
    keyFeatures: [],
  });

  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    if (tool) {
      setFormData({
        name: tool.name || "",
        vendor: tool.vendor || "",
        deployed: tool.deployed || false,
        tags: tool.tags ? tool.tags.join(", ") : "",
        keyFeatures: tool.keyFeatures || [],
      });
    }
  }, [tool]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "keyFeatures") {
      const featuresArray = value
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
      setFormData((prev) => ({
        ...prev,
        keyFeatures: featuresArray,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleGenerateFeatures = async () => {
    if (!formData.name.trim()) return alert("Tool name is required for AI.");

    setLoadingAI(true);
    try {
      const res = await axios.post("http://localhost:5000/api/openai/chat", {
        prompt: `Give top 5 key features (markdown with **Feature Name:** description) of software tool "${formData.name}"`,
      });

      const aiText = res.data.reply || "";
      const features = aiText
        .split("\n")
        .filter((line) => line.trim().match(/^(\d+\.|[-*•])\s+/))
        .map((line) =>
          line
            .replace(/^(\d+\.|[-*•])\s*/, "")
            .trim()
        );

      setFormData((prev) => ({
        ...prev,
        keyFeatures: features,
      }));
    } catch (err) {
      console.error("AI Error:", err);
      alert("AI failed to generate features.");
    } finally {
      setLoadingAI(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedTool = {
      name: formData.name,
      vendor: formData.vendor,
      deployed: formData.deployed,
      tags: formData.tags.split(",").map((tag) => tag.trim()),
      keyFeatures: formData.keyFeatures,
    };

    try {
      const res = await axios.put(
        `http://localhost:5000/api/tools/${tool._id}`,
        updatedTool
      );
      if (res.status === 200) {
        onSave(res.data);
        onClose();
      } else {
        alert("Unexpected response while updating the tool.");
      }
    } catch (err) {
      console.error("Error updating tool", err);
      alert("Failed to update the tool.");
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Tool</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Vendor</Form.Label>
            <Form.Control
              name="vendor"
              value={formData.vendor}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Tags (comma-separated)</Form.Label>
            <Form.Control
              name="tags"
              value={formData.tags}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              name="deployed"
              label="Deployed"
              type="checkbox"
              checked={formData.deployed}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Key Features (one per line, format: <code>**Feature:** Description</code>)
            </Form.Label>
            <Form.Control
              as="textarea"
              name="keyFeatures"
              rows={6}
              value={formData.keyFeatures.join("\n")}
              onChange={handleChange}
            />
          </Form.Group>

          <div className="d-flex justify-content-between align-items-center">
            <Button
              variant="outline-info"
              onClick={handleGenerateFeatures}
              disabled={loadingAI}
            >
              {loadingAI ? (
                <>
                  <Spinner animation="border" size="sm" /> Generating...
                </>
              ) : (
                "🔍 Get AI Key Features"
              )}
            </Button>

            <div className="text-end">
              <Button variant="secondary" onClick={onClose} className="me-2">
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </div>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default EditToolModal;
