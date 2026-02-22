"use client";

import { getSavedSearches } from "@/lib/storage";
import { useEffect, useState } from "react";
import Link from "next/link";
import { SavedSearch } from "@/types/saved-search";
import { table } from "console";

export default function SavedSearchesPage() {
    const [searches, setSearches] = useState<SavedSearch[]>([]);

    useEffect(() => {
        setSearches(getSavedSearches());
    }, []);

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Saved Searches</h2>
            {searches.length === 0 ? (
                <div className="text-slate-400">No saved searches yet.</div>
            ) : (
                <table className="w-full border border-slate-600 rounded-lg bg-slate-700/50">
                    <thead className="bg-slate-700/80 border-b border-slate-600">
                        <tr>
                            <th className="p-3 text-left text-white font-semibold">Name</th>
                            <th className="p-3 text-left text-white font-semibold">Query</th>
                            <th className="p-3 text-left text-white font-semibold">Filters</th>
                            <th className="p-3 text-left text-white font-semibold">Run</th>
                        </tr>
                    </thead>
                    <tbody>
                        {searches.map((s) => (
                            <tr key={s.id} className="border-t border-slate-600 hover:bg-slate-600/50 transition">
                                <td className="p-3 text-slate-200">{s.name}</td>
                                <td className="p-3 text-slate-300">{s.query || <span className="text-slate-500 italic">(empty)</span>}</td>
                                <td className="p-3 text-slate-300">
                                    {s.sector !== "all" && <span className="block">{s.sector}</span>}
                                    {s.stage !== "all" && <span className="block">{s.stage}</span>}
                                </td>
                                <td className="p-3">
                                    <Link
                                        href={`/companies?run=${s.id}`}
                                        className="text-cyan-400 hover:text-cyan-300 font-medium transition"
                                    >
                                        Run →
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}