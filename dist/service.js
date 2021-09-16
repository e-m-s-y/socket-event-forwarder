"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var Service_1;
Object.defineProperty(exports, "__esModule", { value: true });
const core_kernel_1 = require("@arkecosystem/core-kernel");
const socket_io_1 = require("socket.io");
let Service = Service_1 = class Service {
    async listen(options) {
        this.server = new socket_io_1.Server(options.port);
        const logger = this.app.get(core_kernel_1.Container.Identifiers.LogService);
        logger.info(JSON.stringify(options));
        const emitter = this.app.get(core_kernel_1.Container.Identifiers.EventDispatcherService);
        emitter.listen("block.applied", {
            handle: async (payload) => {
                logger.debug(`[${Service_1.ID}] Forwarded event ${payload.name}`);
                this.server.emit(payload.name, payload.data);
            },
        });
    }
};
Service.ID = "@foly/socket-event-forwarder";
__decorate([
    core_kernel_1.Container.inject(core_kernel_1.Container.Identifiers.Application),
    __metadata("design:type", Object)
], Service.prototype, "app", void 0);
Service = Service_1 = __decorate([
    core_kernel_1.Container.injectable()
], Service);
exports.default = Service;
//# sourceMappingURL=service.js.map