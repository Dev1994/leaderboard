import { Player } from "../entities/player.ts";
import { useIncrementPlayerPushUpMutation } from "../hooks/use-increment-player-push-up-mutation.ts";

export function PlayerComponent({player}: { player: Player }) {
    const mutation = useIncrementPlayerPushUpMutation();

    if (mutation.isPending) {
        return <td>Loading...</td>;
    }

    return (
        <>
            <td>{player.name}</td>
            <td>{player.pushUps}</td>
            <td>
                <button onClick={() => mutation.mutate(player)}>+1</button>
            </td>
        </>
    )
}