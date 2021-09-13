import { Container, Contracts, Providers } from "@arkecosystem/core-kernel";

import { IOptions } from "./interfaces";
import Service from "./service";

export class ServiceProvider extends Providers.ServiceProvider {
    @Container.inject(Container.Identifiers.LogService)
    private readonly logger!: Contracts.Kernel.Logger;

    private service = Service.ID;

    public async register(): Promise<void> {
        const logger = this.app.get<Contracts.Kernel.Logger>(Container.Identifiers.LogService);

        logger.info("hello world");

        this.logger.info("register function" + Service.ID);
        this.logger.info(JSON.stringify(this.config().all()));
        this.app.bind(this.service).to(Service).inSingletonScope();
    }

    public async boot(): Promise<void> {
        const options = this.config().all() as unknown as IOptions;

        this.logger.info(JSON.stringify(options));

        await this.app.get<Service>(this.service).listen(options);
        this.logger.info("Plugin booted");
    }

    public async bootWhen(): Promise<boolean> {
        this.logger.info("bootWhen");
        return !!this.config().get("enabled");
    }

    public async dispose(): Promise<void> {
        this.logger.info("Stop plugin, close everything here");
    }
}
