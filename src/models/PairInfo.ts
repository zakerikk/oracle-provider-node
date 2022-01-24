import { Request } from "./AppConfig";

export default interface PairInfo extends Request {
    decimals: number;
}

export function convertPairInfoToString(pairInfo: PairInfo): string {
    return JSON.stringify({
        decimals: pairInfo.decimals,
        description: pairInfo.description,
        pair: pairInfo.pair,
        contractAddress: pairInfo.contractAddress,
        sources: pairInfo.sources,
        interval: pairInfo.interval,
        networkId: pairInfo.networkId,
        defaultDecimals: pairInfo.defaultDecimals,
    });
}
