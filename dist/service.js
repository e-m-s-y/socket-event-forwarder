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
Object.defineProperty(exports, "__esModule", { value: true });
const core_kernel_1 = require("@arkecosystem/core-kernel");
let Service = class Service {
    async listen(options) {
        this.logger.info("in listen function");
        this.emitter.listen("block.forged", {
            handle: async (payload) => {
                this.logger.debug(JSON.stringify(payload));
            },
        });
    }
};
Service.ID = "@foly/socket-event-forwarder";
__decorate([
    core_kernel_1.Container.inject(core_kernel_1.Container.Identifiers.EventDispatcherService),
    __metadata("design:type", Object)
], Service.prototype, "emitter", void 0);
__decorate([
    core_kernel_1.Container.inject(core_kernel_1.Container.Identifiers.LogService),
    __metadata("design:type", Object)
], Service.prototype, "logger", void 0);
Service = __decorate([
    core_kernel_1.Container.injectable()
], Service);
exports.default = Service;
//# sourceMappingURL=service.js.map