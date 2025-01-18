import express, {Request, Response} from 'express';
import fs from 'fs';

const app = express();
const port = process.env.PORT || 3002;

app.use((_: any, res: any, next: any) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.get("/", (_: Request, res: Response) => {
    res.send("Healthy");
});

app.get("/players", (_: Request, res: Response) => {
    res.send(require("./assets/data.json"));
});

app.put("/players", (req: Request, res: Response) => {
    console.log(req.body);
    try {
        fs.writeFileSync("./src/assets/data.json", JSON.stringify(req.body));
        res.send("OK");
    } catch (error) {
        res.send("Error");
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});