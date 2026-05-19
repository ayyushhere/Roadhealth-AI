import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Download } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api";

function ResultDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResult();
  }, [id]);

  async function fetchResult() {
    try {
      const response = await api.get(`/results/${id}`);
      setData(response.data);
    } catch (error) {
      toast.error("Error fetching analysis details");
    } finally {
      setLoading(false);
    }
  }

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'high': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'medium': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'low': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      default: return 'text-zinc-400 bg-zinc-800 border-zinc-700';
    }
  };

  const handleExport = () => {
    window.print();
    toast.success("Export dialogue opened");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="w-10 h-10 border-4 border-zinc-700 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 text-center flex flex-col items-center justify-center h-[60vh]">
        <h2 className="text-xl font-bold text-zinc-100 mb-4">Result not found</h2>
        <Link to="/results" className="text-blue-400 hover:text-blue-300 font-medium">&larr; Back to Results</Link>
      </div>
    );
  }

  return (
    <div className="w-full pt-6 pb-20 animate-fade-in-up">
      <Link to="/results" className="inline-flex items-center text-zinc-500 hover:text-zinc-100 mb-8 transition-colors font-medium">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Repository
      </Link>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Image Bento */}
        <div className="w-full lg:w-2/3">
          <div className="bento-box p-2 h-full flex flex-col">
            <div className="w-full h-full rounded-2xl overflow-hidden bg-black/50 border border-zinc-800 flex items-center justify-center relative flex-1">
              <div className="relative inline-block max-w-full max-h-[70vh]">
                <img
                  src={`http://127.0.0.1:8000/storage/${data.image_path}`}
                  alt="Road Analysis"
                  className="max-w-full max-h-[70vh] w-auto h-auto rounded-2xl object-contain block"
                />
                
                {/* Visual Bounding Box Overlay */}
                {(() => {
                  if (!data.detection?.box) return null;
                  
                  // Handle both old single-box format and new multi-box format
                  const boxesToRender = typeof data.detection.box[0] === 'number' 
                    ? [{ coords: data.detection.box, damage: data.detection.damage, confidence: data.detection.confidence }]
                    : data.detection.box;

                  return boxesToRender.map((b, index) => {
                    if (!b.coords) return null;
                    return (
                      <div 
                        key={index}
                        className="absolute border-2 border-blue-500 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.6)] group hover:bg-blue-500/20 transition-colors"
                        style={{
                          left: `${b.coords[0] * 100}%`,
                          top: `${b.coords[1] * 100}%`,
                          width: `${(b.coords[2] - b.coords[0]) * 100}%`,
                          height: `${(b.coords[3] - b.coords[1]) * 100}%`
                        }}
                      >
                        <div className="absolute -top-6 left-0 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                          {b.damage} ({b.confidence}%)
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>
        </div>

        {/* Details Bento Grid */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          <div className="bento-box p-8 flex-grow">
            <div className="mb-8">
              <h2 className="text-xs font-bold text-zinc-500 tracking-widest uppercase mb-2">Detected Issue</h2>
              <h1 className="text-3xl font-extrabold text-zinc-100 capitalize">{data.detection?.damage || 'No Detection'}</h1>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-sm font-medium text-zinc-500 mb-3">Severity Rating</h3>
                <div className={`inline-flex items-center px-4 py-2 rounded-lg border font-bold uppercase tracking-wider text-sm ${getSeverityColor(data.detection?.severity)}`}>
                  {data.detection?.severity || 'Unknown'} Level
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-medium text-zinc-500">AI Confidence Score</h3>
                  <span className="font-mono text-xl font-bold text-blue-400">{data.detection?.confidence || 0}%</span>
                </div>
                <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                  <div 
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${data.detection?.confidence || 0}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="pt-6 border-t border-zinc-800">
                <h3 className="text-sm font-medium text-zinc-500 mb-2">Analysis Timestamp</h3>
                <p className="text-zinc-300 font-mono text-sm">
                  {new Date(data.created_at).toLocaleString()}
                </p>
                <p className="text-zinc-500 font-mono text-xs mt-1">ID: {data.id}</p>
              </div>
            </div>
          </div>

          <button onClick={handleExport} className="bento-box py-4 flex items-center justify-center gap-2 hover:bg-zinc-800 text-zinc-100 font-bold transition-colors group">
            <Download className="w-5 h-5 text-zinc-400 group-hover:text-blue-400 transition-colors" />
            Export Report
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResultDetail;
