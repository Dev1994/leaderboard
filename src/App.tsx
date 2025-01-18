import './App.css'
import {useState} from "react";
import {Leaderboard} from "./entities/leaderboard.ts";
import _ from "lodash";

function App() {
    const [leaderboard] = useState(setLeaderboard());

    function setLeaderboard() {
        const leaderboard = new Leaderboard("Push-ups Leaderboard");
        leaderboard.addPlayer("Devon", 100);
        leaderboard.addPlayer("Ruan", 200);
        leaderboard.addPlayer("Cariece", 300);
        leaderboard.addPlayer("Anri", 300);
        return leaderboard;
    }

    function renderRows() {
        leaderboard.players = _.orderBy(leaderboard.players, ['pushUps'], ['desc']);

        return leaderboard.players.map((player, index) => (
            <tr key={index}>
                <td>{index + 1}</td>
                <td>{player.name}</td>
                <td>{player.pushUps}</td>
            </tr>
        ));
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
        </>
    )
}

export default App
