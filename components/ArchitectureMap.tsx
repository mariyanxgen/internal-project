import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NODES, CONNECTIONS, GROUPS, PERSONAS } from '../constants';
import { SystemNode, FlowState, ViewMode, PersonaType } from '../types';
import { Lock, Shield, RefreshCcw } from 'lucide-react';

interface ArchitectureMapProps {
  activeNode: SystemNode | null;
  onNodeClick: (node: SystemNode) => void;
  flowState: FlowState;
  viewMode: ViewMode;
  persona: PersonaType;
}

const ArchitectureMap: React.FC<ArchitectureMapProps> = ({ activeNode, onNodeClick, flowState, viewMode, persona }) => {
  
  const getNodePos = (id: string) => {
    const node = NODES.find(n => n.id === id);
    return node ? { x: node.x, y: node.y } : { x: 0, y: 0 };
  };

  const getFlowColors = (flowState: FlowState) => {
    if (flowState === FlowState.FAILURE_SIMULATION) return ['#ef4444', '#b91c1c']; // Red for failure
    // Returns [activeColor, pulseColor]
    switch(flowState) {
      case FlowState.STEP_3_DISPATCH: return ['#f472b6', '#db2777']; // Pink
      case FlowState.STEP_4_DISCOVERY: return ['#fb7185', '#e11d48']; // Rose
      case FlowState.STEP_5_PII: return ['#38bdf8', '#0284c7']; // Light Blue
      case FlowState.STEP_6_QUALITY: return ['#818cf8', '#4f46e5']; // Indigo
      case FlowState.STEP_8_AI_READY: return ['#fbbf24', '#d97706']; // Amber
      case FlowState.STEP_9_REPORTING: return ['#4ade80', '#16a34a']; // Green
      case FlowState.STEP_10_OBSERVABILITY: return ['#c084fc', '#9333ea']; // Purple
      default: return ['#60a5fa', '#2563eb']; // Blue default
    }
  }

  const [activeThemeColor] = getFlowColors(flowState);

  // --- LOGIC HELPERS ---

  const isAutoscaling = () => {
    // Show multiple pods during heavy compute steps
    return [FlowState.STEP_5_PII, FlowState.STEP_6_QUALITY, FlowState.STEP_8_AI_READY].includes(flowState);
  };

  const isConnectionActive = (from: string, to: string) => {
    if (flowState === FlowState.IDLE) return false;
    
    // Resilience Demo
    if (flowState === FlowState.FAILURE_SIMULATION) {
       return (from === 'sqs' && to === 'controller') || (from === 'controller' && to === 'sqs');
    }

    // Lineage View: Only highlight Storage -> Storage/Agent paths
    if (viewMode === 'LINEAGE') {
       if (from === 'raw' || from === 'staging' || from === 'curated') return true;
       if (to === 'raw' || to === 'staging' || to === 'curated' || to === 'evidence') return true;
       return false;
    }

    // Standard Simulation
    switch (flowState) {
      case FlowState.STEP_1_INGEST: return false;
      case FlowState.STEP_2_CONTROLLER_START: return false; 
      case FlowState.STEP_3_DISPATCH: return from === 'controller' && (to === 'sqs' || to === 'eventbridge');
      
      case FlowState.STEP_4_DISCOVERY: 
        return (from === 'agent-discovery' && to === 'metadata-store') || (from === 'raw' && to === 'agent-discovery');
      
      case FlowState.STEP_5_PII: 
        return (from === 'agent-pii' && (to === 'raw' || to === 'staging')) || (from === 'agent-pii' && to === 'policy-store');
      
      case FlowState.STEP_6_QUALITY: 
        return (from === 'agent-quality' && (to === 'staging' || to === 'curated')) || (from === 'agent-quality' && to === 'policy-store');
      
      case FlowState.STEP_7_METADATA: 
        return from === 'agent-metadata' && (to === 'curated' || to === 'metadata-store');
      
      case FlowState.STEP_8_AI_READY: 
        return from === 'agent-ai' && to === 'curated';
      
      case FlowState.STEP_9_REPORTING: 
        return from === 'agent-report' && to === 'evidence';
      
      case FlowState.STEP_10_OBSERVABILITY: 
        return to === 'cloudwatch';
      
      case FlowState.STEP_11_SYNC: 
        return to === 'privatelink' || to === 'saas';
      
      default: return false;
    }
  };

  const isNodeActive = (nodeId: string) => {
    // If a persona is active, check if node belongs to persona
    if (persona !== 'NONE') {
      const activePersona = PERSONAS.find(p => p.id === persona);
      return activePersona?.activeNodes.includes(nodeId) || false;
    }

    // Resilience Demo
    if (flowState === FlowState.FAILURE_SIMULATION) {
      return nodeId === 'sqs' || nodeId === 'controller' || nodeId === 'eventbridge';
    }

    switch (flowState) {
      case FlowState.STEP_1_INGEST: return nodeId === 'raw';
      case FlowState.STEP_2_CONTROLLER_START: return nodeId === 'controller';
      case FlowState.STEP_3_DISPATCH: return nodeId === 'sqs' || nodeId === 'eventbridge' || nodeId === 'controller';
      case FlowState.STEP_4_DISCOVERY: return nodeId === 'agent-discovery' || nodeId === 'metadata-store';
      case FlowState.STEP_5_PII: return nodeId === 'agent-pii' || nodeId === 'policy-store';
      case FlowState.STEP_6_QUALITY: return nodeId === 'agent-quality' || nodeId === 'policy-store';
      case FlowState.STEP_7_METADATA: return nodeId === 'agent-metadata' || nodeId === 'metadata-store';
      case FlowState.STEP_8_AI_READY: return nodeId === 'agent-ai';
      case FlowState.STEP_9_REPORTING: return nodeId === 'agent-report';
      case FlowState.STEP_10_OBSERVABILITY: return nodeId === 'cloudwatch' || nodeId === 'xray';
      case FlowState.STEP_11_SYNC: return nodeId === 'metadata-store' || nodeId === 'privatelink' || nodeId === 'saas';
      case FlowState.STEP_12_COMPLETE: return nodeId === 'curated' || nodeId === 'evidence';
      default: return false;
    }
  };

  const isDimmed = (nodeId: string) => {
    // View Modes override dimming
    if (viewMode === 'SECURITY') {
       // Highlight Security Nodes, dim others
       return !['iam', 'kms', 'privatelink', 'policy-store'].includes(nodeId) && !GROUPS.find(g => g.id === 'vpc');
    }
    
    // Resilience Demo override
    if (flowState === FlowState.FAILURE_SIMULATION) {
      return !['sqs', 'controller', 'eventbridge'].includes(nodeId);
    }

    // Persona Dimming
    if (persona !== 'NONE') {
      const activePersona = PERSONAS.find(p => p.id === persona);
      return !activePersona?.activeNodes.includes(nodeId);
    }

    if (flowState === FlowState.IDLE || flowState === FlowState.STEP_12_COMPLETE) return false;
    return !isNodeActive(nodeId);
  }

  // Calculate IAM / KMS lines for Security View
  const securityLines = viewMode === 'SECURITY' ? NODES.filter(n => n.category !== 'security').map(n => ({ from: 'iam', to: n.id })) : [];
  
  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden rounded-xl border border-slate-800 shadow-2xl group">
      {/* Cinematic Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.15]"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950 pointer-events-none"></div>
      
      {/* SECURITY SHIELD OVERLAY */}
      <AnimatePresence>
        {viewMode === 'SECURITY' && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-0 pointer-events-none"
          >
             {/* VPC Shield Boundary */}
             <div className="absolute left-[1%] top-[1%] w-[85%] h-[98%] rounded-3xl border-4 border-red-500/30 shadow-[0_0_50px_rgba(239,68,68,0.1)]"></div>
             
             {/* Big Shield Icon */}
             <div className="absolute left-[40%] top-[40%] text-red-900/10">
                <Shield size={300} strokeWidth={0.5} />
             </div>

             {/* No Data Leaves Label */}
             <div className="absolute top-5 right-[20%] bg-red-900/80 text-red-200 px-4 py-2 rounded-lg border border-red-500/50 flex items-center gap-2 shadow-xl">
               <Shield size={16} />
               <span className="text-xs font-bold uppercase tracking-widest">VPC Isolation Active</span>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ANNOTATIONS (Architecture Highlights) */}
      <div className="absolute inset-0 pointer-events-none z-0">
          {/* Client Boundary Label */}
          <div className="absolute top-2 left-[40%] border-t-2 border-dashed border-slate-700 w-[45%] flex justify-center">
             <span className="bg-slate-950 px-2 text-[10px] text-slate-500 font-mono -mt-2">CLIENT CLOUD BOUNDARY (AWS ACCOUNT)</span>
          </div>

          {/* Annotations */}
          <div className="absolute bottom-5 left-8 text-slate-500 text-[10px] font-mono max-w-[150px] leading-tight opacity-50">
             <span className="block mb-1 text-slate-400 font-bold">● Data Sovereignty</span>
             Data never leaves the client environment.
          </div>
          <div className="absolute top-[45%] right-[10%] text-slate-500 text-[10px] font-mono max-w-[100px] text-right leading-tight opacity-50">
             <span className="block mb-1 text-slate-400 font-bold">● Optional SaaS</span>
             Metadata only. Control plane optional.
          </div>
          <div className="absolute top-[45%] left-[15%] text-slate-500 text-[10px] font-mono max-w-[100px] leading-tight opacity-50">
             <span className="block mb-1 text-slate-400 font-bold">● Scalability</span>
             Agents scale horizontally (EKS).
          </div>
      </div>

      {/* GROUPS / ZONES */}
      {GROUPS.map((group) => {
        const groupHasActiveNode = NODES.filter(n => n.groupId === group.id).some(n => isNodeActive(n.id));
        
        return (
          <motion.div
            key={group.id}
            animate={{ 
              borderColor: viewMode === 'SECURITY' && group.id === 'vpc' ? '#ef4444' : (groupHasActiveNode ? activeThemeColor : 'rgba(71, 85, 105, 0.3)'),
              opacity: (viewMode === 'SECURITY' && group.id !== 'vpc') ? 0.1 : (isDimmed('any') && !groupHasActiveNode ? 0.2 : 1)
            }}
            transition={{ duration: 0.5 }}
            className={`absolute rounded-xl border-2 border-dashed`}
            style={{
              left: `${group.x}%`,
              top: `${group.y}%`,
              width: `${group.width}%`,
              height: `${group.height}%`,
              zIndex: 0
            }}
          >
            <div className={`
              absolute -top-3 left-4 px-3 py-0.5 
              bg-slate-950 text-[10px] font-mono font-bold uppercase tracking-widest 
              border border-slate-800 rounded shadow-sm flex items-center gap-2
              ${groupHasActiveNode ? 'text-white border-blue-500/50' : (group.labelColor || 'text-slate-500')}
            `}>
              {group.title}
            </div>
          </motion.div>
        );
      })}

      {/* CONNECTIONS LAYERS */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
        <defs>
          <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="18" refY="2" orient="auto">
            <polygon points="0 0, 6 2, 0 4" fill="#334155" />
          </marker>
           <marker id="arrowhead-active" markerWidth="6" markerHeight="4" refX="18" refY="2" orient="auto">
            <polygon points="0 0, 6 2, 0 4" fill={activeThemeColor} />
          </marker>
           <marker id="arrowhead-security" markerWidth="6" markerHeight="4" refX="18" refY="2" orient="auto">
            <polygon points="0 0, 6 2, 0 4" fill="#ef4444" />
          </marker>
        </defs>
        
        {/* Security Lines (IAM) */}
        {viewMode === 'SECURITY' && securityLines.map((conn, idx) => {
           const start = getNodePos(conn.from);
           const end = getNodePos(conn.to);
           if (!start.x || !end.x) return null;
           return (
             <motion.line 
               key={`sec-${idx}`}
               initial={{ pathLength: 0, opacity: 0 }}
               animate={{ pathLength: 1, opacity: 0.3 }}
               x1={`${start.x}%`} y1={`${start.y}%`} x2={`${end.x}%`} y2={`${end.y}%`}
               stroke="#ef4444" strokeWidth={1} strokeDasharray="2,2"
             />
           )
        })}

        {/* Standard Connections */}
        {CONNECTIONS.map((conn, idx) => {
          const start = getNodePos(conn.from);
          const end = getNodePos(conn.to);
          const active = isConnectionActive(conn.from, conn.to);
          const dim = (flowState !== FlowState.IDLE && !active && flowState !== FlowState.STEP_12_COMPLETE) || (persona !== 'NONE');

          return (
            <g key={`${conn.from}-${conn.to}-${idx}`}>
              <line 
                x1={`${start.x}%`} 
                y1={`${start.y}%`} 
                x2={`${end.x}%`} 
                y2={`${end.y}%`} 
                stroke={active ? activeThemeColor : "#334155"} 
                strokeWidth={active ? 2 : 1}
                strokeDasharray={active ? "0" : "4,4"}
                markerEnd={active ? "url(#arrowhead-active)" : "url(#arrowhead)"}
                opacity={dim ? 0.05 : (active ? 0.8 : 0.3)}
              />
              {/* Particle Animation */}
              <AnimatePresence>
                {active && (
                  <motion.circle
                    r={3}
                    fill={flowState === FlowState.FAILURE_SIMULATION ? "#ef4444" : "#ffffff"}
                    initial={{ cx: `${start.x}%`, cy: `${start.y}%` }}
                    animate={{ cx: `${end.x}%`, cy: `${end.y}%` }}
                    transition={{ 
                      duration: flowState === FlowState.FAILURE_SIMULATION ? 0.5 : 1, 
                      repeat: Infinity, 
                      ease: "linear",
                      repeatDelay: 0.2
                    }}
                  />
                )}
              </AnimatePresence>
            </g>
          );
        })}
      </svg>

      {/* NODES LAYER */}
      {NODES.map((node) => {
        const isActive = isNodeActive(node.id);
        const isSelected = activeNode?.id === node.id;
        const dimmed = isDimmed(node.id);
        
        // Autoscaling Logic: Check if this node is an agent and we are in processing step
        const showAutoscale = isAutoscaling() && node.id.startsWith('agent-') && isActive && viewMode === 'STANDARD';

        return (
          <motion.div
            key={node.id}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20`}
            style={{ left: `${node.x}%`, top: `${node.y}%`, width: '100px' }}
            onClick={() => onNodeClick(node)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: dimmed ? 0.2 : 1, 
              scale: isActive ? 1.1 : 1,
              filter: dimmed ? 'grayscale(100%)' : 'grayscale(0%)'
            }}
            transition={{ duration: 0.5 }}
          >
            {/* AUTOSCALING GHOST CARDS */}
            <AnimatePresence>
              {showAutoscale && (
                <>
                  <motion.div 
                    initial={{ opacity: 0, x: 0, y: 0 }}
                    animate={{ opacity: 0.5, x: 5, y: -5 }}
                    exit={{ opacity: 0, x: 0, y: 0 }}
                    className="absolute inset-0 bg-slate-800 border border-slate-600 rounded-xl -z-10"
                  />
                  <motion.div 
                    initial={{ opacity: 0, x: 0, y: 0 }}
                    animate={{ opacity: 0.3, x: 10, y: -10 }}
                    exit={{ opacity: 0, x: 0, y: 0 }}
                    className="absolute inset-0 bg-slate-800 border border-slate-600 rounded-xl -z-20"
                  />
                </>
              )}
            </AnimatePresence>

            {/* Main Card Body */}
            <div className={`
              relative flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-300
              ${isSelected 
                ? 'bg-slate-800 border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.4)]' 
                : isActive
                  ? `bg-slate-900 border-[${activeThemeColor}] shadow-[0_0_15px_${activeThemeColor}40]`
                  : 'bg-slate-900/80 border-slate-700 hover:border-slate-500 hover:bg-slate-800'
              }
              backdrop-blur-sm
            `}>
              
              {/* Security Lock Badge */}
              {viewMode === 'SECURITY' && (['raw', 'staging', 'curated', 'evidence', 'metadata-store', 'policy-store'].includes(node.id)) && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg z-30">
                  <Lock size={10} />
                </div>
              )}

              {/* Icon Container */}
              <div className={`
                p-2 rounded-lg mb-2 transition-colors duration-300
                ${isSelected ? 'bg-blue-500/20 text-blue-100' : 'bg-slate-950 text-slate-400'}
                ${isActive && !isSelected ? 'text-white' : ''}
              `}>
                {React.cloneElement(node.icon as React.ReactElement<any>, { 
                  size: 20, 
                  strokeWidth: isActive ? 2.5 : 2 
                })}
              </div>

              {/* Label */}
              <div className={`
                text-[10px] font-bold text-center leading-tight tracking-tight font-mono
                ${isSelected ? 'text-white' : 'text-slate-300'}
              `}>
                {node.title}
              </div>

              {/* Resilience/Failure Badge */}
              {flowState === FlowState.FAILURE_SIMULATION && node.id === 'sqs' && (
                <motion.div 
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="absolute -bottom-2 -left-2 bg-red-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded border border-red-400"
                >
                  DLQ RETRY
                </motion.div>
              )}

            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ArchitectureMap;