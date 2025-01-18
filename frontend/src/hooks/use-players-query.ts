import {useQuery} from "@tanstack/react-query";
import {Player} from "../entities/player.ts";

export function usePlayersQuery() {
    return useQuery({
        queryKey: ["players"],
        queryFn: async () => await fetchPlayers(),
        throwOnError: true
    });
}

async function fetchPlayers() {
    const response = await fetch("http://localhost:3002/players", {method: "GET"});

    if (response.status !== 200) {
        throw new Error("Failed to fetch players");
    }

    const data = await response.json();
    return data.players as Player[];
}