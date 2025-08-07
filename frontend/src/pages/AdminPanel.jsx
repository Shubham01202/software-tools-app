import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminPanel = () => {
  const [compareTools, setCompareTools] = useState([]);
  const [featureTable, setFeatureTable] = useState("");
  const [similarTable, setSimilarTable] = useState("");
  const [featureTableLoading, setFeatureTableLoading] = useState(false);
  const [similarTableLoading, setSimilarTableLoading] = useState(false);

  useEffect(() => {
    const fetchComparisonTables = async () => {
      if (compareTools.length < 2) return;

      setFeatureTableLoading(true);
      setSimilarTableLoading(true);

      const names = compareTools.map((t) => t.name).join(", ");
      const toolNames = compareTools.map((t) => t.name).join(" | ");
      const headerLine = `| Feature | ${toolNames} | Short Description |`;
      const separatorLine = `|---------|${compareTools.map(() => "---------").join("|")}|-------------------|`;

      try {
        const prompt1 = `
You are a software analyst.

Generate a markdown comparison table of key features for the following tools: ${names}.

The table must have the following format:

${headerLine}
${separatorLine}

Each row = one key feature.
Use ✅ or ❌ for each tool.
Each row must include a short description of the feature in the last column.
No unnecessary explanations.
`;

        const prompt2 = `
You are a product analyst.

Generate a markdown table listing 3 similar products for each of these tools: ${names}.

Format:

| Similar Product | Short Description |
|-----------------|-------------------|

Group them by tool internally. Do not repeat the tool names.
No extra explanation or headings.
`;

        const res1 = await axios.post("http://localhost:1000/api/openai/generate", {
          prompt: prompt1,
        });

        const res2 = await axios.post("http://localhost:1000/api/openai/generate", {
          prompt: prompt2,
        });

        setFeatureTable(res1.data.table || res1.data);
        setSimilarTable(res2.data.table || res2.data);
      } catch (err) {
        console.error("AI table fetch error:", err);
      } finally {
        setFeatureTableLoading(false);
        setSimilarTableLoading(false);
      }
    };


    fetchComparisonTables();
  }, [compareTools]);

  const fetchTools = async () => {
    try {
  const res = await axios.get("https://software-tools-app-2.onrender.com/api/tools");
      setTools(res.data);
    } catch (err) {
      console.error("Error fetching tools:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (toolId) => {
    if (!window.confirm("Delete this tool?")) return;
    try {
      await axios.delete`https://software-tools-app-2.onrender.com/api/tools/${toolId}`
;
      setTools((prev) => prev.filter((tool) => tool._id !== toolId));
    } catch (err) {
      alert("Failed to delete tool");
    }
  };

  const handleUpdate = (updatedTool) => {
    setTools((prev) =>
      prev.map((tool) => (tool._id === updatedTool._id ? updatedTool : tool))
    );
    setEditTool(null);
  };

  const handleAddTool = (newTool) => {
    setTools((prev) => [newTool, ...prev]);
    setShowAddModal(false);
  };

  const toggleCompare = (tool) => {
    setCompareTools((prev) =>
      prev.find((t) => t._id === tool._id)
        ? prev.filter((t) => t._id !== tool._id)
        : [...prev, tool]
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/tools";
  };

  const handleChatSubmit = async (customPrompt) => {
    const promptToSend = customPrompt || chatInput;
    if (!promptToSend.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text: promptToSend }]);
    setChatInput("");
    setChatLoading(true);

    try {
      const res = await axios.post("https://software-tools-app-2.onrender.com/api/openai/chat"
, {
        prompt: promptToSend,
      });
      setMessages((prev) => [...prev, { sender: "bot", text: res.data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error: Something went wrong." },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleGenerateKeyFeatures = async (tool) => {
    setAiLoadingId(tool._id);
    try {
      const prompt = `Generate 3-5 key features for the software tool named "${tool.name}" by "${tool.vendor}" in the category "${tool.category}". Return as a numbered list.`;
      const res = await axios.post("https://software-tools-app-2.onrender.com/api/openai/chat",
 {
        prompt,
      });
      const handleChatSubmit = async () => {
        if (!chatInput.trim()) return;

        setMessages((prev) => [...prev, { sender: "user", text: chatInput }]);
        setChatInput("");
        setChatLoading(true);

        try {
          const res = await axios.post(
           "https://software-tools-app-2.onrender.com/api/openai/chat",

            {
              prompt: chatInput,
            }
          );

          setMessages((prev) => [
            ...prev,
            { sender: "bot", text: res.data.reply },
          ]);
        } catch (error) {
          setMessages((prev) => [
            ...prev,
            { sender: "bot", text: "Something went wrong!" },
          ]);
        } finally {
          setChatLoading(false);
        }
      };

      const features = res.data.reply
        .split("\n")
        .map((line) => line.replace(/^\d+[\).]?\s*/, "").trim())
        .filter((line) => line.length > 0);

      setTools((prev) =>
        prev.map((t) =>
          t._id === tool._id ? { ...t, keyFeatures: features } : t
        )
      );

  try {
  await axios.put(
    `https://software-tools-app-2.onrender.com/api/tools/${tool._id}`,
    {
      keyFeatures: features,
    }
  );
} catch (err) {
  alert("Failed to generate key features.");
} finally {
  setAiLoadingId(null);
}

  const parseMarkdownTable = (text) => {
    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter(
        (line) =>
          line.startsWith("|") &&
          line.endsWith("|") &&
          !line.toLowerCase().includes("similar product") &&
          !line.includes("---")
      );

    if (lines.length < 2) return null;

    const headers = lines[0]
      .split("|")
      .slice(1, -1)
      .map((h) => h.trim());

    const rows = lines.slice(1).map((line) =>
      line
        .split("|")
        .slice(1, -1)
        .map((cell) => cell.trim())
    );

    return { headers, rows };
  };

  const isNumberedList = (text) => {
    return text.split("\n").every((line) => line.trim().match(/^\d+\.\s+/));
  };

  const isBulletList = (text) => {
    return text.split("\n").every((line) => line.trim().match(/^[-*•]\s+/));
  };
  const renderFormattedList = (text) => {
    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (isNumberedList(text)) {
      return (
        <ol className="mt-2 ps-3">
          {lines.map((line, i) => (
            <li key={i}>{line.replace(/^\d+\.\s+/, "")}</li>
          ))}
        </ol>
      );
    }

    if (isBulletList(text)) {
      return (
        <ul className="mt-2 ps-3">
          {lines.map((line, i) => (
            <li key={i}>{line.replace(/^[-*•]\s+/, "")}</li>
          ))}
        </ul>
      );
    }

    return <div className="mt-1">{text}</div>;
  };

  // ✅ Export table as PDF utility (ALAG function)
  const exportTableAsPDF = (id, filename) => {
    const element = document.getElementById(id);
    if (!element) return alert("Table not found");

    const opt = {
      margin: 0.5,
      filename: filename,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "landscape" },
    };

    html2pdf().set(opt).from(element).save();
  };
  const renderMarkdownTable = (markdownText) => {
    if (!markdownText || markdownText.trim() === "") return null;

    const parsed = parseMarkdownTable(markdownText);
    console.log("abcd", parsed);
    
    if (!parsed) return null;

    const { headers, rows } = parsed;

    const desiredColumns = ["Similar Product", "Short Description"];
    const hasSimilarProductFormat = desiredColumns.every((col) =>
      headers.includes(col)
    );

    const desiredIndexes = hasSimilarProductFormat
      ? headers
          .map((h, i) => (desiredColumns.includes(h) ? i : -1))
          .filter((i) => i !== -1)
      : headers.map((_, i) => i);

    const filteredHeaders = desiredIndexes.map((i) => headers[i]);
    console.log('filettte',filteredHeaders)
    const filteredRows = rows.map((row) => desiredIndexes.map((i) => row[i]));

    return (
      <Table striped bordered responsive size="sm" className="text-start mt-2">
        <thead>
          <tr>
            {filteredHeaders.length>2?filteredHeaders.map((header, i) => (
              <th style={{background:"#0000000d"}} key={i}>{header} </th>
            )):filteredHeaders.map((header, i) => (
              <td key={i}>{header}</td>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredRows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => {
                const value = cell.toLowerCase().trim();

                // ✅ Green Tick / Red Cross rendering
                if (value === "yes") {
                  return (
                    <td
                      key={colIndex}
                      className="text-center"
                      style={{ color: "green", fontWeight: "bold", }}
                    >
                      ✅
                    </td>
                  );
                } else if (value === "no") {
                  return (
                    <td
                      key={colIndex}
                      className="text-center"
                      style={{ color: "red", fontWeight: "bold" }}
                    >
                      ❌
                    </td>
                  );
                }

                return <td key={colIndex}>{cell}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };
  const markdownToCSV = (markdownText) => {
    if (!markdownText || !markdownText.includes("|")) return "";

    const lines = markdownText
      .split("\n")
      .map((line) => line.trim())
      .filter(
        (line) =>
          line.startsWith("|") &&
          line.endsWith("|") &&
          !line.toLowerCase().includes("similar product") &&
          !line.includes("---")
      );

    if (lines.length < 1) return "";

    const csvRows = lines.map((line) =>
      line
        .split("|")
        .slice(1, -1)
        .map((cell) => `"${cell.trim()}"`)
        .join(",")
    );

    return csvRows.join("\n");
  };

  const exportAllTablesAsCSV = () => {
    const basicHeaders = ["Property", ...compareTools.map((tool) => tool.name)];

    const basicRows = [
      ["Vendor", ...compareTools.map((tool) => tool.vendor)],
      [
        "Deployed",
        ...compareTools.map((tool) => (tool.deployed ? "Yes" : "No")),
      ],
      ["Tags", ...compareTools.map((tool) => tool.tags.join(", "))],
    ];

    const basicCSV = [
      basicHeaders.join(","),
      ...basicRows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const featureCSV = markdownToCSV(featureTable);
    const similarCSV = markdownToCSV(similarTable);

    const finalCSV = `Basic Comparison\n${basicCSV}\n\nKey Features\n${featureCSV}\n\nSimilar Products\n${similarCSV}`;

    const blob = new Blob([finalCSV], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ToolComparison.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Welcome to the Admin Panel</h2>
        <div className="d-flex gap-2 flex-wrap">
          {/* <Button variant="outline-primary" onClick={() => setShowChat(true)}>
          Chat with AI 🤖
        </Button> */}
          <Button
            variant="outline-success"
            onClick={() => setShowAddModal(true)}
          >
            Add Tool
          </Button>
          <Button variant="outline-dark" onClick={() => navigate("/tools")}>
            View Tools
          </Button>
        </div>
      </div>

      {loading ? (
        <Spinner animation="border" />
      ) : (
        <Table striped bordered hover responsive style={{ textAlign: "left" }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Vendor</th>
              <th>Deployed</th>
              <th>Key Features</th>
              <th>Tags</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tools.map((tool) => (
              <tr key={tool._id}>
                <td>{tool.name}</td>
                <td>{tool.vendor}</td>
                <td>{tool.deployed ? "Yes" : "No"}</td>
                <td>
                  <Table bordered size="sm">
                    <thead>
                      <tr>
                        <td style={{ width: "40%" }}>Feature</td>
                        <td>Description</td>
                      </tr>
                    </thead>
                    <tbody>
                      {(expandedFeatures[tool._id]
                        ? tool.keyFeatures
                        : tool.keyFeatures?.slice(0, 2)
                      )?.map((featureStr, index) => {
                        let name = `Feature ${index + 1}`;
                        let description = "No description available.";

                        if (featureStr.includes("**")) {
                          const match = featureStr.match(
                            /\*\*(.+?)\*\*:?[\s-]*(.*)/
                          );
                          if (match) {
                            name = match[1].trim();
                            if (match[2]) description = match[2].trim();
                          }
                        } else if (featureStr.includes(":")) {
                          const parts = featureStr.split(":");
                          name = parts[0].trim();
                          description =
                            parts[1]?.trim() || "No description available.";
                        } else {
                          name = featureStr.trim();
                        }

                        return (
                          <tr key={index}>
                            <td>{name}</td>
                            <td>{description}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                  {tool.keyFeatures && tool.keyFeatures.length > 2 && (
                    <Button
                      variant="link"
                      size="sm"
                      className="ps-0 pt-1"
                      style={{ fontSize: "0.85rem" }}
                      onClick={() =>
                        setExpandedFeatures((prev) => ({
                          ...prev,
                          [tool._id]: !prev[tool._id],
                        }))
                      }
                    >
                      {expandedFeatures[tool._id]
                        ? "Show less ▲"
                        : "Show more ▼"}
                    </Button>
                  )}
                </td>
                <td>{tool.tags.join(", ")}</td>
                <td>
                  <div className="d-flex gap-2 flex-wrap">
                    <Button
                      variant="outline-warning"
                      size="sm"
                      onClick={() => setEditTool(tool)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(tool._id)}
                    >
                      Delete
                    </Button>
                    <Button
                      variant={
                        compareTools.find((t) => t._id === tool._id)
                          ? "dark"
                          : "outline-info"
                      }
                      size="sm"
                      onClick={() => toggleCompare(tool)}
                    >
                      {compareTools.find((t) => t._id === tool._id)
                        ? "✓ Selected"
                        : "Compare"}
                    </Button>
                    <Button
                      variant="outline-info"
                      size="sm"
                      disabled={aiLoadingId === tool._id}
                      onClick={() => handleGenerateKeyFeatures(tool)}
                    >
                      {aiLoadingId === tool._id
                        ? "Generating..."
                        : "Key Features (AI)"}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Comparison Section */}
      {compareTools.length >= 2 && (
        <div className="mt-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h4 className="mb-0">Tool Comparison</h4>
            <div className="d-flex gap-2">
              <Button
                variant="outline-success"
                size="sm"
                onClick={() =>
                  exportTableAsPDF("combined-comparison", "FullComparison.pdf")
                }
              >
                📄 Export Full PDF
              </Button>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={exportAllTablesAsCSV}
              >
                📥 Export CSV
              </Button>

              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => {
                  setCompareTools([]);
                  setFeatureTable("");
                  setSimilarTable("");
                }}
              >
                ❌
              </Button>
            </div>
          </div>

          <div id="combined-comparison">
            {/* Basic Comparison Table */}
            <div className="mb-5">
              <h5 className="mb-2">Basic Comparison</h5>
              <div id="basic-comparison">
                <Table bordered responsive className="text-start">
                  <thead>
                    <tr>
                      <th>Property</th>
                      {compareTools.map((tool) => (
                        <th key={tool._id}>{tool.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Vendor</td>
                      {compareTools.map((tool) => (
                        <td key={tool._id}>{tool.vendor}</td>
                      ))}
                    </tr>
                    <tr>
                      <td>Deployed</td>
                      {compareTools.map((tool) => (
                        <td key={tool._id}>{tool.deployed ? "Yes" : "No"}</td>
                      ))}
                    </tr>
                    <tr>
                      <td>Tags</td>
                      {compareTools.map((tool) => (
                        <td key={tool._id}>{tool.tags.join(", ")}</td>
                      ))}
                    </tr>
                  </tbody>
                </Table>
              </div>
            </div>

            {/* Key Features Table */}
            <div className="mb-5">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h4 className="mb-0">🔑 Key Features</h4>
              </div>
              <div id="key-features">
                {featureTableLoading ? (
                  <div className="text-center py-4">
                    <Spinner animation="border" variant="primary" />
                    <div className="mt-2">Loading Key Features...</div>
                  </div>
                ) : (
                  <>
                    {renderMarkdownTable(featureTable)}
                    <div className="text-success small text-end mt-2"></div>
                  </>
                )}
              </div>
            </div>

            {/* Similar Products Table */}
            <div className="mb-5">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h4 className="mb-0">🧩 Similar Products</h4>
              </div>
              <div id="similar-products">
                {similarTableLoading ? (
                  <div className="text-center py-4">
                    <Spinner animation="border" variant="success" />
                    <div className="mt-2">Loading Similar Products...</div>
                  </div>
                ) : (
                  <>
                    {renderMarkdownTable(similarTable)}
                    <div className="text-success small text-end mt-2"></div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Tool Modal */}
      <AddToolModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onToolAdded={handleAddTool}
      />

      {/* Edit Tool Modal */}
      {editTool && (
        <EditToolModal
          show={!!editTool}
          onClose={() => setEditTool(null)}
          tool={editTool}
          onSave={handleUpdate}
        />
      )}
      {/* ✅ Responsive Floating ChatBox */}
      <div
        className="chat-box shadow"
        style={{
          position: "fixed",
          bottom: "100px",
          right: "30px",
          width: "100%",
          maxWidth: "420px",
          height: "600px",
          maxHeight: "80vh",
          backgroundColor: "#fff",
          border: "1px solid #ccc",
          borderRadius: "15px",
          display: showChat ? "flex" : "none",
          flexDirection: "column",
          zIndex: 9999,
          boxShadow: "0 0 20px rgba(0,0,0,0.2)",
        }}
      >
        {/* Header */}
        <div
          className="chat-header d-flex justify-content-between align-items-center p-2"
          style={{
            backgroundColor: "#0d6efd",
            color: "white",
            borderTopLeftRadius: "15px",
            borderTopRightRadius: "15px",
          }}
        >
          <div className="d-flex align-items-center gap-2">
            <span style={{ fontSize: "20px" }}>🤖</span>
            <strong>Chat with AI</strong>
          </div>
          <Button variant="light" size="sm" onClick={() => setShowChat(false)}>
            ✖
          </Button>
        </div>

        {/* Messages */}
        <div
          className="chat-messages p-2"
          style={{
            overflowY: "auto",
            flex: 1,
            fontSize: "14px",
            backgroundColor: "#f9f9f9",
          }}
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`mb-2 ${
                msg.sender === "user" ? "text-end" : "text-start"
              }`}
            >
              <span
                className={`d-inline-block p-2 rounded ${
                  msg.sender === "user" ? "bg-primary text-white" : "bg-light"
                }`}
                style={{ maxWidth: "80%", wordWrap: "break-word" }}
              >
                {msg.text}
              </span>
            </div>
          ))}
          {chatLoading && (
            <div className="text-muted text-center">Bot is typing...</div>
          )}
          <div ref={chatBottomRef} />
        </div>

        {/* Input */}
        <InputGroup className="p-2 border-top">
          <Form.Control
            placeholder="Ask something..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleChatSubmit()}
          />
          <Button
            variant="primary"
            onClick={handleChatSubmit}
            disabled={chatLoading}
          >
            Send
          </Button>
        </InputGroup>
      </div>
      {/* ✅ Glossy Floating Chat Button with Left Message and Right Icon */}
      <div
        style={{
          position: "fixed",
          bottom: "30px",
          right: "15px",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          zIndex: 9999,
        }}
      >
        {/* Glossy Hover Message - LEFT SIDE */}
        <div
          className="chat-hover-msg"
          style={{
            background: "linear-gradient(135deg, #00c6ff, #0072ff)",
            color: "white",
            padding: "8px 16px",
            borderRadius: "25px",
            marginRight: "10px",
            opacity: 0,
            transform: "translateY(-10px)",
            transition: "all 0.3s ease",
            fontWeight: "600",
            fontSize: "16px",
            whiteSpace: "nowrap",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
          id="chat-msg"
        >
          💬 Chat with AI
        </div>

        {/* 🤖 Chat Icon - RIGHT SIDE */}
        <div
          onMouseEnter={() =>
            (document.getElementById("chat-msg").style.opacity = "1")
          }
          onMouseLeave={() =>
            (document.getElementById("chat-msg").style.opacity = "0")
          }
          onClick={() => setShowChat(true)}
          style={{
            backgroundColor: "#0d6efd",
            color: "white",
            borderRadius: "50%",
            width: "60px",
            height: "60px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "28px",
            boxShadow: "0 0 15px rgba(0,0,0,0.4)",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          title="Chat with AI"
        >
          🤖
        </div>
      </div>
    </Container>
  );
}

export default AdminPanel;
