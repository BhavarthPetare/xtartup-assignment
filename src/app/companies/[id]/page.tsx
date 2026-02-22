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
    return <div className="text-red-600">Company not found.</div>;
  }

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold">{company.name}</h2>

      {/* OVERVIEW */}
      <section className="bg-white p-6 rounded-lg border space-y-2">
        <h3 className="text-lg font-semibold">Overview</h3>
        <p><strong>Website:</strong> {company.website}</p>
        <p><strong>Sector:</strong> {company.sector}</p>
        <p><strong>Stage:</strong> {company.stage}</p>
        <p><strong>Location:</strong> {company.location}</p>
        <p className="text-gray-600">{company.description}</p>
      </section>

      {/* NOTES */}
      <section className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-2">Notes</h3>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full h-40 border rounded-lg p-3"
        />
        <button
          onClick={handleSaveNotes}
          className="mt-3 px-4 py-2 bg-black text-white rounded-lg"
        >
          Save Notes
        </button>
      </section>

      {/* SAVE TO LIST */}
      <section className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-3">Save to List</h3>
        <button
          onClick={() => {
            const allLists = getLists();
            setLists(allLists);
            setListSuccess("");
            setShowListModal(true);
          }}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg"
        >
          Add to List
        </button>

        {listSuccess && (
          <div className="mt-4 p-3 bg-green-100 text-green-700 rounded border border-green-300">
            {listSuccess}
          </div>
        )}
      </section>

      {/* LIST SELECTION MODAL */}
      {showListModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-h-96 overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Select a List</h2>
            
            {lists.length === 0 ? (
              <p className="text-gray-600">No lists available. Create one first.</p>
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
                    className="w-full text-left p-3 border rounded-lg hover:bg-gray-100 transition"
                  >
                    <p className="font-semibold">{list.name}</p>
                    <p className="text-sm text-gray-600">{list.companyIds.length} companies</p>
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={() => setShowListModal(false)}
              className="w-full mt-4 px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ENRICHMENT Placeholder */}
      <section className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-3">Enrichment</h3>
        <button
          onClick={handleEnrich}
          disabled={loading} 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          {loading ? "Enriching..." : "Enrich Company"}
        </button>

        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded border border-red-300">
            {error}
          </div>
        )}

        {enriched && (
          <div className="mt-6 space-y-4">

            {/* SUMMARY */}
            {enriched.summary && (
              <p><strong>Summary:</strong> {enriched.summary}</p>
            )}

            {/* WHAT THEY DO */}
            {Array.isArray(enriched.bullets) && (
              <div>
                <strong>What They Do:</strong>
                <ul className="list-disc ml-6">
                  {enriched.bullets.map((b: string, idx: number) => (
                    <li key={idx}>{b}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* KEYWORDS */}
            {Array.isArray(enriched.keywords) && (
              <div>
                <strong>Keywords:</strong>
                <div className="flex flex-wrap gap-2 mt-1">
                  {enriched.keywords.map((k: string) => (
                    <span key={k} className="px-2 py-1 bg-gray-100 rounded">
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* SIGNALS */}
            {Array.isArray(enriched.signals) && (
              <div>
                <strong>Signals:</strong>
                <ul className="list-disc ml-6">
                  {enriched.signals.map((s: string, idx: number) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* SOURCES */}
            {Array.isArray(enriched.sources) && (
              <div>
                <strong>Sources:</strong>
                <ul className="text-sm ml-6 text-gray-600">
                  {enriched.sources.map((src: any, i: number) => (
                    <li key={i}>
                      {src.url} — <span>{src.timestamp}</span>
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