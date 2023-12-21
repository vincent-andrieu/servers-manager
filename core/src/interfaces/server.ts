import { NonFunctionProperties } from "../utils";

export enum ServerState {
    CREATED = "created",
    RUNNING = "running",
    PAUSED = "paused",
    RESTARTING = "restarting",
    EXITED = "exited",
    REMOVING = "removing",
    DEAD = "dead"
}

export default class Server {

    public id: string;
    public name: string;
    public state: ServerState;
    public status: string;
    public ports: number[];
    public startedAt: Date;
    public finishedAt: Date;

    constructor(obj: NonFunctionProperties<Server>) {
        this.id = obj.id;
        this.name = obj.name;
        this.state = obj.state;
        this.status = obj.status;
        this.ports = obj.ports;
        this.startedAt = new Date(obj.startedAt);
        this.finishedAt = new Date(obj.finishedAt);

        this._validation();
    }

    protected _validation(): void {
        if (typeof this.id !== "string")
            throw new Error("Invalid server ID");
        if (typeof this.name !== "string")
            throw new Error("Invalid server name");
        if (typeof this.state !== "string")
            throw new Error("Invalid server state");
        if (typeof this.status !== "string")
            throw new Error("Invalid server status");
        if (!Array.isArray(this.ports) || this.ports.some((port) => typeof port !== "number"))
            throw new Error("Invalid server ports");
        if (!(this.startedAt instanceof Date))
            throw new Error("Invalid server startedAt");
        if (!(this.finishedAt instanceof Date))
            throw new Error("Invalid server finishedAt");
    }
}