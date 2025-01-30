import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Player } from "../entities/player.ts";
import { Workout } from "../entities/workout.ts";

export function useAddWorkoutMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["player"],
        mutationFn: ({player, pushUps}: { player: Player; pushUps: number }) => addWorkout(player, pushUps),
        onSuccess: async (workout: Workout) => {
            await queryClient.invalidateQueries({queryKey: ["player", workout.playerId]});
        },
        onError: (error) => {
            console.error("Error incrementing push-up", error);
        }
    })
}

async function addWorkout(player: Player, pushUps: number) {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/workouts/add/${player.id}/${pushUps}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (response.status !== 200) {
        throw new Error("Failed to add workout");
    }

    return await response.json() as Workout;
}