import {Container, Contracts, Providers} from '@arkecosystem/core-kernel';
import Service from './service';
import {IOptions} from "./interfaces";

export class ServiceProvider extends Providers.ServiceProvider {
    @Container.inject(Container.Identifiers.LogService)
    private readonly logger!: Contracts.Kernel.Logger;

    private service = Service.ID;

    public async register(): Promise<void> {
        this.logger.info('register function' + Service.ID);
        this.app.bind(this.service).to(Service).inSingletonScope();
    }

    public async boot(): Promise<void> {
        const options = (this.config().all() as unknown) as IOptions;

        this.logger.info(JSON.stringify(options));

        await this.app.get<Service>(this.service).listen(options);
        this.logger.info('Plugin booted');
    }

    public async bootWhen(serviceProvider?: string): Promise<boolean> {
        this.logger.info('bootWhen');
        this.logger.info(serviceProvider);
        return !!this.config().get('enabled') && serviceProvider === '@arkecosystem/core-blockchain';
    }

    public async dispose(): Promise<void> {
        // TODO: make sure plugin is stopped gracefully
        this.logger.info('Stop plugin, close everything here')
    }
}