import Big from "big.js";
import { JsonRpcProvider } from "@ethersproject/providers";
import { EvmConfig } from "./EvmConfig";

export interface EvmBlock {
    blockNumber: number;
    receiptRoot: string;
    hash: string;
}

export async function getLatestBlock(config: EvmConfig): Promise<EvmBlock | null> {
    try {
        const provider = new JsonRpcProvider(config.rpc);
        const currentBlock = await provider.getBlockNumber();
        const block = await provider.perform('getBlock', {
            blockTag: currentBlock,
        });

        return {
            blockNumber: currentBlock,
            hash: block.hash,
            receiptRoot: block.receiptsRoot,
        };
    } catch (error) {
        console.error('[getLatestBlock]', error);
        return null;
    }
}

