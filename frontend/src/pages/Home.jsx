import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Activity, ShieldCheck, Zap, ScanLine, Camera, BarChart3 } from "lucide-react";

export default function Home() {
  const [terminalText, setTerminalText] = useState("");
  const fullText = "> Initializing System...\n> Loading YOLOv8 Weights...\n> Calibrating sensors...\n> Ready for analysis.";

  useEffect(() => {
    let currentText = "";
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      if (currentIndex < fullText.length) {
        currentText += fullText[currentIndex];
        setTerminalText(currentText);
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 50);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center pt-8 pb-20 animate-fade-in-up">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(180px,auto)]">
        
        {/* Main Hero Bento Box (Spans 2 columns, 2 rows) */}
        <div className="bento-box md:col-span-2 md:row-span-2 p-10 flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute -right-20 -top-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-blue-600/20 transition-colors duration-1000"></div>
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 w-max mb-6">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">v2.0 Model Live</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
            Enterprise Grade <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Road Damage Detection</span>
          </h1>
          
          <p className="text-zinc-400 text-lg max-w-xl mb-10 leading-relaxed">
            Instantly detect, classify, and assess infrastructure severity using cutting-edge computer vision. Built for municipal efficiency and smart city maintenance.
          </p>
          
          <div className="flex items-center gap-4">
            <Link to="/upload" className="group flex items-center gap-2 bg-zinc-100 text-zinc-900 font-semibold px-6 py-3 rounded-xl hover:bg-white transition-colors shadow-lg">
              Start Analysis
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Small Box 1: System Status */}
        <div className="bento-box p-8 flex flex-col justify-between group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <h3 className="text-zinc-400 text-sm font-medium mb-1">System Status</h3>
            <p className="text-2xl font-bold text-zinc-100">All Systems Operational</p>
          </div>
        </div>

        {/* Small Box 2: System Terminal */}
        <div className="bento-box p-6 flex flex-col justify-start group bg-black/60 font-mono relative overflow-hidden border-zinc-800">
          <div className="absolute top-0 left-0 w-full h-1 bg-zinc-800"></div>
          <div className="flex items-center gap-2 mb-4 opacity-50">
            <ScanLine className="w-4 h-4 text-zinc-400" />
            <span className="text-xs text-zinc-400 font-semibold tracking-wider">SYSTEM.LOG</span>
          </div>
          <div className="text-emerald-400/90 text-xs leading-relaxed whitespace-pre-wrap">
            {terminalText}
            <span className="inline-block w-1.5 h-3 bg-emerald-400 animate-pulse ml-1 align-middle"></span>
          </div>
        </div>

        {/* Feature Box 1 */}
        <div className="bento-box p-8 group hover:-translate-y-1 transition-transform duration-300">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6 border border-purple-500/20">
            <Camera className="w-6 h-6 text-purple-400" />
          </div>
          <h3 className="text-lg font-bold text-zinc-100 mb-2">High-Res Analysis</h3>
          <p className="text-sm text-zinc-400 leading-relaxed">Process high-resolution imagery to detect micro-cracks and early stage potholes.</p>
        </div>

        {/* Feature Box 2 */}
        <div className="bento-box p-8 group hover:-translate-y-1 transition-transform duration-300">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-6 border border-amber-500/20">
            <ShieldCheck className="w-6 h-6 text-amber-400" />
          </div>
          <h3 className="text-lg font-bold text-zinc-100 mb-2">Reliable Scoring</h3>
          <p className="text-sm text-zinc-400 leading-relaxed">Automated severity scoring helps prioritize maintenance tasks effectively.</p>
        </div>

        {/* Feature Box 3 */}
        <div className="bento-box p-8 group hover:-translate-y-1 transition-transform duration-300">
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 flex items-center justify-center mb-6 border border-sky-500/20">
            <BarChart3 className="w-6 h-6 text-sky-400" />
          </div>
          <h3 className="text-lg font-bold text-zinc-100 mb-2">Detailed Reports</h3>
          <p className="text-sm text-zinc-400 leading-relaxed">Export comprehensive analysis reports for municipal stakeholders.</p>
        </div>

      </div>
    </div>
  );
}
