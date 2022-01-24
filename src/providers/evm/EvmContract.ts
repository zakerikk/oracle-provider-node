import { Contract } from '@ethersproject/contracts';
import { Wallet } from '@ethersproject/wallet';
import { createPairId, Request } from '../../models/AppConfig';
import PairInfo from '../../models/PairInfo';
import logger from '../../services/LoggerService';
import fluxAbi from './FluxPriceFeed.json';

export interface EvmPairInfo extends PairInfo {
    contract: Contract;
}

export async function createPriceFeedContract(pair: Request, wallet: Wallet): Promise<EvmPairInfo> {
    const contract = new Contract(pair.contractAddress, fluxAbi.abi, wallet.provider);
    const decimals = await contract.decimals();

    logger.info(`[${createPairId(pair)}] - Using decimals: ${decimals}`);

    return {
        ...pair,
        contract: contract.connect(wallet),
        decimals,
    };
}

