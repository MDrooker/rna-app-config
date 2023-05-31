import {type SecretManager} from "../types.js";
import {SSMClient, GetParameterCommand, PutParameterCommand, ParameterType} from "@aws-sdk/client-ssm";

const createSSMClient = (region?: string) => new SSMClient({region});

export class AWSParameterStore implements SecretManager {
    constructor(private readonly ssmClient: SSMClient = createSSMClient()) {}

    async get(secretName: string): Promise<string> {
        const command = new GetParameterCommand({
            Name: secretName,
            WithDecryption: true,
        });
        const secret = await this.ssmClient.send(command);
        if (!secret.Parameter?.Value) {
            throw new Error("Secret value is empty");
        }

        return secret.Parameter.Value;
    }

    async set<ConfigT>(secretName: string, value: ConfigT): Promise<void> {
        const jsonValue = JSON.stringify(value);
        const command = new PutParameterCommand({
            Name: secretName,
            Value: jsonValue,
            Type: ParameterType.SECURE_STRING,
        });
        try {
            await this.ssmClient.send(command);
        } catch (err: unknown) {
            const message = "Failed to set secret";
            throw new Error(err instanceof Error ? `${message}: ${err.message}` : message);
        }
    }
}
