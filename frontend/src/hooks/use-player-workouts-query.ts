import { useQuery } from "@tanstack/react-query";
import { Workout } from "../entities/workout.ts";
import { Player } from "../entities/player.ts";

export function usePlayerWorkoutsQuery(player?: Player) {
    return useQuery({
        queryKey: ["player", player?.id, "workouts"],
        queryFn: () => fetchPlayerWorkouts(player),
        enabled: !!player,
        throwOnError: true
    });
}

async function fetchPlayerWorkouts(player?: Player): Promise<Workout[]> {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/players/${player?.id}/workouts`, {method: "GET"});

    if (response.status !== 200) {
        throw new Error("Failed to fetch players");
    }

    const data = await response.json();
    return data.map((workout: Workout) => {
        return {
            ...workout
        };
    }) as Workout[];
}