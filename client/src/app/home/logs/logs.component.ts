import { isPlatformBrowser } from "@angular/common";
import { AfterViewInit, Component, OnDestroy, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { ServersService } from "@services/servers.service";

@Component({
    selector: 'app-logs',
    templateUrl: './logs.component.html',
    styleUrl: './logs.component.scss'
})
export class ServerLogsComponent implements OnInit, AfterViewInit, OnDestroy {

    public serverId?: string;
    public logs: Array<string> = [''];
    private _platformId = inject(PLATFORM_ID);
    private _textToWrite: Array<string> = [];
    private _writerInterval: NodeJS.Timeout;

    constructor(private _serversService: ServersService, private _route: ActivatedRoute) {
        this.serverId = _route.snapshot.params['serverId'];

        if (isPlatformBrowser(this._platformId) && this.serverId)
            this._serversService.listenServerLogs(this.serverId).subscribe((log) =>
                this._textToWrite.push(log)
            );

        this._writerInterval = setInterval(() => {
            if (this._textToWrite.length > 0)
            // Normal print
                if (this._textToWrite.length <= 8) {

                    const char = this._textToWrite[0]?.slice(0, 1);

                    this._textToWrite[0] = this._textToWrite[0]?.slice(1);
                    if (this._textToWrite[0]?.length === 0) {
                        this._textToWrite.shift();
                        this.logs.push("");
                        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                    }
                    this.logs[this.logs.length - 1] += char;
                } else if (this._textToWrite.length <= 20) {
                    // Fast print
                    const log = this._textToWrite.shift();

                    if (log) {
                        this.logs.push(log);
                        window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' });
                    }
                } else {
                    // Instant print
                    this.logs.push(...this._textToWrite);
                    this._textToWrite = [];
                    window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' });
                }

        }, 10);
    }

    ngOnInit(): void {
        this._route.data.subscribe(({ logs }) => this.logs = logs);
    }

    ngAfterViewInit(): void {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }

    ngOnDestroy(): void {
        clearInterval(this._writerInterval);
    }

}