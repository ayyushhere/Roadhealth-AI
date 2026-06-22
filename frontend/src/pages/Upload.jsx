import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UploadCloud, FileImage, CheckCircle2, Zap, X } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api";
import AIStatus from "../components/AIStatus";

function Upload() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const clearImage = () => {
    setImage(null);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      toast.error("Please select an image first");
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Executing neural analysis...");
    
    const formData = new FormData();
    formData.append("image", image);

    try {
      const uploadPromise = api.post("/upload-image", formData);
      const delayPromise = new Promise(resolve => setTimeout(resolve, 2000)); // slightly longer for effect
      
      const [response] = await Promise.all([uploadPromise, delayPromise]);
      
      toast.success("Road analysis completed successfully", { id: loadingToast });
      
      setTimeout(() => {
        navigate(`/results/${response.data.upload.id}`);
      }, 500);

    } catch (error) {
      if (!error.response) {
        toast.error("Unable to connect to server", { id: loadingToast });
      } else {
        toast.error("AI service is currently unavailable", { id: loadingToast });
      }
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center pt-8 pb-20 animate-fade-in-up">
      <div className="w-full flex justify-between items-end mb-6 max-w-5xl">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Diagnostic Input</h1>
            <AIStatus />
          </div>
          <p className="text-zinc-400 text-sm">Provide surface imagery for automated neural assessment.</p>
        </div>
        <Link to="/results" className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors mb-2">
          View Repository &rarr;
        </Link>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Pane: Upload Zone */}
        <div className="bento-box lg:col-span-2 p-6 flex flex-col">
          <label 
            className={`w-full h-[400px] rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden relative group ${image ? 'border-blue-500/50 bg-black/50' : 'border-zinc-700 bg-zinc-950/50 hover:border-blue-500/50 hover:bg-blue-950/10'}`}
          >
            {preview ? (
              <>
                <img src={preview} alt="Preview" className={`w-full h-full object-contain transition-opacity ${loading ? 'opacity-30' : 'opacity-100'}`} />
                {loading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/80 backdrop-blur-sm z-20">
                    <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                    <p className="text-blue-400 font-medium animate-pulse">🤖 AI is analyzing road condition...</p>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center text-zinc-500 group-hover:text-blue-400 transition-colors z-10">
                <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-900/30 transition-colors shadow-lg">
                  <UploadCloud className="w-10 h-10 text-zinc-500 group-hover:text-blue-400 transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-zinc-300 mb-2">Initialize Transfer</h3>
                <p className="font-medium text-sm text-zinc-500">Drag & drop or click to browse</p>
                <div className="flex gap-4 mt-6">
                  <span className="px-3 py-1 bg-zinc-900 rounded-full text-xs font-semibold text-zinc-400 border border-zinc-800">JPEG</span>
                  <span className="px-3 py-1 bg-zinc-900 rounded-full text-xs font-semibold text-zinc-400 border border-zinc-800">PNG</span>
                  <span className="px-3 py-1 bg-zinc-900 rounded-full text-xs font-semibold text-zinc-400 border border-zinc-800">WEBP</span>
                </div>
              </div>
            )}
            
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleImageChange} 
              disabled={loading}
            />
          </label>
        </div>

        {/* Right Pane: Details & Submit */}
        <div className="flex flex-col gap-6">
          <div className="bento-box p-6 flex-grow flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6 border-b border-zinc-800 pb-4">
                <FileImage className="w-5 h-5 text-zinc-400" />
                <h3 className="text-zinc-300 font-semibold">Asset Details</h3>
              </div>
              
              {image ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-zinc-500">Filename</span>
                    <span className="text-sm font-mono text-zinc-300 truncate max-w-[120px]" title={image.name}>{image.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-zinc-500">Size</span>
                    <span className="text-sm font-mono text-zinc-300">{(image.size / (1024 * 1024)).toFixed(2)} MB</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-zinc-500">Type</span>
                    <span className="text-sm font-mono text-zinc-300 uppercase">{image.type.split('/')[1] || 'IMG'}</span>
                  </div>
                  
                  <div className="mt-8 space-y-3 pt-6 border-t border-zinc-800/50">
                    <div className="flex items-center gap-2 text-sm text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" /> <span>Format Supported</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" /> <span>Size Optimal (&lt; 10MB)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" /> <span>AI Engine Ready</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-zinc-600 space-y-4 py-8">
                  <div className="w-16 h-16 rounded-full border border-dashed border-zinc-700 flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-zinc-700 animate-pulse"></span>
                  </div>
                  <p className="text-sm text-center px-4">Awaiting visual data input for parameter extraction.</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex gap-2">
              {image && !loading && (
                <button 
                  onClick={clearImage}
                  className="px-4 py-3 bg-zinc-900 hover:bg-red-950/50 text-zinc-400 hover:text-red-400 border border-zinc-800 hover:border-red-900 rounded-xl transition-all"
                  title="Clear Image"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
              <button 
                onClick={handleSubmit}
                disabled={!image || loading}
                className={`flex-grow flex items-center justify-center gap-2 font-bold py-3.5 rounded-xl transition-all shadow-lg ${
                  loading 
                    ? 'bg-blue-900/50 text-blue-400 cursor-not-allowed border border-blue-900/50' 
                    : !image
                      ? 'bg-zinc-900 text-zinc-600 cursor-not-allowed border border-zinc-800'
                      : 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]'
                }`}
              >
                {loading ? (
                  <>
                    <Zap className="w-4 h-4 animate-pulse" /> Processing...
                  </>
                ) : (
                  'Execute Analysis'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Upload;