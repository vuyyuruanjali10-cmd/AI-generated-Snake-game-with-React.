/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Github, Twitter, Cpu, Zap } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-dark-surface relative overflow-hidden flex flex-col items-center justify-center py-12 px-6">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[10%] left-[5%] w-[400px] h-[400px] bg-neon-cyan/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[5%] w-[500px] h-[500px] bg-neon-magenta/5 rounded-full blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#1a1a1f_1px,transparent_1px)] [background-size:40px_40px] opacity-20" />
      </div>

      <header className="relative z-10 w-full max-w-6xl mb-12 flex justify-between items-center opacity-80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-neon-cyan rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(0,243,255,0.4)]">
            <Cpu className="text-black" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tighter text-white">NEON RHYTHM</h1>
            <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.3em]">Synapse V1.0</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6 text-white/40">
           <Github size={20} className="hover:text-neon-cyan cursor-pointer transition-colors" />
           <Twitter size={20} className="hover:text-neon-magenta cursor-pointer transition-colors" />
        </div>
      </header>

      <main className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
        {/* Game Section (Center-focused) */}
        <motion.section 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col items-center justify-center min-h-[600px] bg-white/[0.02] border border-white/5 rounded-3xl p-8 backdrop-blur-md"
        >
          <div className="mb-0 flex flex-col items-center">
            <SnakeGame />
          </div>
        </motion.section>

        {/* Music Player Section */}
        <motion.section
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-6"
        >
          <MusicPlayer />
          
          {/* Status Widget */}
          <div className="p-6 bg-dark-surface border border-white/5 rounded-3xl neon-border opacity-60">
             <div className="flex items-center gap-3 mb-4">
                <Zap size={18} className="text-neon-lime" />
                <span className="text-xs font-mono font-bold tracking-widest uppercase">System Status</span>
             </div>
             <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-white/40 uppercase tracking-wider">Sync State</span>
                  <span className="text-[10px] text-neon-cyan font-mono italic">ESTABLISHED</span>
                </div>
                <div className="w-full bg-white/5 h-[2px] rounded-full overflow-hidden">
                   <motion.div 
                    animate={{ width: ["0%", "100%", "0%"] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="h-full bg-neon-cyan"
                   />
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-[10px] text-white/40 uppercase tracking-wider">Latency</span>
                  <span className="text-[10px] text-white/60 font-mono">1ms</span>
                </div>
             </div>
          </div>
        </motion.section>
      </main>

      <footer className="relative z-10 w-full max-w-6xl mt-16 flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 text-[10px] font-mono text-white/20 tracking-widest uppercase">
        <div className="flex gap-8 mb-4 md:mb-0">
          <span className="hover:text-white cursor-pointer transition-colors border-b border-transparent hover:border-white/20 pb-1">Documentation</span>
          <span className="hover:text-white cursor-pointer transition-colors border-b border-transparent hover:border-white/20 pb-1">Security</span>
          <span className="hover:text-white cursor-pointer transition-colors border-b border-transparent hover:border-white/20 pb-1">Kernel Logs</span>
        </div>
        <div>
          DESIGNED FOR THE NEXT GENERATION OF DIGITAL CITIZENS
        </div>
      </footer>
    </div>
  );
}
