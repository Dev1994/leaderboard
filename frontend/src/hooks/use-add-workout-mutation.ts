import {useMutation, useQueryClient} from "@tanstack/react-query";
import {Player} from "../entities/player.ts";

export function useAddWorkoutMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["player"],
        mutationFn: ({player, pushUps}: { player: Player; pushUps: number }) => addWorkout(player, pushUps),
        onSuccess: async (updatedPlayer: Player) => {
            queryClient.setQueryData(["players"], (oldPlayers: Player[]) => {
                return oldPlayers.map((oldPlayer) => {
                    if (oldPlayer.id === updatedPlayer.id) {
                        return updatedPlayer;
                    }

                    return oldPlayer;
                });
            });
            queryClient.setQueryData(["player", updatedPlayer.id], updatedPlayer);
        },
        onError: (error) => {
            console.error("Error incrementing push-up", error);
        }
    })
}

async function addWorkout(player: Player, pushUps: number) {
    const response = await fetch(`http://localhost:3002/workouts/add/${player.id}/${pushUps}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (response.status !== 200) {
        throw new Error("Failed to add workout");
    }

    const updatedPlayer: Player = await response.json();
    return updatedPlayer;
}