import React from 'react';

export interface SystemGroup {
  id: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  labelColor?: string;
}

export interface SystemNode {
  id: string;
  title: string;
  icon: React.ReactNode;
  category: 'storage' | 'compute' | 'security' | 'observability' | 'external' | 'database';
  description: string;
  details: string[];
  x: number;
  y: number;
  groupId?: string;
}

export interface Connection {
  from: string;
  to: string;
  label?: string;
  curved?: boolean;
  type?: 'standard' | 'security' | 'retry';
}

export enum FlowState {
  IDLE = 'IDLE',
  STEP_1_INGEST = 'STEP_1_INGEST',
  STEP_2_CONTROLLER_START = 'STEP_2_CONTROLLER_START',
  STEP_3_DISPATCH = 'STEP_3_DISPATCH',
  STEP_4_DISCOVERY = 'STEP_4_DISCOVERY',
  STEP_5_PII = 'STEP_5_PII',
  STEP_6_QUALITY = 'STEP_6_QUALITY',
  STEP_7_METADATA = 'STEP_7_METADATA',
  STEP_8_AI_READY = 'STEP_8_AI_READY',
  STEP_9_REPORTING = 'STEP_9_REPORTING',
  STEP_10_OBSERVABILITY = 'STEP_10_OBSERVABILITY',
  STEP_11_SYNC = 'STEP_11_SYNC',
  STEP_12_COMPLETE = 'STEP_12_COMPLETE',
  FAILURE_SIMULATION = 'FAILURE_SIMULATION', // New state for resilience demo
}

export type PersonaType = 'ENGINEER' | 'COMPLIANCE' | 'SCIENTIST' | 'NONE';

export interface Persona {
  id: PersonaType;
  label: string;
  description: string;
  activeNodes: string[];
  color: string;
}

export type ViewMode = 'STANDARD' | 'SECURITY' | 'LINEAGE' | 'RESILIENCE';