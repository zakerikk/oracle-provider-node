export interface SourceInfo {
    source_path: string;
    end_point: string;
}

export interface Pair {
    description: string;
    contractAddress: string;
    sources: SourceInfo[];
    interval: number;
    network: string;
}

export default interface AppConfig {
    pairs: Pair[];
}
