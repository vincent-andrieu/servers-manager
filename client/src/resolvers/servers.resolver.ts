import { inject } from "@angular/core";
import { ResolveFn } from '@angular/router';

import { ServersService } from "@services/servers.service";
import { Server } from "core";

const serversResolver: ResolveFn<Array<Server>> = () => {
    const serversService = inject(ServersService);

    return serversService.getServers();
};

export default serversResolver;