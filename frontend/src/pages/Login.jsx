import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Lock } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await api.post('/login', form);
      localStorage.setItem("token", response.data.token);
      toast.success("Successfully logged in!");
      navigate('/upload');
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[80vh] flex items-center justify-center p-4">
      <div className="bento-box w-full max-w-md p-10 flex flex-col items-center">
        <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/20 shadow-inner">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-inner">
            RH
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-zinc-100 mb-2">Welcome Back</h1>
        <p className="text-zinc-500 text-sm mb-8 text-center">Enter your credentials to access the AI dashboard</p>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="relative group">
            <User className="w-5 h-5 absolute left-4 top-3.5 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
            <input
              type="email"
              name="email"
              placeholder="Email address"
              onChange={handleChange}
              className="bento-input"
              required
            />
          </div>

          <div className="relative group">
            <Lock className="w-5 h-5 absolute left-4 top-3.5 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="bento-input"
              required
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full bg-zinc-100 hover:bg-white text-zinc-900 font-semibold py-3.5 rounded-xl transition-all shadow-lg mt-6 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <p className="text-zinc-500 text-sm mt-8">
          Don't have an account? <Link to="/register" className="text-blue-400 font-medium hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;