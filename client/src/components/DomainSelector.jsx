// src/components/DomainSelector.jsx
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const DOMAIN_OPTIONS = [
  { label: "All Domains", value: "all" },
  { label: "Web", value: "web" },
  { label: "Cloud", value: "cloud" },
  { label: "Database", value: "database" },
  { label: "AI & ML", value: "ai" },
  { label: "Networking", value: "network" },
  { label: "Mobile Apps", value: "mobile" },
  // Add other domains here as needed
];


export default function DomainSelector() {
  const navigate = useNavigate();
  const { domain } = useParams();

  const handleChange = (e) => {
    const selectedDomain = e.target.value;
    if (selectedDomain === "all") {
      navigate("/resources");
    } else {
      navigate(`/resources/${selectedDomain}`);
    }
  };

  return (
    <div className="mb-4">
      <label htmlFor="domain-select" className="mr-2 font-semibold">
        Select Domain:
      </label>
      <select
        id="domain-select"
        value={domain || "all"}
        onChange={handleChange}
        className="rounded border px-3 py-2"
      >
        {DOMAIN_OPTIONS.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}
