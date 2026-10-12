import React, { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

const AdminLoader = ({
  title = "Preparing Your Workspace",
  statusMessages = [
    "Initializing secure session...",
    "Syncing your dashboard experience...",
    "Loading enterprise modules...",
    "Optimizing real-time analytics...",
    "Finalizing workspace configuration...",
  ],
  messageInterval = 2400,
}) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  // Cycle through status messages gracefully
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentMessageIndex(
        (prevIndex) => (prevIndex + 1) % statusMessages.length,
      );
    }, messageInterval);
    return () => clearInterval(timer);
  }, [statusMessages, messageInterval]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[9999] w-screen h-screen flex flex-col items-center justify-center bg-zinc-950/90 backdrop-blur-xl overflow-hidden select-none transition-all duration-500"
    >
      {/* Custom Keyframe Animations Style Tag */}
      <style>{`
        @keyframes orbit-clockwise {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes orbit-counter {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4; transform: scale(0.98); }
          50% { opacity: 0.85; transform: scale(1.02); }
        }
        @keyframes indeterminate-bar {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
        .animate-orbit-cw {
          animation: orbit-clockwise 8s linear infinite;
        }
        .animate-orbit-ccw {
          animation: orbit-counter 12s linear infinite;
        }
        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }
        .animate-bar {
          animation: indeterminate-bar 2s cubic-bezier(0.65, 0.05, 0.36, 1) infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-orbit-cw, .animate-orbit-ccw, .animate-pulse-glow, .animate-bar {
            animation: none !important;
          }
        }
      `}</style>

      {/* Background ambient glowing radial gradient accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-blue-500/5 rounded-full blur-3xl pointer-events-none animate-pulse-glow"></div>

      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a0a_1px,transparent_1px),linear-gradient(to_bottom,#27272a0a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

      {/* Main Container Card */}
      <div className="relative z-10 flex flex-col items-center max-w-md w-full px-6 py-10 text-center">
        {/* Solar System Orbit Indicator */}
        <div className="relative w-36 h-36 flex items-center justify-center mb-8">
          {/* Outer Orbit Path & Planet (Purple) */}
          <div className="absolute inset-0 rounded-full border border-dashed border-zinc-800/80"></div>
          <div className="absolute inset-0 animate-orbit-cw">
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.9)] ring-4 ring-purple-500/20"></div>
          </div>

          {/* Inner Orbit Path & Planet (Indigo) */}
          <div className="absolute inset-5 rounded-full border border-dashed border-zinc-700/60"></div>
          <div
            className="absolute inset-5 animate-orbit-ccw"
            style={{ animationDuration: "5s" }}
          >
            <div className="absolute bottom-1 right-3 w-2.5 h-2.5 rounded-full bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.9)] ring-4 ring-indigo-400/20"></div>
          </div>

          {/* Central Sun / Core Icon Container */}
          <div className="relative z-20 w-14 h-14 rounded-full bg-gradient-to-br from-indigo-950 via-zinc-900 to-zinc-950 border border-indigo-500/40 shadow-[0_0_25px_rgba(99,102,241,0.3)] flex items-center justify-center animate-pulse-glow">
            <Sparkles className="w-6 h-6 text-indigo-400" />
          </div>

          {/* Ambient center glow */}
          <div className="absolute inset-8 bg-indigo-500/15 rounded-full blur-xl pointer-events-none"></div>
        </div>

        {/* Typography & Heading */}
        <div className="space-y-2 mb-8">
          <h2 className="text-xl font-semibold tracking-tight text-zinc-100 sm:text-2xl font-sans">
            {title}
          </h2>
          <div className="h-6 flex items-center justify-center overflow-hidden">
            <p
              key={currentMessageIndex}
              className="text-sm font-medium text-zinc-400 tracking-wide transition-all duration-300 transform translate-y-0 opacity-100"
            >
              {statusMessages[currentMessageIndex]}
            </p>
          </div>
        </div>

        {/* Sleek Smooth Progress Bar */}
        <div className="w-full max-w-[240px] h-1 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800/80 p-[1px]">
          <div className="h-full w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-400 rounded-full animate-bar"></div>
        </div>

        {/* Security / System Badge Footer */}
        <div className="mt-8 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-800/80 text-[11px] font-medium text-zinc-400 tracking-wider uppercase backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Enterprise Secure Connection</span>
        </div>
      </div>
    </div>
  );
};

export default AdminLoader;
