import React from 'react';
import { 
  Database, 
  Shield, 
  Eye, 
  HardDrive, 
  FileText, 
  Globe, 
  Lock, 
  Cpu,
  Activity,
  Archive,
  Share2,
  Workflow,
  Key,
  Layers,
  Box,
  Search,
  CheckCircle,
  FileCheck,
  Zap,
  MessageSquare,
  UserCog,
  FileSearch,
  BrainCircuit,
  Settings,
  Server,
  Cloud
} from 'lucide-react';
import { SystemNode, Connection, SystemGroup, Persona } from './types';

// --- PERSONAS ---
export const PERSONAS: Persona[] = [
  {
    id: 'ENGINEER',
    label: 'Data Engineer',
    description: 'Focuses on pipeline health, raw ingestion, and infrastructure scaling.',
    activeNodes: ['raw', 'controller', 'sqs', 'eventbridge', 'metadata-store', 'cloudwatch', 'staging'],
    color: '#3b82f6' // Blue
  },
  {
    id: 'COMPLIANCE',
    label: 'Compliance Officer',
    description: 'Verifies PII redaction, audit trails, and data governance reports.',
    activeNodes: ['agent-pii', 'agent-report', 'evidence', 'policy-store', 'kms', 'raw'],
    color: '#10b981' // Emerald
  },
  {
    id: 'SCIENTIST',
    label: 'AI Scientist',
    description: 'Consumes curated datasets for model training and feature engineering.',
    activeNodes: ['curated', 'agent-ai', 'metadata-store', 'vertex', 'athena'],
    color: '#8b5cf6' // Violet
  }
];

// --- GROUPS (ZONES) ---
export const GROUPS: SystemGroup[] = [
  {
    id: 'vpc',
    title: 'Client Cloud VPC (AWS MVP)',
    x: 1, y: 1, width: 85, height: 98,
    color: 'border-slate-600 bg-slate-900/0',
    labelColor: 'text-slate-500'
  },
  {
    id: 'control_plane',
    title: 'Control Plane',
    x: 22, y: 6, width: 45, height: 18,
    color: 'border-blue-500/30 bg-blue-900/5',
    labelColor: 'text-blue-400'
  },
  {
    id: 'agents',
    title: 'Modular Agent Swarm (EKS/ECS)',
    x: 22, y: 28, width: 45, height: 38,
    color: 'border-rose-500/30 bg-rose-900/5',
    labelColor: 'text-rose-400'
  },
  {
    id: 'stores',
    title: 'State & Policy',
    x: 3, y: 35, width: 16, height: 25,
    color: 'border-indigo-500/30 bg-indigo-900/5',
    labelColor: 'text-indigo-400'
  },
  {
    id: 'storage',
    title: 'Multi-Tier Data Zones',
    x: 3, y: 70, width: 64, height: 26,
    color: 'border-green-500/30 bg-green-900/5',
    labelColor: 'text-green-400'
  },
  {
    id: 'integrations',
    title: 'Output Integrations',
    x: 70, y: 60, width: 14, height: 36,
    color: 'border-cyan-500/30 bg-cyan-900/5',
    labelColor: 'text-cyan-400'
  },
  {
    id: 'observability',
    title: 'Observability',
    x: 70, y: 15, width: 14, height: 20,
    color: 'border-purple-500/30 bg-purple-900/5',
    labelColor: 'text-purple-400'
  }
];

// --- NODES ---
export const NODES: SystemNode[] = [
  // --- CONTROL PLANE ---
  {
    id: 'controller', title: 'Orchestrator', icon: <Cpu className="text-white" />,
    category: 'compute', description: 'Job scheduling & dependency management.', details: ['REST API', 'Retries', 'State Mgmt'],
    x: 35, y: 15, groupId: 'control_plane'
  },
  {
    id: 'sqs', title: 'SQS + DLQ', icon: <MessageSquare className="text-pink-400" />,
    category: 'compute', description: 'Async event bus.', details: ['AWS MVP -> GCP PubSub'],
    x: 50, y: 15, groupId: 'control_plane'
  },
  {
    id: 'eventbridge', title: 'EventBridge', icon: <Share2 className="text-pink-400" />,
    category: 'compute', description: 'Event router.', details: [],
    x: 58, y: 15, groupId: 'control_plane'
  },

  // --- STORES ---
  {
    id: 'metadata-store', title: 'Metadata Store', icon: <Database className="text-indigo-400" />,
    category: 'database', description: 'Asset manifests & lineage graphs.', details: ['AWS RDS -> Cloud SQL'],
    x: 11, y: 42, groupId: 'stores'
  },
  {
    id: 'policy-store', title: 'Policy Store', icon: <Shield className="text-indigo-400" />,
    category: 'database', description: 'PII rules, masking policies.', details: ['DynamoDB -> Firestore'],
    x: 11, y: 54, groupId: 'stores'
  },

  // --- AGENTS ---
  // Row 1
  {
    id: 'agent-discovery', title: 'Discovery Agent', icon: <Search className="text-rose-300" />,
    category: 'compute', description: 'Schema inference & profiling.', details: ['Containerized Worker'],
    x: 29, y: 38, groupId: 'agents'
  },
  {
    id: 'agent-pii', title: 'PII Remediation', icon: <Shield className="text-rose-300" />,
    category: 'compute', description: 'Entity detection & masking.', details: ['Containerized Worker'],
    x: 44, y: 38, groupId: 'agents'
  },
  {
    id: 'agent-quality', title: 'Data Quality', icon: <CheckCircle className="text-rose-300" />,
    category: 'compute', description: 'Constraint validation.', details: ['Containerized Worker'],
    x: 59, y: 38, groupId: 'agents'
  },
  // Row 2
  {
    id: 'agent-metadata', title: 'Lineage Agent', icon: <Workflow className="text-rose-300" />,
    category: 'compute', description: 'Graph builder.', details: ['Containerized Worker'],
    x: 29, y: 55, groupId: 'agents'
  },
  {
    id: 'agent-ai', title: 'AI Readiness', icon: <Zap className="text-rose-300" />,
    category: 'compute', description: 'Tokenization & Normalization.', details: ['Containerized Worker'],
    x: 44, y: 55, groupId: 'agents'
  },
  {
    id: 'agent-report', title: 'Reporting', icon: <FileCheck className="text-rose-300" />,
    category: 'compute', description: 'Compliance PDF generation.', details: ['Containerized Worker'],
    x: 59, y: 55, groupId: 'agents'
  },

  // --- STORAGE ZONES ---
  {
    id: 'raw', title: 'Raw Zone', icon: <HardDrive className="text-green-400" />,
    category: 'storage', description: 'Immutable landing zone.', details: ['S3 Standard'],
    x: 10, y: 83, groupId: 'storage'
  },
  {
    id: 'staging', title: 'Staging Zone', icon: <Layers className="text-green-400" />,
    category: 'storage', description: 'Transient processing.', details: ['S3 IA'],
    x: 26, y: 83, groupId: 'storage'
  },
  {
    id: 'curated', title: 'Curated Zone', icon: <Archive className="text-green-400" />,
    category: 'storage', description: 'Gold standard data.', details: ['S3 Standard'],
    x: 42, y: 83, groupId: 'storage'
  },
  {
    id: 'evidence', title: 'Evidence Zone', icon: <FileText className="text-green-400" />,
    category: 'storage', description: 'Audit logs & Reports.', details: ['S3 Glacier'],
    x: 58, y: 83, groupId: 'storage'
  },

  // --- INTEGRATIONS ---
  {
    id: 'athena', title: 'Athena / Redshift', icon: <Database className="text-cyan-300" />,
    category: 'external', description: 'SQL Analytics.', details: [],
    x: 77, y: 68, groupId: 'integrations'
  },
  {
    id: 'vertex', title: 'Vertex / Sagemaker', icon: <BrainCircuit className="text-cyan-300" />,
    category: 'external', description: 'Model Training Handoff.', details: [],
    x: 77, y: 80, groupId: 'integrations'
  },

  // --- OBSERVABILITY ---
  {
    id: 'cloudwatch', title: 'CloudWatch', icon: <Eye className="text-purple-400" />,
    category: 'observability', description: 'Logs & Metrics.', details: [],
    x: 77, y: 25, groupId: 'observability'
  },

  // --- INFRASTRUCTURE / SECURITY ---
  {
    id: 'kms', title: 'KMS', icon: <Lock className="text-red-400" />,
    category: 'security', description: 'Encryption keys.', details: [],
    x: 8, y: 15, groupId: 'vpc'
  },
  {
    id: 'iam', title: 'IAM', icon: <UserCog className="text-red-400" />,
    category: 'security', description: 'Role-based access.', details: [],
    x: 15, y: 15, groupId: 'vpc'
  },
  {
    id: 'privatelink', title: 'PrivateLink', icon: <Lock className="text-indigo-400" />,
    category: 'external', description: 'Secure Tunnel.', details: [],
    x: 85, y: 45
  },

  // --- SAAS ---
  {
    id: 'saas', title: 'SaaS Control Plane', icon: <Globe className="text-blue-500" />,
    category: 'external', description: 'Optional Management UI.', details: ['Metadata Only'],
    x: 95, y: 45
  }
];

// --- CONNECTIONS ---
export const CONNECTIONS: Connection[] = [
  // Control Plane
  { from: 'controller', to: 'sqs', label: 'Dispatch' },
  { from: 'sqs', to: 'agent-discovery', label: 'Trigger' },
  { from: 'sqs', to: 'agent-pii', label: 'Trigger' },
  { from: 'sqs', to: 'agent-quality', label: 'Trigger' },
  { from: 'sqs', to: 'agent-metadata', label: 'Trigger' },
  { from: 'sqs', to: 'agent-ai', label: 'Trigger' },
  { from: 'sqs', to: 'agent-report', label: 'Trigger' },

  // Policy & Metadata Lookups (All agents talk to stores)
  { from: 'agent-pii', to: 'policy-store', label: 'Get Rules' },
  { from: 'agent-quality', to: 'policy-store', label: 'Get Rules' },
  { from: 'agent-discovery', to: 'metadata-store', label: 'Update Schema' },
  { from: 'agent-metadata', to: 'metadata-store', label: 'Update Lineage' },

  // Data Flow: Discovery
  { from: 'raw', to: 'agent-discovery', label: 'Scan' },
  
  // Data Flow: PII
  { from: 'raw', to: 'agent-pii', label: 'Read' },
  { from: 'agent-pii', to: 'staging', label: 'Write Clean' },

  // Data Flow: DQ
  { from: 'staging', to: 'agent-quality', label: 'Validate' },
  { from: 'agent-quality', to: 'curated', label: 'Write Gold' },

  // Data Flow: AI & Metadata
  { from: 'curated', to: 'agent-ai', label: 'Vectorize' },
  { from: 'curated', to: 'agent-metadata', label: 'Analyze' },

  // Data Flow: Reporting
  { from: 'agent-report', to: 'evidence', label: 'Save PDF' },

  // Integrations
  { from: 'curated', to: 'athena', label: 'Query' },
  { from: 'curated', to: 'vertex', label: 'Train' },

  // Observability
  { from: 'controller', to: 'cloudwatch', label: 'Logs' },
  
  // External
  { from: 'metadata-store', to: 'privatelink', label: 'Sync Status' },
  { from: 'privatelink', to: 'saas', label: 'Dashboard' }
];