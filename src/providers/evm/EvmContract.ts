import { Contract } from '@ethersproject/contracts';
import { Wallet } from '@ethersproject/wallet';
import { createPairId, OracleRequest, Request } from '../../models/AppConfig';
import PairInfo from '../../models/PairInfo';
import logger from '../../services/LoggerService';
import { EvmConfig } from './EvmConfig';
import { getLatestBlock } from './EvmRpcService';
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

export async function fetchOracleRequests(address: string, evmConfig: EvmConfig, wallet: Wallet): Promise<OracleRequest[]> {
    try {
        // Do some fetching

        // TODO: This should ofcourse be the block from the request itself.
        const block = await getLatestBlock(evmConfig);

        if (!block) {
            throw new Error('Could not find block');
        }

        return [
            {
                confirmationsRequired: 10,
                confirmations: 0,
                args: [],
                toNetwork: {
                    chainId: 1313161554,
                    type: 'evm',
                },
                block,
                toContractAddress: '0x00000',
                type: 'request',
            }
        ];
    } catch (error) {
        logger.error(`[fetchOracleRequests] ${address} ${error}`);
        return [];
    }
}
