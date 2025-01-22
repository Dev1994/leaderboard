import { useQuery } from "@tanstack/react-query";
import { Player } from "../entities/player.ts";

export function usePlayerQuery(playerId: string) {
    return useQuery({
        queryKey: ["player", playerId],
        queryFn: () => fetchPlayer(playerId),
        throwOnError: true
    });
}

async function fetchPlayer(playerId: string): Promise<Player> {
    const response = await fetch(`http://localhost:3002/players/${playerId}`, {method: "GET"});

    if (response.status !== 200) {
        throw new Error("Failed to fetch players");
    }

    const data = await response.json();
    return data as Player;
}