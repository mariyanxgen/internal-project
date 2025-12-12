import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Info, Settings, Layout, Download, ChevronRight, User, Shield, Activity, Users, FileCheck, BrainCircuit } from 'lucide-react';
import ArchitectureMap from './components/ArchitectureMap';
import InfoPanel from './components/InfoPanel';
import { SystemNode, FlowState, ViewMode, PersonaType } from './types';
import { NODES, PERSONAS } from './constants';

const App: React.FC = () => {
  const [activeNode, setActiveNode] = useState<SystemNode | null>(null);
  const [flowState, setFlowState] = useState<FlowState>(FlowState.IDLE);
  const [viewMode, setViewMode] = useState<ViewMode>('STANDARD');
  const [persona, setPersona] = useState<PersonaType>('NONE');
  const [isPlaying, setIsPlaying] = useState(false);
  const [description, setDescription] = useState<string>("Ready to simulate Nexus Agents.");
  const [stepProgress, setStepProgress] = useState(0);
  const [showFinalDashboard, setShowFinalDashboard] = useState(false);
  const flowTimerRef = useRef<number | null>(null);

  const TOTAL_STEPS = 12;

  // Workflow Simulation Logic
  const startSimulation = () => {
    setIsPlaying(true);
    setFlowState(FlowState.STEP_1_INGEST);
    setActiveNode(null); 
    setStepProgress(1);
    setShowFinalDashboard(false);
    setViewMode('STANDARD');
    setPersona('NONE');
  };

  const stopSimulation = () => {
    setIsPlaying(false);
    setFlowState(FlowState.IDLE);
    setDescription("Simulation stopped.");
    setStepProgress(0);
    setShowFinalDashboard(false);
    if (flowTimerRef.current) clearTimeout(flowTimerRef.current);
  };

  const triggerFailureSimulation = () => {
    stopSimulation();
    setFlowState(FlowState.FAILURE_SIMULATION);
    setDescription("RESILIENCE DEMO: Simulating Job Failure. SQS moves message to Dead Letter Queue (DLQ). Controller initiates exponential backoff retry.");
    setViewMode('RESILIENCE');
    setTimeout(() => {
        setDescription("RESILIENCE DEMO: Retry successful. System recovering...");
        setTimeout(() => {
            setFlowState(FlowState.IDLE);
            setViewMode('STANDARD');
            setDescription("Ready to simulate Nexus Agents.");
        }, 3000);
    }, 4000);
  }

  useEffect(() => {
    if (!isPlaying) return;

    let nextState: FlowState = FlowState.IDLE;
    let delay = 3500; 
    let text = "";
    let step = 0;

    switch (flowState) {
      case FlowState.STEP_1_INGEST:
        nextState = FlowState.STEP_2_CONTROLLER_START;
        text = "Raw Data Ingestion: Customer uploads encrypted datasets into the Raw S3 Zone.";
        step = 1;
        break;
      case FlowState.STEP_2_CONTROLLER_START:
        nextState = FlowState.STEP_3_DISPATCH;
        text = "Job Initialization: Orchestrator detects new objects and initializes the processing manifest.";
        step = 2;
        break;
      case FlowState.STEP_3_DISPATCH:
        nextState = FlowState.STEP_4_DISCOVERY;
        text = "Task Orchestration: Controller dispatches granular tasks via SQS to the Agent Swarm.";
        step = 3;
        break;
      case FlowState.STEP_4_DISCOVERY:
        nextState = FlowState.STEP_5_PII;
        text = "Discovery Phase: Discovery Agent scans raw files and updates the Metadata Store.";
        step = 4;
        break;
      case FlowState.STEP_5_PII:
        nextState = FlowState.STEP_6_QUALITY;
        text = "PII Remediation: Agent fetches masking rules from Policy Store and writes to Staging Zone.";
        step = 5;
        break;
      case FlowState.STEP_6_QUALITY:
        nextState = FlowState.STEP_7_METADATA;
        text = "Data Quality: Validation Agent enforces constraints before promoting to Curated Zone.";
        step = 6;
        break;
      case FlowState.STEP_7_METADATA:
        nextState = FlowState.STEP_8_AI_READY;
        text = "Lineage & Metadata: Lineage Agent captures graph relationships in the Metadata Store.";
        step = 7;
        break;
      case FlowState.STEP_8_AI_READY:
        nextState = FlowState.STEP_9_REPORTING;
        text = "AI Optimization: AI Agent tokenizes data for downstream Vector DBs and model training.";
        step = 8;
        break;
      case FlowState.STEP_9_REPORTING:
        nextState = FlowState.STEP_10_OBSERVABILITY;
        text = "Compliance Reporting: Reporting Agent generates immutable audit trails in the Evidence Zone.";
        step = 9;
        break;
      case FlowState.STEP_10_OBSERVABILITY:
        nextState = FlowState.STEP_11_SYNC;
        text = "Observability: Telemetry, logs, and distributed traces are aggregated in CloudWatch.";
        step = 10;
        break;
      case FlowState.STEP_11_SYNC:
        nextState = FlowState.STEP_12_COMPLETE;
        text = "SaaS Synchronization: High-level job status synced to optional Control Plane via PrivateLink.";
        step = 11;
        break;
      case FlowState.STEP_12_COMPLETE:
        nextState = FlowState.IDLE;
        text = "Pipeline Complete: Data is securely prepared, audited, and ready for Analytics & AI.";
        step = 12;
        delay = 6000;
        setShowFinalDashboard(true);
        break;
      case FlowState.IDLE: 
        setIsPlaying(false);
        text = "Ready to simulate Nexus Agents.";
        step = 0;
        return;
    }

    setDescription(text);
    setStepProgress(step);

    flowTimerRef.current = window.setTimeout(() => {
      setFlowState(nextState);
    }, delay);

    return () => {
      if (flowTimerRef.current) clearTimeout(flowTimerRef.current);
    };
  }, [flowState, isPlaying]);

  return (
    <div className="w-full h-screen bg-slate-950 text-slate-200 flex flex-col relative overflow-hidden font-sans">
      
      {/* Cinematic Header */}
      <header className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md flex items-center justify-between px-6 z-30">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20 ring-1 ring-white/10">
            <Layout className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-white tracking-tight flex items-center gap-2">
              Nexus <span className="text-slate-600">|</span> <span className="text-blue-100 font-light">AWS MVP Architecture</span>
            </h1>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center gap-4">
            {/* View Mode Toggles */}
            <div className="hidden md:flex items-center bg-slate-900 p-1 rounded-lg border border-slate-800">
                <button 
                  onClick={() => { setViewMode(viewMode === 'SECURITY' ? 'STANDARD' : 'SECURITY'); setPersona('NONE'); }}
                  className={`px-3 py-1.5 rounded text-xs font-medium flex items-center gap-2 transition-all ${viewMode === 'SECURITY' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'text-slate-400 hover:text-white'}`}
                >
                    <Shield size={14} /> Security Layer
                </button>
                <div className="w-px h-4 bg-slate-800 mx-1"></div>
                <button 
                  onClick={() => triggerFailureSimulation()}
                  className={`px-3 py-1.5 rounded text-xs font-medium flex items-center gap-2 transition-all ${flowState === FlowState.FAILURE_SIMULATION ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'text-slate-400 hover:text-white'}`}
                >
                    <Activity size={14} /> Resilience Demo
                </button>
            </div>

            <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-lg border border-slate-800 ml-4">
                <button 
                    onClick={isPlaying ? stopSimulation : startSimulation}
                    className={`flex items-center gap-2 px-5 py-2 rounded-md text-sm font-semibold transition-all duration-300
                    ${isPlaying 
                        ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 ring-1 ring-red-500/20' 
                        : 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/20'
                    }`}
                >
                    {isPlaying ? <RotateCcw size={16} /> : <Play size={16} fill="currentColor" />}
                    {isPlaying ? 'ABORT' : 'START SIMULATION'}
                </button>
            </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 relative flex overflow-hidden bg-slate-950">
        
        {/* Diagram Area */}
        <div className="flex-1 h-full relative z-10 flex flex-col p-6">
          <ArchitectureMap 
            activeNode={activeNode} 
            onNodeClick={setActiveNode} 
            flowState={flowState}
            viewMode={viewMode}
            persona={persona}
          />
          
          {/* Cinematic HUD Overlay */}
          <div className="absolute bottom-8 left-6 right-6 flex flex-col items-center pointer-events-none z-40">
            <div className={`
                relative bg-slate-900/90 backdrop-blur-2xl border border-slate-700/50 p-0 rounded-2xl shadow-2xl max-w-4xl w-full transition-all duration-700 overflow-hidden
                ${(isPlaying || flowState === FlowState.FAILURE_SIMULATION) ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
              `}>
              
              {/* Progress Bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800">
                <div 
                  className={`h-full transition-all duration-1000 ease-out ${flowState === FlowState.FAILURE_SIMULATION ? 'bg-red-500' : 'bg-gradient-to-r from-blue-500 to-indigo-500'}`}
                  style={{ width: flowState === FlowState.FAILURE_SIMULATION ? '100%' : `${(stepProgress / TOTAL_STEPS) * 100}%` }}
                ></div>
              </div>

              <div className="p-6 flex items-start gap-6">
                {/* Step Indicator */}
                <div className="flex-shrink-0 w-16 h-16 bg-slate-800 rounded-xl flex flex-col items-center justify-center border border-slate-700">
                   {flowState === FlowState.FAILURE_SIMULATION ? (
                       <Activity className="text-red-500 animate-pulse" size={24} />
                   ) : (
                       <>
                        <span className="text-xs text-slate-400 font-mono uppercase">Step</span>
                        <span className="text-2xl font-bold text-white">{stepProgress}</span>
                       </>
                   )}
                </div>

                <div className="flex-1">
                  <h3 className={`text-sm font-bold uppercase tracking-widest mb-1 font-mono ${flowState === FlowState.FAILURE_SIMULATION ? 'text-red-400' : 'text-blue-400'}`}>
                    {flowState === FlowState.FAILURE_SIMULATION ? 'System Alert' : 'System Process'}
                  </h3>
                  <p className="text-xl font-light text-slate-100 leading-snug">
                    {description.split(':')[1] || description}
                  </p>
                  <p className="text-sm text-slate-500 mt-1 font-mono">
                    {description.split(':')[0] !== description ? description.split(':')[0] : 'System Idle'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FINAL DASHBOARD OVERLAY */}
        {showFinalDashboard && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
                <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-2xl w-full p-8 animate-in fade-in zoom-in duration-500">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                            <FileCheck size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Pipeline Completed Successfully</h2>
                        <p className="text-slate-400 mt-2">All agents executed with 0 errors. Data is AI-Ready.</p>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 text-center">
                            <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">Data Quality</div>
                            <div className="text-2xl font-bold text-emerald-400">99.8%</div>
                        </div>
                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 text-center">
                            <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">PII Redacted</div>
                            <div className="text-2xl font-bold text-blue-400">14,203</div>
                        </div>
                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 text-center">
                            <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">Processing Time</div>
                            <div className="text-2xl font-bold text-purple-400">4.2s</div>
                        </div>
                    </div>

                    <div className="space-y-3 mb-8">
                        <div className="flex items-center justify-between text-sm p-3 bg-slate-800/30 rounded-lg border border-slate-800">
                            <span className="flex items-center gap-2 text-slate-300"><Shield size={14} className="text-emerald-500"/> PII Audit Report Generated</span>
                            <span className="text-blue-400 font-mono cursor-pointer hover:underline">evidence/audit_2024.pdf</span>
                        </div>
                        <div className="flex items-center justify-between text-sm p-3 bg-slate-800/30 rounded-lg border border-slate-800">
                            <span className="flex items-center gap-2 text-slate-300"><BrainCircuit size={14} className="text-purple-500"/> AI Training Set Ready</span>
                            <span className="text-blue-400 font-mono cursor-pointer hover:underline">curated/train_v1.parquet</span>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <button 
                            onClick={() => setShowFinalDashboard(false)}
                            className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                        >
                            Close Report
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Side Panel (Contextual) */}
        <InfoPanel node={activeNode} onClose={() => setActiveNode(null)} />
        
      </main>
    </div>
  );
};

export default App;