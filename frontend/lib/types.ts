// lib/types.ts
export interface LogItem {
  objid?: string;
  device: string;
  sensor: string;
  status: string;
  lastvalue?: string;
  lastvalue_raw?: string;
  lastcheck?: string;
  timestamp?: string | null;
}

export interface SensorData {
  name: string;
  value: number;
  unit?: string;
}