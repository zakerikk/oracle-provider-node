import { createPairId, Pair } from "../models/AppConfig";
import IProvider from "../providers/IProvider";
import logger from './LoggerService';


export default class NetworkQueue {
    queue: Pair[] = [];
    processingIds: Set<string> = new Set();
    intervalId?: NodeJS.Timer;
    public id: string;

    constructor(public provider: IProvider) {
        this.id = provider.networkId;
    }

    has(pair: Pair): boolean {
        const id = createPairId(pair);
        const inQueue = this.queue.some(item => createPairId(item) === id);

        if (inQueue) return true;

        return this.processingIds.has(id);
    }

    add(pair: Pair) {
        if (this.has(pair)) return;
        this.queue.push(pair);
        logger.debug(`[${this.id}] Added "${createPairId(pair)}" to queue`);
    }

    start() {
        this.intervalId = setInterval(async () => {
            // We are processing something
            // We need to wait for the transaction to complete, otherwise
            // we could run into nonce issues.
            if (this.processingIds.size > 0) return;

            const pair = this.queue.shift();
            if (!pair) return;

            const id = createPairId(pair)
            this.processingIds.add(id);

            logger.debug(`[${this.id}] Processing ${id}`);

            const answer = await this.provider.resolvePair(pair);

            logger.debug(`[${this.id}] Completed processing "${id}" with answer ${answer}`);
            this.processingIds.delete(id);
        }, 100);
    }

    stop() {
        if (!this.intervalId) return;
        clearInterval(this.intervalId);
        this.intervalId = undefined;
    }
}
