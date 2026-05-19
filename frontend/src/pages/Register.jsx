import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/register', form);
      toast.success("Account created successfully!");
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[80vh] flex items-center justify-center p-4">
      <div className="bento-box w-full max-w-md p-10 flex flex-col items-center">
        <h1 className="text-2xl font-bold text-zinc-100 mb-2">Create Account</h1>
        <p className="text-zinc-500 text-sm mb-8 text-center">Join RoadHealth AI today</p>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="relative group">
            <User className="w-5 h-5 absolute left-4 top-3.5 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              className="bento-input"
              required
            />
          </div>

          <div className="relative group">
            <Mail className="w-5 h-5 absolute left-4 top-3.5 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
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
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p className="text-zinc-500 text-sm mt-8">
          Already have an account? <Link to="/login" className="text-blue-400 font-medium hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;