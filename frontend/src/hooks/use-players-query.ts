import {useQuery} from "@tanstack/react-query";
import {Player} from "../entities/player.ts";

export function usePlayersQuery() {
    return useQuery({
        queryKey: ["players"],
        queryFn: fetchPlayers,
        throwOnError: true
    });
}

async function fetchPlayers() {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/players`, {method: "GET"});

    if (response.status !== 200) {
        throw new Error("Failed to fetch players");
    }

    const data = await response.json();
    return data as Player[];
}