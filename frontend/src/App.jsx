import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import Results from "./pages/Results";
import ResultDetail from "./pages/ResultDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Upload from "./pages/Upload";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import CustomCursor from "./components/CustomCursor";

function App() {
  return (
    <Router>
      <CustomCursor />
      {/* Background Image */}
      <div 
        className="fixed inset-0 z-[-2] bg-cover bg-center bg-no-repeat bg-fixed"
        style={{ backgroundImage: 'url("/roads.jpeg")' }}
      ></div>
      
      {/* Dark Overlay with Grid Pattern */}
      <div className="fixed inset-0 z-[-1] bg-zinc-950/80 bg-grid-pattern"></div>

      <div className="min-h-screen relative flex flex-col items-center pb-20">
        <Toaster 
          position="top-center" 
          toastOptions={{
            style: {
              background: '#18181b', // zinc-900
              color: '#f4f4f5', // zinc-100
              border: '1px solid #27272a', // zinc-800
              borderRadius: '16px',
            }
          }}
        />
        
        <Navbar />
        
        {/* Main Content Area */}
        <main className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 mt-8 flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route path="/results" element={<ProtectedRoute><Results /></ProtectedRoute>} />
            <Route path="/results/:id" element={<ProtectedRoute><ResultDetail /></ProtectedRoute>} />
            <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;