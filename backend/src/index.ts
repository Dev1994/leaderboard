import express, {Request, Response} from 'express';
import {databaseService} from "./database/database-service";

const app = express();
const port = process.env.PORT || 3002;

databaseService.connect();
databaseService.defineModels();
databaseService.sync();

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

app.get("/players", async (_: Request, res: Response) => {
    const players = await databaseService.getPlayers();
    res.send(players);
});

app.get("/players/:id", async (req: Request, res: Response) => {
    let id = req.params["id"] as string;
    const players = await databaseService.getPlayerById(id);
    res.send(players);
});

app.get("/players/:id/workouts", async (req: Request, res: Response) => {
    let id = req.params["id"] as string;
    const workouts = await databaseService.getPlayerWorkouts(id);
    res.send(workouts);
});

app.post("/players/add/:name", async (req: Request, res: Response) => {
    let name = req.params["name"] as string;

    const player = await databaseService.addPlayer(name);
    res.send(player);
});

app.delete("/players/remove/:id", async (req: Request, res: Response) => {
    let id = req.params["id"] as string;

    await databaseService.removePlayer(id);
    res.send("OK");
});

app.post("/workouts/add/:playerId/:pushUps", async (req: Request, res: Response) => {
    let playerId = req.params["playerId"] as string;
    let pushUps = parseInt(req.params["pushUps"] as string);

    const player = await databaseService.getPlayerById(playerId);
    if (!player) {
        res.status(404).send("Player not found");
    }

    let updated = await databaseService.addWorkout(player, pushUps);
    res.send(updated);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});