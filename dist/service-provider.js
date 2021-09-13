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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceProvider = void 0;
const core_kernel_1 = require("@arkecosystem/core-kernel");
const service_1 = __importDefault(require("./service"));
class ServiceProvider extends core_kernel_1.Providers.ServiceProvider {
    constructor() {
        super(...arguments);
        this.service = service_1.default.ID;
    }
    async register() {
        const logger = this.app.get(core_kernel_1.Container.Identifiers.LogService);
        logger.info("hello world");
        this.logger.info("register function" + service_1.default.ID);
        this.logger.info(JSON.stringify(this.config().all()));
        this.app.bind(this.service).to(service_1.default).inSingletonScope();
    }
    async boot() {
        const options = this.config().all();
        this.logger.info(JSON.stringify(options));
        await this.app.get(this.service).listen(options);
        this.logger.info("Plugin booted");
    }
    async bootWhen() {
        this.logger.info("bootWhen");
        return !!this.config().get("enabled");
    }
    async dispose() {
        this.logger.info("Stop plugin, close everything here");
    }
}
__decorate([
    core_kernel_1.Container.inject(core_kernel_1.Container.Identifiers.LogService),
    __metadata("design:type", Object)
], ServiceProvider.prototype, "logger", void 0);
exports.ServiceProvider = ServiceProvider;
//# sourceMappingURL=service-provider.js.map