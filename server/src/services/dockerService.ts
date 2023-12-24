import { Docker } from "node-docker-api";
import { Observable, Subject } from "rxjs";
import { Stream } from "stream";

import { Server } from "core";

export default class DockerService {
    private _docker = new Docker({ socketPath: '/var/run/docker.sock' });

    public async containerStart(id: string): Promise<void> {
        await this._docker.container.get(id).start();
    }

    public async containerStop(id: string): Promise<void> {
        await this._docker.container.get(id).stop();
    }

    public async containerRestart(id: string): Promise<void> {
        await this._docker.container.get(id).restart();
    }

    public async containerList(): Promise<Array<Server>> {
        const containers = await this._docker.container.list({ all: true });

        return await Promise.all(containers.map(async (container) => {
            const status = (((await (container.status())).data as any).State);

            return new Server({
                id: container.id,
                name: (container.data as any).Names[0].slice(1),
                state: (container.data as any).State,
                status: (container.data as any).Status,
                ports: (container.data as any).Ports.map((port: any) => port.PublicPort).filter(Boolean),
                startedAt: status.StartedAt,
                finishedAt: status.FinishedAt
            });
        }));
    }

    public async containerLogs(id: string): Promise<Array<string>> {
        const container = this._docker.container.get(id);
        const stream: Stream = (await container.logs({ follow: false, stdout: true, stderr: true })) as Stream;
        const logs: Array<string> = [];

        return new Promise<Array<string>>((resolve, reject) => {
            stream.on('data', (data) => logs.push(data.toString()));
            stream.on('end', () => resolve(logs));
            stream.on('error', (error) => reject(error));
        });
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

    public async listenServerLogs(id: string): Promise<Observable<string>> {
        const logsSubject = new Subject<string>();

        try {
            const stream: Stream = (await this._docker.container.get(id).logs({
                follow: true,
                stdout: true,
                stderr: true
            })) as Stream;

            stream.on('data', (data) => logsSubject.next(data.toString()));
            stream.on('end', () => logsSubject.complete());
            stream.on('error', (error) => logsSubject.error(error));
        } catch (error) {
            logsSubject.error(error);
            logsSubject.complete();
        }

        return logsSubject.asObservable();
    }
}