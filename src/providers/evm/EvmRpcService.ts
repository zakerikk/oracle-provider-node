import { JsonRpcProvider } from "@ethersproject/providers";
import { Block } from "../../models/Block";
import logger from "../../services/LoggerService";
import { EvmConfig } from "./EvmConfig";

export interface EvmBlock {
    blockNumber: number;
    receiptRoot: string;
    hash: string;
}

export async function getBlockByNumber(number: number, config: EvmConfig): Promise<Block | null> {
    try {
        const provider = new JsonRpcProvider(config.rpc);
        const block = await provider.perform('getBlock', {
            blockTag: number,
        });

        return {
            number,
            hash: block.hash,
            receiptsRoot: block.receiptsRoot,
            network: {
                chainId: config.chainId,
                type: 'evm',
            },
        };
    } catch (error) {
        logger.error('[getBlockByNumber]', error);
        return null;
    }
}

export async function getLatestBlock(config: EvmConfig): Promise<Block | null> {
    try {
        const provider = new JsonRpcProvider(config.rpc);
        const currentBlock = await provider.getBlockNumber();

        return getBlockByNumber(currentBlock, config);
    } catch (error) {
        logger.error('[getLatestBlock]', error);
        return null;
    }
}

