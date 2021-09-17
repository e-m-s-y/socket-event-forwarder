import { Providers } from "@arkecosystem/core-kernel";
export declare class ServiceProvider extends Providers.ServiceProvider {
    private service;
    register(): Promise<void>;
    boot(): Promise<void>;
    bootWhen(): Promise<boolean>;
    dispose(): Promise<void>;
}
