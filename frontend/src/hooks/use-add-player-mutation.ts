import {useMutation, useQueryClient} from "@tanstack/react-query";
import {Player} from "../entities/player.ts";

export function useAddPlayerMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["player"],
        mutationFn: (name: string) => addPlayer(name),
        onSuccess: async (newPlayer: Player) => {
            queryClient.setQueryData(["players"], (oldPlayers: Player[]) => {
                return [...oldPlayers, newPlayer];
            });
        },
        onError: (error) => {
            console.error("Error adding player", error);
        }
    });

    async function addPlayer(name: string) {
        if (!name) {
            throw new Error("Name is required");
        }
        
        const response = await fetch(`http://localhost:3002/players/add/${name}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (response.status !== 200) {
            throw new Error("Failed to add player");
        }

        const newPlayer: Player = await response.json();
        return newPlayer;
    }
}