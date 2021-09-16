import { Container, Contracts } from "@arkecosystem/core-kernel";
import { Server as SocketServer } from "socket.io";

import { IOptions } from "./interfaces";

@Container.injectable()
export default class Service {
    public static readonly ID = "@foly/socket-event-forwarder";

    @Container.inject(Container.Identifiers.Application)
    private readonly app!: Contracts.Kernel.Application;

    private server!: SocketServer;

    public async listen(options: IOptions): Promise<void> {
        this.server = new SocketServer(options.port);

        const logger = this.app.get<Contracts.Kernel.Logger>(Container.Identifiers.LogService);

        logger.info(JSON.stringify(options));

        const emitter = this.app.get<Contracts.Kernel.EventDispatcher>(Container.Identifiers.EventDispatcherService);

        emitter.listen("block.applied", {
            handle: async (payload: any) => {
                logger.debug(`[${Service.ID}] Forwarded event ${payload.name}`);
                this.server.emit(payload.name, payload.data);
            },
        });
    }
}
