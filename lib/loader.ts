import nconf from "nconf";
import fs from "node:fs/promises";
import {type ConfigOptions, type SecretManager} from "./types.js";

export class AppConfig {
    private static isLoaded = false;

    private constructor() {}

    private static async maybeLoadFromFile<ConfigT>(filePath: string): Promise<ConfigT | undefined> {
        let raw: string;
        try {
            raw = await fs.readFile(filePath, "utf8");
        } catch {
            return;
        }

        return JSON.parse(raw);
    }

    private static async loadFromSecretStore<ConfigT>(name: string, manager: SecretManager): Promise<ConfigT> {
        let raw: string;
        try {
            raw = await manager.get(name);
        } catch (err: unknown) {
            const msg = "Failed to load remote config";
            throw new Error(err instanceof Error ? `${msg}: ${err.message}` : msg);
        }

        return JSON.parse(raw);
    }

    static async load(options: ConfigOptions): Promise<void> {
        if (!options.reload && AppConfig.isLoaded) {
            return;
        }

        let config;
        const {filePath, secretManager, secretName, requiredVars} = options;

        if (filePath) {
            config = await AppConfig.maybeLoadFromFile(filePath);
        }

        if (!config && secretManager && secretName) {
            config = await AppConfig.loadFromSecretStore(secretName, secretManager);
        }

        if (!config) {
            throw new Error("Unable to load config");
        }

        nconf.env("__");
        nconf.defaults(config);
        nconf.required(requiredVars ?? []);
        AppConfig.isLoaded = true;
    }

    static get<ConfigT>(name?: string): ConfigT {
        if (!AppConfig.isLoaded) {
            throw new Error("Config not loaded");
        }

        return nconf.get(name);
    }

    static getNumber(name: string): number {
        if (!AppConfig.isLoaded) {
            throw new Error("Config not loaded");
        }

        const val = nconf.get(name);
        if (isNaN(val)) {
            return NaN;
        }

        return Number(val);
    }

    static getBoolean(name: string): boolean {
        if (!AppConfig.isLoaded) {
            throw new Error("Config not loaded");
        }

        const val = nconf.get(name);
        if (typeof val === "string") {
            return ["true", "yes"].includes(val.toLocaleLowerCase());
        }

        return false;
    }
}
