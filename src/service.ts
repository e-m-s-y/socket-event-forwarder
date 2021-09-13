import { Container, Contracts } from "@arkecosystem/core-kernel";

import { IOptions } from "./interfaces";

@Container.injectable()
export default class Service {
    public static readonly ID = "@foly/socket-event-forwarder";

    @Container.inject(Container.Identifiers.Application)
    private readonly app!: Contracts.Kernel.Application;

    public async listen(options: IOptions): Promise<void> {
        const logger = this.app.get<Contracts.Kernel.Logger>(Container.Identifiers.LogService);

        logger.info(JSON.stringify(options));

        const emitter = this.app.get<Contracts.Kernel.EventDispatcher>(Container.Identifiers.EventDispatcherService);

        emitter.listen("block.applied", {
            handle: async (payload: any) => {
                const data = JSON.stringify(payload);

                logger.debug(`[${Service.ID}] ${data}`);
            },
        });
    }
}
