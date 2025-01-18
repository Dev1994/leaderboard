import {useMutation} from "@tanstack/react-query";
import {Player} from "../entities/player.ts";

export function usePlayersMutation() {
    return useMutation({
        mutationKey: ["player"],
        mutationFn: async (players: Player[]) => {
            // Call node server to update JSON
        },
        onError: (error) => {
            console.error("Error updating JSON", error);
        }
    })
}