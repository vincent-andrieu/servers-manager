import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { ServersService } from "@services/servers.service";

const serverLogsResolver: ResolveFn<Array<string>> = (route) => {
    const serversService = inject(ServersService);
    const serverId = route.paramMap.get('serverId');

    if (!serverId)
        throw new Error("Server ID not found");
    return serversService.getServerLogs(serverId);
};

export default serverLogsResolver;