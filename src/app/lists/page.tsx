"use client";

import { useEffect, useState } from "react";
import { getLists, saveLists } from "@/lib/storage";
import { CompanyList } from "@/types/list";
import Link from "next/link";

export default function ListsPage() {
  const [lists, setLists] = useState<CompanyList[]>([]);
  const [newListName, setNewListName] = useState("");

  useEffect(() => {
    setLists(getLists());
  }, []);

  const createList = () => {
    if (!newListName.trim()) return;

    const id = crypto.randomUUID();
    const newList: CompanyList = {
      id,
      name: newListName,
      companyIds: [],
    };

    const updated = [...lists, newList];
    setLists(updated);
    saveLists(updated);
    setNewListName("");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white">Lists</h2>

      {/* CREATE NEW LIST */}
      <div className="flex gap-3">
        <input
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          placeholder="New list name..."
          className="border border-slate-600 bg-slate-700/50 p-3 rounded-lg flex-1 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
        />
        <button
          onClick={createList}
          className="px-6 py-3 bg-linear-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 font-semibold"
        >
          Create
        </button>
      </div>

      {/* LISTS TABLE */}
      {lists.length === 0 ? (
        <div className="text-slate-400">No lists yet.</div>
      ) : (
        <table className="w-full border border-slate-600 bg-slate-700/50 rounded-lg overflow-hidden">
          <thead className="bg-slate-700/80 border-b border-slate-600">
            <tr>
              <th className="p-3 text-left text-white font-semibold">List Name</th>
              <th className="p-3 text-left text-white font-semibold">Companies</th>
            </tr>
          </thead>
          <tbody>
            {lists.map((list) => (
              <tr key={list.id} className="border-t border-slate-600 hover:bg-slate-600/50 transition">
                <td className="p-3">
                  <Link
                    href={`/lists/${list.id}`}
                    className="text-cyan-400 hover:text-cyan-300 font-medium transition"
                  >
                    {list.name}
                  </Link>
                </td>
                <td className="p-3 text-slate-300">{list.companyIds.length} companies</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}