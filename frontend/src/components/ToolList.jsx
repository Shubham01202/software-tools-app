import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // 👈 added for page switch

function ToolList() {
  const [tools, setTools] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [deployed, setDeployed] = useState("");
  const [sort, setSort] = useState("");

  const navigate = useNavigate(); // 👈 useNavigate hook

  const fetchTools = async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;
      if (deployed) params.deployed = deployed;
      if (sort) params.sort = sort;

      const res = await axios.get("http://localhost:1000/api/tools", {
        params,
      });
      setTools(res.data);
    } catch (err) {
      console.error("Error fetching tools:", err.message);
    }
  };

  useEffect(() => {
    fetchTools();
  }, [search, category, deployed, sort]);

  return (
    <div className="container mt-4">
      {/* Title + Admin Switch */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Developer Tools</h2>
        <button
          className="btn btn-outline-primary"
          onClick={() => navigate("/admin")}
        >
          Admin Panel
        </button>
      </div>

      {/* Filters */}
      <div className="row mb-4 g-2">
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search tools..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <select
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Editor">Editor</option>
            <option value="DevOps">DevOps</option>
            <option value="Cloud">Cloud</option>
          </select>
        </div>
        <div className="col-md-2">
          <select
            className="form-select"
            value={deployed}
            onChange={(e) => setDeployed(e.target.value)}
          >
            <option value="">All</option>
            <option value="true">Deployed</option>
            <option value="false">Not Deployed</option>
          </select>
        </div>
        <div className="col-md-2">
          <select
            className="form-select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="">Sort</option>
            <option value="asc">Name A-Z</option>
            <option value="desc">Name Z-A</option>
          </select>
        </div>
      </div>

      {/* Cards */}
      <div className="row">
        {tools.length > 0 ? (
          tools.map((tool) => (
            <div className="col-md-4 mb-4" key={tool._id}>
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{tool.name}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">
                    Vendor: {tool.vendor}
                  </h6>
                  <p className="card-text">{tool.description}</p>
                  <p className="mb-1">
                    <strong>Category:</strong> {tool.category}
                  </p>
                  <span
                    className={`badge ${
                      tool.deployed ? "bg-success" : "bg-danger"
                    } mb-2`}
                  >
                    {tool.deployed ? "Deployed" : "Not Deployed"}
                  </span>
                  <div>
                    {tool.tags.map((tag, idx) => (
                      <span key={idx} className="badge bg-secondary me-1">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted">No tools found.</p>
        )}
      </div>
    </div>
  );
}

export default ToolList;
