import express, { Request, Response } from 'express';
import { Player } from "./DTOs/player";
import * as fs from "node:fs";

// Define the path to the data file
const dataFilePath = "./assets/data.json";  // Adjust this to where the file is expected to be

// Function to check if the file can be accessed
async function checkFileAccess(filePath: string): Promise<boolean> {
    try {
        await fs.promises.access(filePath, fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK);
        console.log(`File ${filePath} is accessible for reading and writing.`);
        return true;
    } catch (error) {
        console.error(`Error accessing file ${filePath}:`, error);
        return false;
    }
}

(async () => {
    // Check if the data.json file can be accessed on startup
    const fileIsAccessible = await checkFileAccess(dataFilePath);

    if (!fileIsAccessible) {
        console.error("Unable to access data.json. Please check permissions and file path.");
    }

    // Proceed with the rest of the application if the file is accessible
    const app = express();
    const port = process.env.PORT || 3000;

    app.use(express.json());

    app.use((_: any, res: any, next: any) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        next();
    });

    let data = require(dataFilePath);

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
                await fs.promises.writeFile(dataFilePath, JSON.stringify(data));
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
})();
