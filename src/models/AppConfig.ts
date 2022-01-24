import { SourceInfo } from "./SourceInfo";

export interface OracleRequest {
    toNetwork: string;
    toContractAddress: string;
    args: string[];
    type: "request"
}

export interface PushRequest {
    description: string;
    pair: string;
    contractAddress: string;
    sources: SourceInfo[];
    interval: number;
    networkId: string;
    defaultDecimals?: number;
    type: "push";
}

export type Request = PushRequest;

export interface Batch {
    pairs: Request[];
    contractAddress: string;
    description: string;
    interval: number;
    networkId: string;
}

export interface EvmNetwork {
    type: "evm";
    networkId?: string;
    privateKeyEnvKey?: string;
    chainId?: number;
    rpc?: string;
}

export interface NearNetwork {
    type: "near";
    networkId?: string;
    credentialsStorePathEnvKey?: string;
    privateKeyEnvKey?: string;
    networkType?: string;
    rpc?: string;
    accountId?: string;
    maxGas?: string;
    storageDeposit?: string;
}

export type Network = EvmNetwork | NearNetwork;

export interface RequestListenerConfig {
    contractAddress: string;
    networkId: string;
    interval: number;
}

export default interface AppConfig {
    pairs?: Request[];
    batches?: Batch[];
    networks?: Network[];
    requestListeners?: RequestListenerConfig[];
}

export function isOracleRequest(item: Request | Batch | OracleRequest): item is OracleRequest {
    if (isBatch(item)) {
        return false;
    }

    return item.type === 'request';
}

export function isBatch(pair: Request | Batch | OracleRequest): pair is Batch {
    return pair.hasOwnProperty('pairs');
}

export function createPairId(pair: Request | Batch | OracleRequest) {
    if (isBatch(pair)) {
        return `${pair.networkId}-${pair.description}-${pair.pairs[0].pair}-${pair.interval}`;
    }

    if (isOracleRequest(pair)) {
        return ``;
    }

    return `${pair.networkId}-${pair.pair}-${pair.contractAddress}`;
}
