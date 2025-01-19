import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Player } from "../entities/player.ts";

export function useIncrementPlayerPushUpMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["player"],
        mutationFn: incrementPushUp,
        onSuccess: async (player: Player) => {
            queryClient.setQueryData(["players"], (oldPlayers: Player[]) => {
                return oldPlayers.map((p: Player) => {
                    if (player.id === p.id) {
                        return {
                            ...p,
                            pushUps: p.pushUps + 1
                        } as Player;
                    }
                    return p;
                });
            });
        },
        onError: (error) => {
            console.error("Error incrementing push-up", error);
        }
    })
}

async function incrementPushUp(player: Player) {
    const response = await fetch(`http://localhost:3002/players/add-push-up/${player.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (response.status !== 200) {
        throw new Error("Failed to increment push-up");
    }

    return player;
}