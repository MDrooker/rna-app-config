export type SecretManager = {
	get(secretName: string): Promise<string>;
	set<ConfigT>(secretName: string, value: ConfigT): Promise<void>;
};

export type ConfigOptions = {
	filePath?: string;
	secretManager?: SecretManager;
	secretName?: string;
	requiredVars?: string[];
	reload?: boolean;
};
