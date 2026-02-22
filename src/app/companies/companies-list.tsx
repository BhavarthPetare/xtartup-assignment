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
      <h2 className="text-3xl font-bold mb-8 text-white">Companies</h2>

      {/* SEARCH + FILTERS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search companies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="col-span-1 md:col-span-2 border border-slate-600 bg-slate-700/50 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
        />

        <select
          value={sector}
          onChange={(e) => setSector(e.target.value)}
          className="border border-slate-600 bg-slate-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
        >
          <option value="all" className="bg-slate-800 text-white">All Sectors</option>
          {uniqueSectors.map((s) => (
            <option key={s} value={s} className="bg-slate-800 text-white">
              {s}
            </option>
          ))}
        </select>

        <select
          value={stage}
          onChange={(e) => setStage(e.target.value)}
          className="border border-slate-600 bg-slate-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
        >
          <option value="all" className="bg-slate-800 text-white">All Stages</option>
          {uniqueStages.map((s) => (
            <option key={s} value={s} className="bg-slate-800 text-white">
              {s}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border border-slate-600 bg-slate-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
        >
          <option value="name_asc" className="bg-slate-800 text-white">Name (A-Z)</option>
          <option value="name_desc" className="bg-slate-800 text-white">Name (Z-A)</option>
        </select>
      </div>

      {/* SAVE SEARCH */}
      <button
        onClick={handleSaveSearch}
        className="mb-6 px-6 py-2 bg-linear-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 font-semibold"
      >
        Save This Search
      </button>

      {/* RESULTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((company) => (
          <Link key={company.id} href={`/companies/${company.id}`}>
            <div className="p-4 bg-slate-700/50 border border-slate-600 rounded-lg hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 cursor-pointer">
              <h3 className="font-semibold text-lg text-white">{company.name}</h3>
              <p className="text-sm text-slate-300">{company.sector}</p>
              <p className="text-xs text-slate-400">{company.stage}</p>
              <p className="text-xs text-slate-400 mt-1">{company.location}</p>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-slate-400 mt-8">No companies found.</p>
      )}
    </div>
  );
}
