export class Player {
    public id: number;
    public name: string;
    public pushUps: number;

    constructor(name: string, pushUps: number) {
        this.id = Math.floor(Math.random() * 1000);
        this.name = name;
        this.pushUps = pushUps;
    }
}