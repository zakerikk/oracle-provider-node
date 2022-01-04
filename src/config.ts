import { config } from 'dotenv';
import EvmProvider from "./providers/evm/EvmProvider";
import NearProvider from './providers/near/NearProvider';

config();

export const AVAILABLE_PROVIDERS = [EvmProvider, NearProvider];
export const MAX_LOG_LIFETIME = '14d';
export const APP_CONFIG_LOCATION = process.env.APP_CONFIG_LOCATION ?? './appconfig.json'
export const DEBUG = process.env.DEBUG === 'true';
export const DEFAULT_DECIMALS = 6;
export const DISABLE_ANALYTICS = process.env.DISABLE_ANALYTICS === 'true';
export const SENTRY_DSN = 'https://f3df268cea12441c85812120267992f4@o1104820.ingest.sentry.io/6132195';
