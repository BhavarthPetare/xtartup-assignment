import { CompanyList } from "@/types/list";
import { SavedSearch } from "@/types/saved-search";

export function saveToLocal<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadFromLocal<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
}

export function getLists(): CompanyList[] {
    return loadFromLocal<CompanyList[]>("lists") || [];
}

export function saveLists(lists: CompanyList[]) {
    saveToLocal("lists", lists);
}

export function getSavedSearches(): SavedSearch[] {
  return loadFromLocal<SavedSearch[]>("saved_searches") || [];
}

export function saveSavedSearches(searches: SavedSearch[]) {
  saveToLocal("saved_searches", searches);
}