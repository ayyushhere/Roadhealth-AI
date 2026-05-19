import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api";

function Results() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchResults();
  }, []);

  async function fetchResults() {
    try {
      const response = await api.get('/results');
      setResults(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate('/login');
      } else {
        toast.error("Failed to fetch results");
      }
    } finally {
      setLoading(false);
    }
  }

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'high': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'medium': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'low': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      default: return 'bg-zinc-800 text-zinc-400 border-zinc-700';
    }
  };

  return (
    <div className="w-full pt-10 pb-20 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-zinc-100 mb-4 md:mb-0">
          Analysis Repository
        </h1>
        <Link 
          to="/upload" 
          className="bg-zinc-100 hover:bg-white text-zinc-900 px-6 py-2.5 rounded-full font-medium transition-colors shadow-lg"
        >
          &larr; New Upload
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-zinc-700 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : results.length === 0 ? (
        <div className="bento-box p-16 text-center border-dashed border-2">
          <h3 className="text-xl font-semibold text-zinc-300">No analysis results found</h3>
          <p className="text-zinc-500 mt-2">Upload an image to start building your repository.</p>
          <Link to="/upload" className="inline-block mt-6 text-blue-400 hover:text-blue-300 font-medium">Go to Upload</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((item) => (
            <Link 
              to={`/results/${item.id}`}
              key={item.id} 
              className="bento-box overflow-hidden flex flex-col group hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              {/* Image Section */}
              <div className="relative aspect-video overflow-hidden bg-zinc-950 border-b border-zinc-800 flex items-center justify-center">
                <div className="relative inline-block w-full h-full">
                  <img
                    src={`http://127.0.0.1:8000/storage/${item.image_path}`}
                    alt="Road Analysis"
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  
                  {/* Bounding Box Overlay */}
                  {(() => {
                    if (!item.detection?.box) return null;
                    const boxesToRender = typeof item.detection.box[0] === 'number' 
                      ? [{ coords: item.detection.box }]
                      : item.detection.box;

                    return boxesToRender.map((b, index) => {
                      if (!b.coords) return null;
                      return (
                        <div 
                          key={index}
                          className="absolute border border-blue-500 bg-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.5)] group-hover:scale-105 transition-transform duration-500 ease-out pointer-events-none"
                          style={{
                            left: `${b.coords[0] * 100}%`,
                            top: `${b.coords[1] * 100}%`,
                            width: `${(b.coords[2] - b.coords[0]) * 100}%`,
                            height: `${(b.coords[3] - b.coords[1]) * 100}%`
                          }}
                        ></div>
                      );
                    });
                  })()}
                </div>

                <div className={`absolute top-3 right-3 px-2.5 py-1 rounded border text-xs font-bold uppercase tracking-wider z-10 bg-zinc-900/80 backdrop-blur-sm ${getSeverityColor(item.detection?.severity)}`}>
                  {item.detection?.severity || 'Unknown'}
                </div>
              </div>

              {/* Info Section */}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-zinc-100 mb-1 capitalize group-hover:text-blue-400 transition-colors">
                  {item.detection?.damage || 'No Detection'}
                </h3>
                <p className="text-xs text-zinc-500 mb-4">{new Date(item.created_at).toLocaleDateString()}</p>
                
                <div className="mt-auto pt-4 border-t border-zinc-800 flex justify-between items-center">
                  <span className="text-sm text-zinc-500 font-medium">Confidence Match</span>
                  <span className="font-mono font-bold text-blue-400">
                    {item.detection?.confidence || '0'}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-zinc-950 rounded-full mt-3 overflow-hidden border border-zinc-800">
                  <div 
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${item.detection?.confidence || 0}%` }}
                  ></div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Results;