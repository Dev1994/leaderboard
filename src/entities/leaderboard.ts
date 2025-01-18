import {Player} from "./player.ts";

export class Leaderboard {
    public name: string;
    public players: Player[];

    constructor(name: string) {
        this.name = name;
        this.players = [];
    }

    addPlayer(name: string, score: number) {
        this.players.push(new Player(name, score));
    }
}