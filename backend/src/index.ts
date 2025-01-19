import express, { Request, Response } from 'express';
import { Player } from "./DTOs/player";
import * as fs from "node:fs";

let data = require("./assets/data.json");

const app = express();
const port = process.env.PORT || 3002;

app.use(express.json())

app.use((_: any, res: any, next: any) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

const writeQueue: (() => Promise<void>)[] = [];

app.get("/", (_: Request, res: Response) => {
    res.send(200);
});

app.get("/players", (_: Request, res: Response) => {
    res.send(data);
});

function processQueue() {
    if (writeQueue.length === 0) return;

    const writeTask = writeQueue.shift();
    if (writeTask) {
        writeTask().then(() => processQueue());
    }
}

app.put("/players/add-push-up/:id", (req: Request, res: Response) => {
    const writeTask = async () => {
        let player = data.players.find((p: Player) => p.id === Number.parseInt(req.params["id"]));

        if (!player) {
            res.send("Player not found");
            return;
        }

        data.players = data.players.map((p: Player) => {
            if (p.id === player.id) {
                player.pushUps += 1;
                return player;
            }
            return p;
        });

        try {
            await fs.promises.writeFile("./src/assets/data.json", JSON.stringify(data));
            res.send(200);
        } catch (error) {
            res.status(500).send("Error writing to file");
        }
    };

    writeQueue.push(writeTask);
    if (writeQueue.length === 1) processQueue();
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});