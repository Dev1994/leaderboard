import * as React from "react";
import {useState} from "react";
import _ from "lodash";
import {usePlayersQuery} from "../hooks/use-players-query.ts";
import {Leaderboard} from "../entities/leaderboard.ts";
import {PlayerComponent} from "./PlayerComponent.tsx";
import {useAddPlayerMutation} from "../hooks/use-add-player-mutation.ts";

export function LeaderboardComponent() {
    const [leaderboard] = useState(init());
    const [playerName, setPlayerName] = useState<string>("");

    const addPlayerMutation = useAddPlayerMutation();

    function init() {
        return {
            name: "Push-up Leaderboard",
            players: []
        } as Leaderboard;
    }

    const {data: players, isLoading: isPlayersLoading} = usePlayersQuery();

    if (players) {
        leaderboard.players = players;
    }

    function renderRows() {
        leaderboard.players = _.orderBy(leaderboard.players, ['totalPushUps'], ['desc']);

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

            <h3>Add Player</h3>
            <input type="text" placeholder="Player Name" value={playerName}
                   onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPlayerName(event.target.value)}/>
            <button onClick={() => addPlayerMutation.mutate(playerName)}>Add Player</button>
        </>
    )
}