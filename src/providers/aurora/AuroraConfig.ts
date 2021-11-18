const PROVIDER_NAME = 'aurora';

export interface AuroraConfig {
    privateKey: string;
    rpc: string;
    chainId: number;
}

export function validateAuroraConfig(env: NodeJS.ProcessEnv = {}) {
    if (!env['AURORA_PRIVATE_KEY']) {
        throw new Error(`env option "AURORA_PRIVATE_KEY" is required for ${PROVIDER_NAME}`);
    }

    if (!env['AURORA_CHAIN_ID']) {
        throw new Error(`env option "AURORA_CHAIN_ID" is required for ${PROVIDER_NAME}`);
    }

    if (!env['AURORA_RPC']) {
        throw new Error(`env option "AURORA_RPC" is required for ${PROVIDER_NAME}"`);
    }
}

export function parseAuroraConfig(env: NodeJS.ProcessEnv = {}): AuroraConfig {
    return {
        privateKey: env['AURORA_PRIVATE_KEY'] ?? '',
        chainId: Number(env['AURORA_CHAIN_ID']) ?? 0,
        rpc: env['AURORA_RPC'] ?? '',
    };
}
