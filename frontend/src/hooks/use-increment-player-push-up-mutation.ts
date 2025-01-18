import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Player } from "../entities/player.ts";

export function useIncrementPlayerPushUpMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["player"],
        mutationFn: incrementPushUp,
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ["players"]});
        },
        onError: (error) => {
            console.error("Error incrementing push-up", error);
        }
    })
}

async function incrementPushUp(player: Player) {
    return await fetch(`http://localhost:3002/players/add-push-up/${player.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        }
    });
}