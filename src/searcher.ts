import AppConfig from "./models/AppConfig";
import NetworkQueue from "./services/NetworkQueue";

export function searchRequests(appConfig: AppConfig, queues: NetworkQueue[]) {
    appConfig.requestListeners?.map((listenerConfig) => {
        let processing = false;

        const fromQueue = queues.find(queue => queue.id === listenerConfig.networkId);
        if (!fromQueue) {
            throw new Error(`Could not find provider for ${listenerConfig.networkId}`);
        }

        return setInterval(async () => {
            if (processing) return;
            processing = true;

            const requests = await fromQueue.provider.fetchRequests(listenerConfig.contractAddress);

            requests.map((request) => {

            });

            processing = false;
        }, listenerConfig.interval);
    });
}
