import TemplateObject, { NonTemplateObjectFunctions } from "./templateObject";

export default class User extends TemplateObject {

    public auth?: {
        sources: {
            discord: {
                registrationDate: Date;
                id: string;
            };
        };
    };

    constructor(obj: NonTemplateObjectFunctions<User>) {
        super(obj);

        // Auth
        if (obj.auth)
            this.auth = {
                sources: {
                    discord: {
                        registrationDate: new Date(obj.auth.sources.discord.registrationDate),
                        id: obj.auth.sources.discord.id
                    }
                }
            };

        this._validation();
    }

    protected _validation(): void {
        // Auth
        if (this.auth)
            if (!this.auth.sources.discord ||
                !(this.auth.sources.discord.registrationDate instanceof Date) ||
                this.auth.sources.discord.registrationDate.getTime() > Date.now() ||
                typeof this.auth.sources.discord.id !== "string")
                throw new Error("Invalid discord authentification");
    }
}