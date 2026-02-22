"use client";

import { useState, useMemo, useEffect } from "react";
import { companies } from "@/lib/mock-data";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getSavedSearches } from "@/lib/storage";
import { saveToLocal } from "@/lib/storage";

export default function CompaniesPage() {
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

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Companies</h2>

      {/* SEARCH + FILTERS */}
      <div className="flex items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search companies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border p-2 rounded-lg flex-1"
        />

        <select value={sector} onChange={(e) => setSector(e.target.value)} className="border p-2 rounded-lg">
          <option value="all">All Sectors</option>
          <option value="AI Infrastructure">AI Infrastructure</option>
          <option value="Fintech">Fintech</option>
          <option value="HealthTech">HealthTech</option>
        </select>

        <select value={stage} onChange={(e) => setStage(e.target.value)} className="border p-2 rounded-lg">
          <option value="all">All Stages</option>
          <option value="Seed">Seed</option>
          <option value="Series A">Series A</option>
        </select>

        <select value={sort} onChange={(e) => setSort(e.target.value)} className="border p-2 rounded-lg">
          <option value="name_asc">Name ↑</option>
          <option value="name_desc">Name ↓</option>
        </select>

        {/* SAVE SEARCH */}
        <button
          onClick={() => {
            const name = prompt("Name this search:");
            if (!name) return;

            const existing = getSavedSearches();
            const newSaved = {
              id: crypto.randomUUID(),
              name,
              query,
              sector,
              stage,
              sort,
              timestamp: new Date().toISOString(),
            };

            saveToLocal("saved_searches", [...existing, newSaved]);
            alert("Search saved!");
          }}
          className="px-4 py-2 bg-black text-white rounded-lg"
        >
          Save Search
        </button>
      </div>

      {/* TABLE */}
      <table className="w-full border rounded-lg bg-white">
        <thead className="bg-gray-100 text-left text-sm">
          <tr>
            <th className="p-3">Name</th>
            <th className="p-3">Sector</th>
            <th className="p-3">Stage</th>
            <th className="p-3">Location</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((c) => (
            <tr key={c.id} className="border-t hover:bg-gray-50">
              <td className="p-3">
                <Link href={`/companies/${c.id}`} className="text-blue-600">
                  {c.name}
                </Link>
              </td>
              <td className="p-3">{c.sector}</td>
              <td className="p-3">{c.stage}</td>
              <td className="p-3">{c.location}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}