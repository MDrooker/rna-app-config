import {SecretsManagerClient, GetSecretValueCommand} from "@aws-sdk/client-secrets-manager";
import type {SecretManager} from "../types.js";

const createClient = (region?: string) => new SecretsManagerClient({region});

export class AWSSecretsManager implements SecretManager {
  constructor(private readonly client: SecretsManagerClient = createClient()) {}

  async get(secretName: string): Promise<string> {
    const command = new GetSecretValueCommand({
      SecretId: secretName
    });
    const secret = await this.client.send(command);
    if (!secret.SecretString) {
      throw new Error("Secret value is empty");
    }
    return secret.SecretString;
  }

  async set<ConfigT>(_secretName: string, _value: ConfigT): Promise<void> {
    // NOOP
    return;
  }
}
