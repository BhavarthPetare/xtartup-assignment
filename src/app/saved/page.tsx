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
            <h2 className="text-2xl font-semibold">Saved Searches</h2>
            {searches.length === 0 ? (
                <div className="text-gray-500">No saved searches yet.</div>
            ) : (
                <table className="w-full border rounded-lg bg-white">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 text-left">Name</th>
                            <th className="p-3 text-left">Query</th>
                            <th className="p-3 text-left">Filters</th>
                            <th className="p-3 text-left">Run</th>
                        </tr>
                    </thead>
                    <tbody>
                        {searches.map((s) => (
                            <tr key={s.id} className="border-t hover:bg-gray-50">
                                <td className="p-3">{s.name}</td>
                                <td className="p-3">{s.query || "(empty)"}</td>
                                <td className="p-3">
                                    {s.sector !== "all" && `Sector: ${s.sector}`}
                                    {s.stage !== "all" && `Stage: ${s.stage}`}
                                </td>
                                <td className="p-3">
                                    <Link
                                        href={`/companies?run=${s.id}`}
                                        className="text-blue-600 font-medium"
                                    >
                                        Run
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