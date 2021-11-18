import { config } from 'dotenv';
import AuroraProvider from "./providers/aurora/AuroraProvider";

config();

export const AVAILABLE_PROVIDERS = [AuroraProvider];
export const MAX_LOG_LIFETIME = '14d';
export const APP_CONFIG_LOCATION = process.env.APP_CONFIG_LOCATION ?? './appconfig.json'
export const DEBUG = process.env.DEBUG === 'true';
