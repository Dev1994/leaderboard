import {Player} from "../entities/player.ts";
import {useAddWorkoutMutation} from "../hooks/use-add-workout-mutation.ts";

export function PlayerComponent({player}: { player: Player }) {
    const mutation = useAddWorkoutMutation();

    if (mutation.isPending) {
        return <td>Loading...</td>;
    }

    return (
        <>
            <td>{player.name}</td>
            <td>{player.totalPushUps}</td>
            <td>
                <button onClick={() => mutation.mutate({player, pushUps: 1})}>+1</button>
                <button onClick={() => mutation.mutate({player, pushUps: 5})}>+5</button>
                <button onClick={() => mutation.mutate({player, pushUps: 10})}>+10</button>
            </td>
        </>
    )
}