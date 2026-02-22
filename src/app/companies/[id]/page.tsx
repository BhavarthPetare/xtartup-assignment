"use client";

import { useParams } from "next/navigation";
import { companies } from "@/lib/mock-data";
import { loadFromLocal, saveToLocal } from "@/lib/storage";
import { getLists, saveLists } from "@/lib/storage";
import { useState, useEffect } from "react";

export default function CompanyProfile() {
  const { id } = useParams();
  const company = companies.find((c) => c.id === id);

  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [enriched, setEnriched] = useState<any>(null);
  const [error, setError] = useState("");
  const [showListModal, setShowListModal] = useState(false);
  const [lists, setLists] = useState<any[]>([]);
  const [listSuccess, setListSuccess] = useState("");

  useEffect(() => {
    if (company) {
      const saved = loadFromLocal<string>(`notes_${company.id}`);
      if (saved) setNotes(saved);
    }
  }, [company]);

  useEffect(() => {
    const cached = loadFromLocal(`enrich_${company?.id}`);
    setEnriched(cached || null);
    setError("");
  }, [company]);

  const handleSaveNotes = () => {
    if (company) {
      saveToLocal(`notes_${company.id}`, notes);
    }
  };

  const handleEnrich = async () => {
    if (!company) return;

    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/enrich", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({url: company.website}),
      });
      const data = await res.json();
      
      if (data.error) {
        setError(data.error + (data.details ? ": " + data.details : ""));
      } else if (res.ok && data.summary) {
        setEnriched(data);
        saveToLocal(`enrich_${company.id}`, data);
      } else {
        setError("Failed to enrich: Invalid response format");
      }
    } catch (error) {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (!company) {
    return <div className="text-red-400">Company not found.</div>;
  }

  return (
    <div className="space-y-8">
      <h2 className="text-4xl font-bold text-white">{company.name}</h2>

      {/* OVERVIEW */}
      <section className="bg-slate-700/50 border border-slate-600 p-6 rounded-lg space-y-2">
        <h3 className="text-lg font-semibold text-white">Overview</h3>
        <p className="text-slate-200"><strong>Website:</strong> <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300">{company.website}</a></p>
        <p className="text-slate-200"><strong>Sector:</strong> {company.sector}</p>
        <p className="text-slate-200"><strong>Stage:</strong> {company.stage}</p>
        <p className="text-slate-200"><strong>Location:</strong> {company.location}</p>
        <p className="text-slate-300">{company.description}</p>
      </section>

      {/* NOTES */}
      <section className="bg-slate-700/50 border border-slate-600 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-2 text-white">Notes</h3>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full h-40 border border-slate-600 bg-slate-800/50 rounded-lg p-3 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
        />
        <button
          onClick={handleSaveNotes}
          className="mt-3 px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 font-semibold"
        >
          Save Notes
        </button>
      </section>

      {/* SAVE TO LIST */}
      <section className="bg-slate-700/50 border border-slate-600 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-3 text-white">Save to List</h3>
        <button
          onClick={() => {
            const allLists = getLists();
            setLists(allLists);
            setListSuccess("");
            setShowListModal(true);
          }}
          className="px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 font-semibold"
        >
          Add to List
        </button>

        {listSuccess && (
          <div className="mt-4 p-3 bg-green-500/30 text-green-300 rounded border border-green-500/50">
            {listSuccess}
          </div>
        )}
      </section>

      {/* LIST SELECTION MODAL */}
      {showListModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-slate-800 border border-slate-600 rounded-lg p-6 w-96 max-h-96 overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-white">Select a List</h2>
            
            {lists.length === 0 ? (
              <p className="text-slate-400">No lists available. Create one first.</p>
            ) : (
              <div className="space-y-2">
                {lists.map((list) => (
                  <button
                    key={list.id}
                    onClick={() => {
                      if (!list.companyIds.includes(company.id)) {
                        list.companyIds.push(company.id);
                        saveLists(lists);
                        setListSuccess(`Added to list: ${list.name}`);
                      } else {
                        setListSuccess(`Already in list: ${list.name}`);
                      }
                      setShowListModal(false);
                    }}
                    className="w-full text-left p-3 border border-slate-600 bg-slate-700/30 rounded-lg hover:bg-slate-700/60 hover:border-cyan-500/50 transition text-white"
                  >
                    <p className="font-semibold">{list.name}</p>
                    <p className="text-sm text-slate-400">{list.companyIds.length} companies</p>
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={() => setShowListModal(false)}
              className="w-full mt-4 px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ENRICHMENT Placeholder */}
      <section className="bg-slate-700/50 border border-slate-600 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-3 text-white">Enrichment</h3>
        <button
          onClick={handleEnrich}
          disabled={loading} 
          className="px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 font-semibold disabled:opacity-50"
        >
          {loading ? "Enriching..." : "Enrich Company"}
        </button>

        {error && (
          <div className="mt-4 p-3 bg-red-500/30 text-red-300 rounded border border-red-500/50">
            {error}
          </div>
        )}

        {enriched && (
          <div className="mt-6 space-y-4">

            {/* SUMMARY */}
            {enriched.summary && (
              <p className="text-slate-200"><strong className="text-white">Summary:</strong> {enriched.summary}</p>
            )}

            {/* WHAT THEY DO */}
            {Array.isArray(enriched.bullets) && (
              <div>
                <strong className="text-white block mb-2">What They Do:</strong>
                <ul className="list-disc ml-6 text-slate-200 space-y-1">
                  {enriched.bullets.map((b: string, idx: number) => (
                    <li key={idx}>{b}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* KEYWORDS */}
            {Array.isArray(enriched.keywords) && (
              <div>
                <strong className="text-white block mb-2">Keywords:</strong>
                <div className="flex flex-wrap gap-2 mt-1">
                  {enriched.keywords.map((k: string) => (
                    <span key={k} className="px-3 py-1 bg-cyan-500/30 text-cyan-300 rounded-full text-sm border border-cyan-500/50">
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* SIGNALS */}
            {Array.isArray(enriched.signals) && (
              <div>
                <strong className="text-white block mb-2">Signals:</strong>
                <ul className="list-disc ml-6 text-slate-200 space-y-1">
                  {enriched.signals.map((s: string, idx: number) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* SOURCES */}
            {Array.isArray(enriched.sources) && (
              <div>
                <strong className="text-white block mb-2">Sources:</strong>
                <ul className="text-sm ml-6 text-slate-400 space-y-1">
                  {enriched.sources.map((src: any, i: number) => (
                    <li key={i}>
                      <a href={src.url} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300">{src.url}</a> — <span className="text-slate-500">{src.timestamp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        )}
      </section>
    </div>
  );
}