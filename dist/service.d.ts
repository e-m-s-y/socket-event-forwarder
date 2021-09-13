import { IOptions } from './interfaces';
export default class Service {
    static readonly ID = "@foly/socket-event-forwarder";
    private readonly emitter;
    private readonly logger;
    listen(options: IOptions): Promise<void>;
}
