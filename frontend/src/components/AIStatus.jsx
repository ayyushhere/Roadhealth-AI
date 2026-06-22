import { useState, useEffect } from "react";

function AIStatus() {
  const [status, setStatus] = useState("Warming Up");

  useEffect(() => {
    let timeoutId;

    const checkHealth = async () => {
      try {
        const controller = new AbortController();
        timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch("http://127.0.0.1:5000/health", {
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          setStatus("Online");
        } else {
          setStatus("Offline");
        }
      } catch (error) {
        if (error.name === "AbortError") {
          setStatus("Warming Up");
        } else {
          setStatus("Offline");
        }
      }
    };

    checkHealth();
    const intervalId = setInterval(checkHealth, 30000);

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, []);

  const getStatusDisplay = () => {
    switch (status) {
      case "Online":
        return { text: "🟢 AI Online", className: "text-emerald-400 border-emerald-400/20 bg-emerald-400/10" };
      case "Warming Up":
        return { text: "🟡 AI Warming Up...", className: "text-yellow-400 border-yellow-400/20 bg-yellow-400/10" };
      case "Offline":
        return { text: "🔴 AI Offline", className: "text-red-400 border-red-400/20 bg-red-400/10" };
      default:
        return { text: "🟡 AI Warming Up...", className: "text-yellow-400 border-yellow-400/20 bg-yellow-400/10" };
    }
  };

  const display = getStatusDisplay();

  return (
    <div className={`px-3 py-1.5 rounded-full border text-sm font-medium flex items-center gap-2 ${display.className}`}>
      {display.text}
    </div>
  );
}

export default AIStatus;
