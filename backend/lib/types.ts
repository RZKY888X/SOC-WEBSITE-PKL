export interface LogItem {
  objid: number;
  device: string;
  sensor: string;
  status: string;
  lastvalue: string;
  lastvalue_raw: string;
  timestamp: string;
}

export interface SensorData {
  name: string;
  value: number;
  unit?: string;
}
