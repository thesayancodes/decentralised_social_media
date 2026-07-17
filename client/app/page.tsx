"use client";

import { useState, useCallback } from "react";
import { Meteors } from "@/components/ui/meteors";
import Navbar from "@/components/Navbar";
import { FluidBackground } from "@/components/FluidBackground";
import SocialMediaUI from "@/components/Contract";
import { useAuth } from "@/hooks/useAuth";
import { LoginModal } from "@/components/LoginModal";

export default function Home() {
  const { address: walletAddress, logout, isLoaded } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleConnect = useCallback(() => {
    setIsLoginModalOpen(true);
  }, []);

  const handleDisconnect = useCallback(() => {
    logout();
  }, [logout]);

  return (
    <div className="relative flex flex-col min-h-screen bg-[#070913] overflow-x-hidden selection:bg-[#7c6cf0]/30 selection:text-white">
      {/* Meteors */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-80">
        <Meteors number={14} />
      </div>

      {/* Fluid Interactive Background */}
      <FluidBackground />

      {/* Navbar */}
      <Navbar
        walletAddress={walletAddress}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
        isConnecting={false}
      />

      {/* Main content */}
      <main className="relative z-10 flex flex-1 w-full max-w-7xl mx-auto flex-col items-center px-4 sm:px-6 pt-8 pb-20">
        {/* Hero Header */}
        <div className="mb-8 text-center animate-fade-in-up w-full max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#7c6cf0]/30 bg-[#7c6cf0]/10 px-4 py-1.5 text-xs font-medium text-white/90 backdrop-blur-md shadow-[0_0_20px_rgba(124,108,240,0.2)]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#38bdf8] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#38bdf8]" />
            </span>
            <span>Soroban Smart Contracts &bull; Stellar Testnet</span>
          </div>

          <h1 className="mb-3 tracking-tight">
            <span className="block text-4xl sm:text-6xl font-extrabold leading-[1.1] text-white">
              Decentralized <span className="bg-gradient-to-r from-[#7c6cf0] via-[#38bdf8] to-[#10b981] bg-[length:200%_auto] animate-gradient-shift bg-clip-text text-transparent">Social Media</span>
            </span>
          </h1>

          <p className="mx-auto max-w-xl text-sm sm:text-base leading-relaxed text-slate-400">
            Publish posts, leave comments, like content, and follow creators — 100% on-chain, censorship-resistant, and powered by Soroban.
          </p>

          {/* Stats Bar */}
          <div className="mt-6 grid grid-cols-3 divide-x divide-white/10 rounded-2xl border border-white/[0.08] bg-slate-950/40 p-3 backdrop-blur-xl animate-fade-in-up-delayed shadow-xl">
            <div className="px-3 py-1 text-center">
              <p className="text-sm sm:text-lg font-bold text-white font-mono flex items-center justify-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
                ~5s
              </p>
              <p className="text-[11px] text-slate-400 font-medium">Finality</p>
            </div>
            <div className="px-3 py-1 text-center">
              <p className="text-sm sm:text-lg font-bold text-white font-mono flex items-center justify-center gap-1">
                &lt;$0.001
              </p>
              <p className="text-[11px] text-slate-400 font-medium">Tx Fee</p>
            </div>
            <div className="px-3 py-1 text-center">
              <p className="text-sm sm:text-lg font-bold text-[#38bdf8] font-mono flex items-center justify-center gap-1">
                Soroban
              </p>
              <p className="text-[11px] text-slate-400 font-medium">Smart Contracts</p>
            </div>
          </div>
        </div>

        {/* Social Media App Container */}
        <div className="w-full">
          <SocialMediaUI
            walletAddress={walletAddress}
            onConnect={handleConnect}
            isConnecting={false}
          />
        </div>

        <LoginModal 
          isOpen={isLoginModalOpen} 
          onClose={() => setIsLoginModalOpen(false)} 
        />

        {/* Footer */}
        <footer className="mt-16 flex flex-col items-center gap-4 text-center border-t border-white/[0.06] pt-8 w-full animate-fade-in">
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
            {["On-Chain Posts", "Likes & Tips", "Comments Thread", "Follower Network"].map((s, i) => (
              <span key={s} className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 bg-white/[0.04] px-2.5 py-1 rounded-lg border border-white/[0.06]">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      i === 0
                        ? "bg-[#7c6cf0]"
                        : i === 1
                          ? "bg-[#f43f5e]"
                          : i === 2
                            ? "bg-[#38bdf8]"
                            : "bg-[#f59e0b]"
                    }`}
                  />
                  <span className="font-mono text-[11px]">{s}</span>
                </span>
              </span>
            ))}
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono">
            <span>Stellar Network</span>
            <span>&bull;</span>
            <span>Freighter Wallet</span>
            <span>&bull;</span>
            <span>Soroban Protocol</span>
          </div>
        </footer>
      </main>
    </div>
  );
}

