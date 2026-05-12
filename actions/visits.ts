"use server";

import { getVisitStats as getStats } from "@/lib/visits";
import { verifySession } from "@/lib/auth";

export type VisitStats = {
  totalVisits: number;
  uniqueVisitors: number;
  lastVisited: string | null;
  recentVisitors: {
    ipHash: string;
    visits: number;
    lastSeen: string;
    firstSeen: string;
  }[];
};

export async function getVisitStats(): Promise<VisitStats> {
  const authenticated = await verifySession();
  if (!authenticated) {
    return { totalVisits: 0, uniqueVisitors: 0, lastVisited: null, recentVisitors: [] };
  }

  return await getStats();
}
