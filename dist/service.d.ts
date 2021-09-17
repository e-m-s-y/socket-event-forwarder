import { IOptions } from "./interfaces";
export default class Service {
    static readonly ID = "@foly/socket-event-forwarder";
    private readonly app;
    private server;
    listen(options: IOptions): Promise<void>;
}
