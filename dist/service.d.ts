import { IOptions } from "./interfaces";
export default class Service {
    static readonly ID = "@foly/socket-event-forwarder";
    private readonly app;
    listen(options: IOptions): Promise<void>;
}
