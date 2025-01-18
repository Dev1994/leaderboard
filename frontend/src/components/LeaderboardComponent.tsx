import {useState} from "react";
import _ from "lodash";
import {usePlayersQuery} from "../hooks/use-players-query.ts";
import {Leaderboard} from "../entities/leaderboard.ts";
import {PlayerComponent} from "./PlayerComponent.tsx";
import {usePlayersMutation} from "../hooks/use-player-mutations.ts";

export function LeaderboardComponent() {
    const [leaderboard] = useState(setLeaderBoard());

    function setLeaderBoard() {
        return {
            name: "Push-up Leaderboard",
            players: []
        } as Leaderboard;
    }

    const {data: players, isLoading: isPlayersLoading} = usePlayersQuery();
    const mutation = usePlayersMutation();

    if (players) {
        leaderboard.players = players;
    }

    function renderRows() {
        leaderboard.players = _.orderBy(leaderboard.players, ['pushUps'], ['desc']);

        return leaderboard.players.map((player, index) => (
            <tr key={index}>
                <td>{index + 1}</td>
                <PlayerComponent player={player}/>
            </tr>
        ));
    }

    if (isPlayersLoading) {
        return <h1>Loading...</h1>;
    }

    return (
        <>
            <h1>{leaderboard.name}</h1>
            <button onClick={() => mutation.mutate(leaderboard.players)}>Update JSON</button>
            <table>
                <thead>
                <tr>
                    <th>Position</th>
                    <th>Player</th>
                    <th>Push-ups</th>
                </tr>
                </thead>
                <tbody>
                {renderRows()}
                </tbody>
            </table>
        </>
    )
}