import { Batch, Network, OracleRequest, Request } from "../models/AppConfig";
export default class IProvider {
    static type = "iprovider";
    networkId: string;

    constructor(public networkConfig: Network) {
        this.networkId = networkConfig.networkId ?? 'iprovider';
    }

    init(): Promise<void> { return Promise.resolve() };
    fetchRequests(oracleContract: string): Promise<OracleRequest[]> { throw new Error('Not implemented') }
    resolveRequest(request: OracleRequest): Promise<string | null> { throw new Error('Not implemented') }

    resolvePair(pair: Request): Promise<string | null> { throw new Error('Not implemented'); }
    resolveBatch(batch: Batch): Promise<string | null> { throw new Error('Batching is not supported by this provider'); }
}
