import { Platform } from 'react-native';

declare const process: {
  env?: {
    EXPO_PUBLIC_API_URL?: string;
  };
};

const defaultApiUrl = Platform.OS === 'android'
  ? 'http://10.0.2.2:3001'
  : 'http://localhost:3001';

const configuredApiUrl = typeof process !== 'undefined'
  ? process.env?.EXPO_PUBLIC_API_URL
  : undefined;

export const API_BASE_URL = configuredApiUrl || defaultApiUrl;
export const ANALYZE_DISCHARGE_URL = `${API_BASE_URL}/api/analyze-discharge`;
