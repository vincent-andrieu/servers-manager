import { isPlatformBrowser } from "@angular/common";
import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { ServersService } from "@services/servers.service";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

    private readonly _platformId = inject(PLATFORM_ID);

    constructor(private _serversService: ServersService) {}

    ngOnInit(): void {
        if (isPlatformBrowser(this._platformId))
            this._serversService.listenServers().subscribe((servers) => console.log(servers));
    }

}