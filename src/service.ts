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
        const walletRepository = this.app.get<Contracts.State.WalletRepository>(Container.Identifiers.WalletRepository);

        for (const event of options.events) {
            emitter.listen(event, {
                handle: async (payload: any) => {
                    // TODO test if this still works...
                    if (payload.data && payload.data.generatorPublicKey) {
                        payload.data.username = walletRepository
                            .findByPublicKey(payload.data.generatorPublicKey)
                            .getAttribute("delegate.username");
                    }

                    logger.debug(`[${Service.ID}] Forwarded event ${payload.name}`);
                    this.server.emit(payload.name, payload.data);
                },
            });
        }
    }
}
