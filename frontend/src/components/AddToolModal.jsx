import React, { useState, useEffect } from "react";
import { Modal, Button, Form, InputGroup, Spinner } from "react-bootstrap";
import axios from "axios";

function AddToolModal({ show, onClose, onToolAdded }) {
  const [name, setName] = useState("");
  const [vendor, setVendor] = useState("");
  const [category, setCategory] = useState("");
  const [keyFeatures, setKeyFeatures] = useState([]);
  const [tags, setTags] = useState("");
  const [deployed, setDeployed] = useState("true");
  const [error, setError] = useState(null);
  const [loadingFeatures, setLoadingFeatures] = useState(false);

  useEffect(() => {
    if (show) {
      setName("");
      setVendor("");
      setCategory("");
      setKeyFeatures([]);
      setTags("");
      setDeployed("true");
      setError(null);
    }
  }, [show]);

  const handleGenerateFeatures = async () => {
    if (!name.trim()) {
      setError("Enter tool name first to generate features.");
      return;
    }
    setError(null);
    setLoadingFeatures(true);
    try {
      const res = await axios.post("https://software-tools-app-2.onrender.com/api/openai/chat"
, {
        prompt: `Generate 5 key features for the software tool: ${name}`,
      });
      const text = res.data.reply || "";

      const features = text
        .split("\n")
        .filter((line) => line.trim().match(/^(\d+\.|[-*•])\s+/))
        .map((line) => line.replace(/^(\d+\.|[-*•])\s*/, "").trim());

      setKeyFeatures(features);
    } catch (err) {
      setError("AI failed to generate features.");
    } finally {
      setLoadingFeatures(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newTool = {
      name,
      vendor,
      category,
      deployed: deployed === "true",
      tags: tags.split(",").map((tag) => tag.trim()),
      keyFeatures: keyFeatures
        .map((line) => line.trim())
        .filter((line) => line.length > 0),
    };

    try {
      const res = await axios.post("http://localhost:1000/api/tools", newTool);
      if (res.status === 201 && res.data) {
        onToolAdded(res.data);
        onClose();
      } else {
        setError("Tool creation returned unexpected response.");
      }
    } catch (err) {
      console.error("Error adding tool", err);
      setError("Failed to add tool. Please check all inputs.");
    }
  };

  return (
    <Modal show={show} onHide={onClose} backdrop="static" keyboard={true}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Tool</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <div className="alert alert-danger">{error}</div>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Tool Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Vendor</Form.Label>
            <Form.Control
              type="text"
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Control
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Key Features (one per line)</Form.Label>
            <InputGroup>
              <Form.Control
                as="textarea"
                rows={4}
                value={keyFeatures.join("\n")}
                onChange={(e) =>
                  setKeyFeatures(
                    e.target.value
                      .split("\n")
                      .map((line) => line.trim())
                      .filter((line) => line.length > 0)
                  )
                }
              />
              <Button
                variant="outline-secondary"
                onClick={handleGenerateFeatures}
                disabled={loadingFeatures}
              >
                {loadingFeatures ? <Spinner size="sm" /> : "AI Generate"}
              </Button>
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Tags (comma-separated)</Form.Label>
            <Form.Control
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Deployment Status</Form.Label>
            <Form.Select
              value={deployed}
              onChange={(e) => setDeployed(e.target.value)}
              required
            >
              <option value="true">Deployed</option>
              <option value="false">Not Deployed</option>
            </Form.Select>
          </Form.Group>

          <div className="text-end">
            <Button variant="secondary" onClick={onClose} className="me-2">
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Add Tool
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AddToolModal;
