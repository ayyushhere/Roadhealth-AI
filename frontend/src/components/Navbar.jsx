import { Link, useNavigate, useLocation } from "react-router-dom";
import { Home, Upload, List, LogOut, User } from "lucide-react";
import toast from "react-hot-toast";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path ? "bg-zinc-800 text-zinc-100" : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50";

  return (
    <nav className="sticky top-6 z-50 w-full flex justify-center px-4">
      <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 shadow-xl rounded-full px-2 py-2 flex items-center gap-1 sm:gap-2">
        <Link to="/" className="flex items-center gap-2 px-4 py-2 group">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-inner group-hover:bg-blue-500 transition-colors">
            RH
          </div>
          <span className="font-bold text-zinc-100 hidden sm:block tracking-tight">RoadHealth AI</span>
        </Link>

        <div className="w-[1px] h-8 bg-zinc-800 mx-2"></div> {/* Divider */}

        <div className="flex items-center gap-1">
          <Link to="/" className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition-colors ${isActive('/')}`}>
            <Home className="w-4 h-4" /> <span className="hidden md:block text-sm font-medium">Home</span>
          </Link>

          {token ? (
            <>
              <Link to="/upload" className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition-colors ${isActive('/upload')}`}>
                <Upload className="w-4 h-4" /> <span className="hidden md:block text-sm font-medium">Upload</span>
              </Link>
              <Link to="/results" className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition-colors ${isActive('/results')}`}>
                <List className="w-4 h-4" /> <span className="hidden md:block text-sm font-medium">Results</span>
              </Link>
              <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2.5 rounded-full text-red-400 hover:bg-red-500/10 transition-colors ml-1">
                <LogOut className="w-4 h-4" /> <span className="hidden md:block text-sm font-medium">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-full transition-all ml-1 font-medium shadow-[0_0_15px_rgba(37,99,235,0.3)]">
                <User className="w-4 h-4" /> <span className="text-sm">Login</span>
              </Link>
              <Link to="/register" className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 px-5 py-2.5 rounded-full transition-all ml-1 font-medium">
                <span className="text-sm">Register</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
