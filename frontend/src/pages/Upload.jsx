import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UploadCloud } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      toast.error("Please select an image first");
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Analyzing road image...");
    
    const formData = new FormData();
    formData.append("image", image);

    try {
      const uploadPromise = api.post("/upload-image", formData);
      const delayPromise = new Promise(resolve => setTimeout(resolve, 1500));
      
      const [response] = await Promise.all([uploadPromise, delayPromise]);
      
      toast.success("Image analyzed successfully!", { id: loadingToast });
      
      setTimeout(() => {
        navigate(`/results/${response.data.upload.id}`);
      }, 500);

    } catch (error) {
      toast.error(error.response?.data?.message || "Analysis failed", { id: loadingToast });
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex items-center justify-center p-4 pt-10">
      <div className="bento-box w-full max-w-xl p-10 flex flex-col items-center">
        <div className="w-full flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-zinc-100">Upload Image</h1>
          <Link to="/results" className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
            View Results &rarr;
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-6 flex flex-col items-center">
          
          <label 
            className={`w-full aspect-video rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden relative group ${image ? 'border-blue-500/50 bg-blue-500/5' : 'border-zinc-800 bg-zinc-950 hover:border-zinc-600'}`}
          >
            {preview ? (
              <>
                <img src={preview} alt="Preview" className={`w-full h-full object-cover transition-opacity ${loading ? 'opacity-30' : 'opacity-90 group-hover:opacity-100'}`} />
                {loading && (
                  <>
                    <div className="absolute inset-0 bg-blue-900/20 backdrop-blur-sm"></div>
                    <div className="absolute left-0 right-0 h-1 bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,1)] animate-scan z-20"></div>
                  </>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center text-zinc-500 group-hover:text-zinc-300 transition-colors">
                <UploadCloud className="w-12 h-12 text-zinc-600 mb-4 group-hover:text-blue-400 transition-colors" />
                <p className="font-medium">Click to browse or drag and drop</p>
                <p className="text-xs mt-2 opacity-60">JPEG, PNG, JPG</p>
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

          <button 
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Scanning via AI...' : 'Upload & Analyze'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Upload;