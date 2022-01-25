import { JsonRpcProvider } from "@ethersproject/providers";
import { Wallet } from "@ethersproject/wallet";
import { Batch, Network, OracleRequest, Request } from "../../models/AppConfig";
import IProvider from "../IProvider";
import { EvmConfig, parseEvmConfig, validateEvmConfig } from "./EvmConfig";
import { EvmPairInfo, createPriceFeedContract, fetchOracleRequests } from "./EvmContract";
import logger from '../../services/LoggerService';
import { resolveSources } from '../../vm';
import { EvmBlock, getLatestBlock } from "./EvmRpcService";
import { debouncedInterval } from "../../services/TimerUtils";
import NetworkQueue from "../../services/NetworkQueue";
import { Block } from "../../models/Block";
import RequestConfirmationsDelayer from "../../services/RequestConfirmationsDelayer";


class EvmProvider extends IProvider {
    static type = 'evm';

    currentBlock: Block | null = null;
    wallet: Wallet;
    config: EvmConfig;
    pairInfo: Map<string, EvmPairInfo> = new Map();
    queues: NetworkQueue[] = [];
    delayer: RequestConfirmationsDelayer = new RequestConfirmationsDelayer();

    constructor(networkConfig: Network) {
        super(networkConfig);
        validateEvmConfig(networkConfig, process.env);

        this.config = parseEvmConfig(networkConfig, process.env);
        this.wallet = new Wallet(this.config.privateKey, new JsonRpcProvider(this.config.rpc));
        logger.info(`[${networkConfig.networkId}] Using address: ${this.wallet.address}`);
    }

    async init(queues: NetworkQueue[]) {
        this.queues = queues;
        // Used for checking how many confirmations a certain request has
        debouncedInterval(async () => {
            this.currentBlock = await getLatestBlock(this.config);

            logger.debug(`[${this.networkConfig.type}-${this.networkConfig.chainId}] Fetched block #${this.currentBlock?.number}`);

            if (this.currentBlock) {
                this.delayer.setBlock(this.currentBlock);
            }
        }, this.config.blockPollingInterval);
    }

    onRequests(callback: (requests: OracleRequest) => any): void {
        this.delayer.onRequestReady(callback);
    }

    async startFetching(oracleContract: string, interval: number): Promise<void> {
        debouncedInterval(async () => {
            const requests = await fetchOracleRequests(oracleContract, this.config, this.wallet);
            requests.forEach(r => this.delayer.addRequest(r));
        }, interval);
    }

    async resolvePair(pair: Request): Promise<string | null> {
        try {
            let pairInfo = this.pairInfo.get(pair.contractAddress);

            if (!pairInfo) {
                pairInfo = await createPriceFeedContract(pair, this.wallet);
                this.pairInfo.set(pair.contractAddress, pairInfo);
            }

            const answer = await resolveSources(pairInfo);
            if (!answer) return null;

            await pairInfo.contract.transmit(answer);

            return answer;
        } catch (error: any) {
            logger.error(`[${pair.networkId}] Could not resolve ${pair.pair} - ${error.toString()}`);
            return null;
        }
    }

    async resolveRequest(request: OracleRequest): Promise<string | null> {
        return null;
    }

    async resolveBatch(batch: Batch): Promise<string | null> {
        let result: (string|null)[] = [];

        for await (const pair of batch.pairs) {
            result.push(await this.resolvePair(pair));
        }

        return result.join(',');
    }
}

export default EvmProvider;
