import { Timestamp } from "next/dist/server/lib/cache-handlers/types";

export type SavedSearch = {
    id: string;
    name: string;
    query: string;
    sector: string;
    stage: string;
    sort: string;
    timestamp: string;
};