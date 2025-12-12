import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SystemNode } from '../types';
import { X, ChevronRight, ShieldCheck, Database, Server } from 'lucide-react';

interface InfoPanelProps {
  node: SystemNode | null;
  onClose: () => void;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ node, onClose }) => {
  return (
    <AnimatePresence>
      {node && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="absolute top-4 right-4 bottom-4 w-96 bg-slate-900/95 backdrop-blur-xl border-l border-slate-700 shadow-2xl z-20 rounded-xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-700 flex justify-between items-start bg-slate-800/50">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-slate-800 rounded-lg shadow-inner">
                {node.icon}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{node.title}</h2>
                <span className="text-xs font-mono text-slate-400 uppercase">{node.category}</span>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-1 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Description */}
            <div>
              <h3 className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider">Overview</h3>
              <p className="text-slate-300 leading-relaxed text-sm">
                {node.description}
              </p>
            </div>

            {/* Key Features/Details List */}
            <div>
              <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">Capabilities & Specs</h3>
              <ul className="space-y-3">
                {node.details.map((detail, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-200 bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                    <ChevronRight size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contextual Info based on Category */}
            {node.category === 'storage' && (
              <div className="bg-blue-900/20 border border-blue-900/50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2 text-blue-400">
                  <Database size={16} />
                  <span className="font-semibold text-sm">Data Governance</span>
                </div>
                <p className="text-xs text-blue-200/70">
                  This storage bucket is encrypted at rest using AWS KMS. Lifecycle policies ensure data is transitioned or expired according to compliance rules.
                </p>
              </div>
            )}

            {node.category === 'security' && (
              <div className="bg-red-900/20 border border-red-900/50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2 text-red-400">
                  <ShieldCheck size={16} />
                  <span className="font-semibold text-sm">Zero Trust</span>
                </div>
                <p className="text-xs text-red-200/70">
                  Adheres to least-privilege access. No public internet exposure. All traffic routed via VPC Endpoints.
                </p>
              </div>
            )}
          </div>

          {/* Footer Status */}
          <div className="p-4 border-t border-slate-700 bg-slate-950/50 text-xs text-slate-500 flex justify-between items-center">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              Active
            </span>
            <span className="font-mono">ID: {node.id}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InfoPanel;