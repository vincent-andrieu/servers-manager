import { Docker } from "node-docker-api";

import { Server } from "core";

export default class DockerService {
    private _docker = new Docker({ socketPath: '/var/run/docker.sock' });

    public async containerList(): Promise<Array<Server>> {
        const containers = await this._docker.container.list();

        return await Promise.all(containers.map(async (container) => {
            const state = (((await (container.status())).data as any).State);

            return new Server({
                id: container.id,
                name: (container.data as any).Names[0].slice(1),
                state: (container.data as any).State,
                status: (container.data as any).Status,
                ports: (container.data as any).Ports.map((port: any) => port.PublicPort),
                startedAt: state.StartedAt,
                finishedAt: state.FinishedAt
            });
        }));
    }
}