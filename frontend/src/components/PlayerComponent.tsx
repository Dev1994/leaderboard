import {Player} from "../entities/player.ts";

export function PlayerComponent({player}: { player: Player }) {
    return (
        <>
            <td>{player.name}</td>
            <td>{player.pushUps}</td>
        </>
    )
}