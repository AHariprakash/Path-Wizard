import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import ResourceCard from "../components/ResourceCard.jsx";
import { resources } from "../data/resources.js";

export default function Resources() {
  const { domain } = useParams();
  const currentDomain = domain || "all";

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [difficultyFilter, setDifficultyFilter] = useState("All");

  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      return (
        (currentDomain === "all" || resource.domain === currentDomain) &&
        (typeFilter === "All" || resource.type === typeFilter.toLowerCase()) &&
        (difficultyFilter === "All" || resource.difficulty === difficultyFilter) &&
        resource.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [currentDomain, typeFilter, difficultyFilter, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white border p-6 flex flex-wrap items-center gap-3">
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search resources..."
          className="w-full md:w-72 rounded-xl border px-3 py-2"
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-xl border px-3 py-2"
        >
          <option>All</option>
          <option>Roadmap</option>
          <option>Guide</option>
          <option>Course</option>
          <option>Project</option>
        </select>
        <select
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(e.target.value)}
          className="rounded-xl border px-3 py-2"
        >
          <option>All</option>
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredResources.length === 0 ? (
          <p className="text-center text-gray-500 col-span-full">No resources found.</p>
        ) : (
          filteredResources.map((resource) => (
            <a
              key={resource.id}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <ResourceCard
                title={resource.title}
                tag={resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                description={resource.description}
              />
            </a>
          ))
        )}
      </div>
    </div>
  );
}
