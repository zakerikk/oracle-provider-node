export interface Block {
    hash: string;
    receiptsRoot: string;
    number: number;
    network: {
        chainId: number;
        type: "evm" | "near";
    };
}
