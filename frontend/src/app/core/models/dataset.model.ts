export type DatasetMeta = {
  timezone?: string;
  nodeId?: string;
  model?: string;
  fw?: string;
  hw?: string;
  startedAt?: string;
};

export type SensorRow = {
  timestamp: Date;
  values: Record<string, number | null>;
};

export type Dataset = {
  meta: DatasetMeta;
  columns: string[];
  rows: SensorRow[];
};
