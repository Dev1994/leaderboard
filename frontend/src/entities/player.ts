export class Player {
    public id: string;
    public name: string;
    public totalPushUps: number;

    constructor(id: string, name: string, pushUps: number) {
        this.id = id;
        this.name = name;
        this.totalPushUps = pushUps;
    }
}