import {Player} from "./player.ts";

export interface Leaderboard {
    name: string;
    players: Player[];
}