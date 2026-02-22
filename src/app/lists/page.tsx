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
      <h2 className="text-2xl font-semibold">Lists</h2>

      {/* CREATE NEW LIST */}
      <div className="flex gap-3">
        <input
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          placeholder="New list name..."
          className="border p-2 rounded-lg flex-1"
        />
        <button
          onClick={createList}
          className="px-4 py-2 bg-black text-white rounded-lg"
        >
          Create
        </button>
      </div>

      {/* LISTS TABLE */}
      {lists.length === 0 ? (
        <div className="text-gray-500">No lists yet.</div>
      ) : (
        <table className="w-full border bg-white rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">List Name</th>
              <th className="p-3 text-left">Companies</th>
            </tr>
          </thead>
          <tbody>
            {lists.map((list) => (
              <tr key={list.id} className="border-t hover:bg-gray-50">
                <td className="p-3">
                  <Link
                    href={`/lists/${list.id}`}
                    className="text-blue-600 font-medium"
                  >
                    {list.name}
                  </Link>
                </td>
                <td className="p-3">{list.companyIds.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}