import { Container, Contracts } from "@arkecosystem/core-kernel";

import { IOptions } from "./interfaces";

@Container.injectable()
export default class Service {
    public static readonly ID = "@foly/socket-event-forwarder";

    @Container.inject(Container.Identifiers.EventDispatcherService)
    private readonly emitter!: Contracts.Kernel.EventDispatcher;

    @Container.inject(Container.Identifiers.LogService)
    private readonly logger!: Contracts.Kernel.Logger;

    public async listen(options: IOptions): Promise<void> {
        this.logger.info("in listen function");

        this.emitter.listen("block.forged", {
            handle: async (payload: any) => {
                this.logger.debug(JSON.stringify(payload));
            },
        });
    }
}
