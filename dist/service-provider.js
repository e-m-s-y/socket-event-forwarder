"use strict";
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
        this.app.bind(this.service).to(service_1.default).inSingletonScope();
        const logger = this.app.get(core_kernel_1.Container.Identifiers.LogService);
        logger.info(`[${service_1.default.ID}] plugin registered, waiting to boot...`);
    }
    async boot() {
        const logger = this.app.get(core_kernel_1.Container.Identifiers.LogService);
        logger.info(`[${service_1.default.ID}] booting plugin...`);
        const options = this.config().all();
        await this.app.get(this.service).listen(options);
        logger.info(`[${service_1.default.ID}] plugin booted and is ready for use`);
    }
    async bootWhen() {
        return !!this.config().get("enabled");
    }
    async dispose() {
        // TODO clean-up plugin here
    }
}
exports.ServiceProvider = ServiceProvider;
//# sourceMappingURL=service-provider.js.map