"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var Service_1;
Object.defineProperty(exports, "__esModule", { value: true });
const core_kernel_1 = require("@arkecosystem/core-kernel");
const socket_io_1 = require("socket.io");
const Systeminformation = __importStar(require("systeminformation"));
let Service = Service_1 = class Service {
    async listen(options) {
        this.server = new socket_io_1.Server(options.port);
        const logger = this.app.get(core_kernel_1.Container.Identifiers.LogService);
        const emitter = this.app.get(core_kernel_1.Container.Identifiers.EventDispatcherService);
        const walletRepository = this.app.getTagged(core_kernel_1.Container.Identifiers.WalletRepository, "state", "blockchain");
        for (const event of options.events) {
            emitter.listen(event, {
                handle: async (payload) => {
                    if (payload.data && payload.data.generatorPublicKey) {
                        payload.data.username = walletRepository
                            .findByPublicKey(payload.data.generatorPublicKey)
                            .getAttribute("delegate.username");
                    }
                    logger.debug(`[${Service_1.ID}] Forwarded event ${payload.name}`);
                    this.server.emit(payload.name, payload.data);
                },
            });
        }
        if (options.customEvents.includes("systeminformation")) {
            setInterval(async () => {
                const packet = await Systeminformation.get({
                    mem: "*",
                    currentLoad: "*",
                    cpuTemperature: "*",
                    osInfo: "platform, release",
                    cpu: "speed, cores, speedmin, speedmax, processors, physicalCores",
                });
                packet.fs = [];
                for (const disk of await Systeminformation.fsSize()) {
                    packet.fs.push({
                        use: disk.use,
                        size: disk.size,
                        used: disk.used,
                    });
                }
                this.server.emit("systeminformation", packet);
                logger.debug(`[${Service_1.ID}] Forwarded event systeminformation`);
            }, options.systeminformationInterval);
        }
        if (options.customEvents.includes("network.latency")) {
            setInterval(async () => {
                this.server.emit("network.latency", await Systeminformation.inetChecksite("https://google.com"));
                logger.debug(`[${Service_1.ID}] Forwarded event network.latency`);
            }, options.networkLatencyInterval);
        }
        if (options.customEvents.includes("blockheight.current")) {
            const stateStore = this.app.get(core_kernel_1.Container.Identifiers.StateStore);
            setInterval(async () => {
                this.server.emit("blockheight.current", stateStore.getLastHeight());
                logger.debug(`[${Service_1.ID}] Forwarded event blockheight.current`);
            }, options.blockheightCurrentInterval);
        }
        if (options.customEvents.includes("transaction.confirmed") && options.confirmations.length) {
            const transactions = [];
            emitter.listen("transaction.applied", {
                handle: async (payload) => {
                    payload.data.confirmations = 0;
                    if (payload.data.senderPublicKey) {
                        payload.data.senderId = walletRepository
                            .findByPublicKey(payload.data.senderPublicKey)
                            .getAddress();
                    }
                    transactions.push(payload.data);
                },
            });
            emitter.listen("block.applied", {
                handle: async (payload) => {
                    for (const [index, transaction] of transactions.entries()) {
                        transaction.confirmations += 1;
                        if (options.confirmations.includes(transaction.confirmations)) {
                            this.server.emit("transaction.confirmed", transaction);
                            logger.debug(`[${Service_1.ID}] Forwarded event transaction.confirmed`);
                        }
                        if (transaction.confirmations >= Math.max(...options.confirmations)) {
                            transactions.splice(index, 1);
                            logger.debug(`[${Service_1.ID}] Removed transaction since the max confirmations is reached`);
                        }
                    }
                },
            });
        }
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