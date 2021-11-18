import { Contract } from '@ethersproject/contracts';
import { Wallet } from '@ethersproject/wallet';
import { Pair } from '../../models/AppConfig';
import PairInfo from '../../models/PairInfo';
import fluxAbi from './FluxPriceFeed.json';

export interface AuroraPairInfo extends PairInfo {
    contract: Contract;
}

export async function createPriceFeedContract(pair: Pair, wallet: Wallet): Promise<AuroraPairInfo> {
    const contract = new Contract(pair.contractAddress, fluxAbi.abi, wallet.provider);
    const decimals = await contract.decimals();

    return {
        ...pair,
        contract: contract.connect(wallet),
        decimals,
    };
}

