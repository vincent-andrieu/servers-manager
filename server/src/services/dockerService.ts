import { Docker } from "node-docker-api";
import { Observable, Subject } from "rxjs";
import { Stream } from "stream";

import { Server } from "core";

export default class DockerService {
    private _docker = new Docker({ socketPath: '/var/run/docker.sock' });

    public async containerList(): Promise<Array<Server>> {
        const containers = await this._docker.container.list({ all: true });

        return await Promise.all(containers.map(async (container) => {
            const status = (((await (container.status())).data as any).State);

            return new Server({
                id: container.id,
                name: (container.data as any).Names[0].slice(1),
                state: (container.data as any).State,
                status: (container.data as any).Status,
                ports: (container.data as any).Ports.map((port: any) => port.PublicPort),
                startedAt: status.StartedAt,
                finishedAt: status.FinishedAt
            });
        }));
    }

    public async listenContainersEvents(): Promise<Observable<unknown>> {
        const eventsSubject = new Subject<unknown>();

        try {
            const stream: Stream = (await this._docker.events({
                filters: {
                    type: ['container']
                }
            })) as Stream;

            stream.on('data', (data) => eventsSubject.next(JSON.parse(data.toString())));
            stream.on('end', () => eventsSubject.complete());
            stream.on('error', (error) => eventsSubject.error(error));
        } catch (error) {
            eventsSubject.error(error);
            eventsSubject.complete();
        }

        return eventsSubject.asObservable();
    }
}