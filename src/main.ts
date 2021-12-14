import death from 'death';
import { APP_CONFIG_LOCATION, AVAILABLE_PROVIDERS, DEBUG } from "./config";
import logger from './services/LoggerService';
import { readFile } from 'fs/promises';
import AppConfig from "./models/AppConfig";
import NetworkQueue from './services/NetworkQueue';

async function main() {
    try {
        logger.info('🚀 Starting provider validator for the Flux Oracle');
        logger.transports.forEach((transport) => {
            // @ts-ignore
            if (transport.name === 'console') {
                transport.level = DEBUG ? 'debug' : 'info';
            }
        });

        const appConfig: AppConfig = JSON.parse((await readFile(APP_CONFIG_LOCATION)).toString('utf-8'));

        const providers = appConfig.networks.map(network => {
            const provider = AVAILABLE_PROVIDERS.find(p => p.type === network.type);
            if (!provider) throw new Error(`Could not find provider ${network.type}`);

            return new provider(network);
        });

        await Promise.all(providers.map(p => p.init()));

        const queues = providers.map(provider => new NetworkQueue(provider));

        // const processingIndexes: Set<number> = new Set();
        const timers = appConfig.pairs.map((pair, index) => {
            return setInterval(async () => {
                const queue = queues.find(queue => queue.id === pair.networkId);
                if (!queue) throw new Error(`Could not find provider ${pair.networkId}`);

                queue.add(pair);
            }, pair.interval);
        });

        queues.forEach(queue => queue.start());
        logger.info('🚀 Booted');

        death(() => {
            timers.forEach(t => clearInterval(t));
            queues.forEach(q => q.stop());
            process.exit(0);
        });
    } catch (error: any) {
        logger.error(`[main] ${error.toString()}`);
    }
}

main();
