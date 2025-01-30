import {useQuery} from "@tanstack/react-query";
import {Player} from "../entities/player.ts";
import { DateTime } from "luxon";

export function useLeaderboardQuery(startDate: DateTime, endDate: DateTime) {
    return useQuery({
        queryKey: ["leaderboard", startDate, endDate],
        queryFn: () => fetchLeaderboard(startDate, endDate),
        throwOnError: true
    });
}

async function fetchLeaderboard(startDate: DateTime, endDate: DateTime): Promise<Player[]> {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/leaderboard/${startDate}/${endDate}`, {method: "GET"});

    if (response.status !== 200) {
        throw new Error("Failed to fetch leaderboard");
    }

    const data = await response.json();
    return data as Player[];
}