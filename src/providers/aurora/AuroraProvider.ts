import { JsonRpcProvider } from "@ethersproject/providers";
import { Wallet } from "@ethersproject/wallet";
import { Pair } from "../../models/AppConfig";
import IProvider from "../IProvider";
import { AuroraConfig, parseAuroraConfig, validateAuroraConfig } from "./AuroraConfig";
import { AuroraPairInfo, createPriceFeedContract } from "./AuroraContract";
import logger from '../../services/LoggerService';
import { resolveSources } from '../../vm';


class AuroraProvider implements IProvider {
    id = 'aurora';
    wallet: Wallet;
    config: AuroraConfig;
    pairInfo: Map<string, AuroraPairInfo> = new Map();

    constructor() {
        validateAuroraConfig(process.env);

        this.config = parseAuroraConfig(process.env);
        this.wallet = new Wallet(process.env.AURORA_PRIVATE_KEY ?? '', new JsonRpcProvider(this.config.rpc));
        logger.info(`[Aurora] Using address: ${this.wallet.address}`);
    }

    async init() {}

    async resolvePair(pair: Pair): Promise<boolean> {
        try {
            let pairInfo = this.pairInfo.get(pair.contractAddress);

            if (!pairInfo) {
                pairInfo = await createPriceFeedContract(pair, this.wallet);
                this.pairInfo.set(pair.contractAddress, pairInfo);
            }

            const answer = await resolveSources(pairInfo);
            if (!answer) return false;

            await pairInfo.contract.transmit(answer);

            return true;
        } catch (error: any) {
            logger.error(`Could not resolve ${pair.description} - ${error.toString()}`);
            return false;
        }
    }
}

export default AuroraProvider;
