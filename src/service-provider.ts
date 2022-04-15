import { Container, Contracts, Providers } from "@solar-network/core-kernel";

import { IOptions } from "./interfaces";
import Service from "./service";

export class ServiceProvider extends Providers.ServiceProvider {
    private service = Service.ID;

    public async register(): Promise<void> {
        this.app.bind(this.service).to(Service).inSingletonScope();

        const logger = this.app.get<Contracts.Kernel.Logger>(Container.Identifiers.LogService);

        logger.info(`[${Service.ID}] Plugin registered, waiting to boot...`);
    }

    public async boot(): Promise<void> {
        const logger = this.app.get<Contracts.Kernel.Logger>(Container.Identifiers.LogService);

        logger.info(`[${Service.ID}] Booting plugin...`);

        const options = this.config().all() as unknown as IOptions;

        await this.app.get<Service>(this.service).listen(options);

        logger.info(`[${Service.ID}] Plugin booted and is ready for use`);
    }

    public async bootWhen(): Promise<boolean> {
        return !!this.config().get("enabled");
    }
}
