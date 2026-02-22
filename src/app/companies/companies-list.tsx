"use client";

import { useState, useMemo, useEffect } from "react";
import { companies } from "@/lib/mock-data";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getSavedSearches } from "@/lib/storage";
import { saveToLocal } from "@/lib/storage";

export function CompaniesList() {
  const [query, setQuery] = useState("");
  const [sector, setSector] = useState("all");
  const [stage, setStage] = useState("all");
  const [sort, setSort] = useState("name_asc");

  const params = useSearchParams();
  const runId = params.get("run");

  // Load saved search
  useEffect(() => {
    if (runId) {
      const saved = getSavedSearches();
      const found = saved.find((s) => s.id === runId);
      if (found) {
        setQuery(found.query);
        setSector(found.sector);
        setStage(found.stage);
        setSort(found.sort);
      }
    }
  }, [runId]);

  const filtered = useMemo(() => {
    let result = [...companies];

    if (query) result = result.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()));
    if (sector !== "all") result = result.filter((c) => c.sector === sector);
    if (stage !== "all") result = result.filter((c) => c.stage === stage);

    if (sort === "name_asc") result.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "name_desc") result.sort((a, b) => b.name.localeCompare(a.name));

    return result;
  }, [query, sector, stage, sort]);

  const uniqueSectors = Array.from(new Set(companies.map((c) => c.sector)));
  const uniqueStages = Array.from(new Set(companies.map((c) => c.stage)));

  const handleSaveSearch = () => {
    const name = prompt("Name this search:");
    if (!name) return;

    const saved = getSavedSearches();
    const newSearch = {
      id: Date.now().toString(),
      name,
      query,
      sector,
      stage,
      sort,
      timestamp: new Date().toISOString(),
    };
    saved.push(newSearch);
    saveToLocal("saved_searches", saved);
    alert("Search saved!");
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Companies</h2>

      {/* SEARCH + FILTERS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search companies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="col-span-1 md:col-span-2 border rounded-lg px-3 py-2"
        />

        <select
          value={sector}
          onChange={(e) => setSector(e.target.value)}
          className="border rounded-lg px-3 py-2"
        >
          <option value="all">All Sectors</option>
          {uniqueSectors.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          value={stage}
          onChange={(e) => setStage(e.target.value)}
          className="border rounded-lg px-3 py-2"
        >
          <option value="all">All Stages</option>
          {uniqueStages.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border rounded-lg px-3 py-2"
        >
          <option value="name_asc">Name (A-Z)</option>
          <option value="name_desc">Name (Z-A)</option>
        </select>
      </div>

      {/* SAVE SEARCH */}
      <button
        onClick={handleSaveSearch}
        className="mb-6 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
      >
        Save This Search
      </button>

      {/* RESULTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((company) => (
          <Link key={company.id} href={`/companies/${company.id}`}>
            <div className="p-4 bg-white rounded-lg border hover:shadow-lg transition cursor-pointer">
              <h3 className="font-semibold text-lg">{company.name}</h3>
              <p className="text-sm text-gray-600">{company.sector}</p>
              <p className="text-xs text-gray-500">{company.stage}</p>
              <p className="text-xs text-gray-500 mt-1">{company.location}</p>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-gray-500 mt-8">No companies found.</p>
      )}
    </div>
  );
}
