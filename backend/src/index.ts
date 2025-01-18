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

app.get("/", (_: Request, res: Response) => {
    res.send("Healthy");
});

app.get("/players", (_: Request, res: Response) => {
    res.send(data);
});

app.put("/players/add-push-up/:id", (req: Request, res: Response) => {
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
        fs.writeFileSync("./src/assets/data.json", JSON.stringify(data));
        res.send("OK");
    } catch (error) {
        res.send("Error");
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});