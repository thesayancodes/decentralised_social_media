"use client";

import { useState, useEffect, useCallback } from "react";
import { NETWORK } from "@/hooks/contract";
import { Badge } from "@/components/ui/badge";

function WalletIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
      <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}

function CheckSmallIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function PowerIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
      <line x1="12" y1="2" x2="12" y2="12" />
    </svg>
  );
}

interface NavbarProps {
  walletAddress: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
  isConnecting: boolean;
}

export default function Navbar({
  walletAddress,
  onConnect,
  onDisconnect,
  isConnecting,
}: NavbarProps) {
  const [copied, setCopied] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    if (!showDropdown) return;
    const close = () => setShowDropdown(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [showDropdown]);

  const handleCopy = useCallback(async () => {
    if (!walletAddress) return;
    await navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [walletAddress]);

  const truncate = (addr: string) => `${addr.slice(0, 4)}...${addr.slice(-4)}`;

  return (
    <nav
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 animate-fade-in-down ${
        scrolled
          ? "border-white/10 bg-[#070913]/90 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
          : "border-white/[0.06] bg-transparent backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-8 py-3.5">
        {/* Logo Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#7c6cf0] via-[#38bdf8] to-[#10b981] shadow-[0_0_25px_rgba(124,108,240,0.35)] p-[1px]">
            <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-[#070913]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="url(#logoGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <defs>
                  <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7c6cf0" />
                    <stop offset="100%" stopColor="#38bdf8" />
                  </linearGradient>
                </defs>
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-bold tracking-tight text-white font-sans">
                Stellar <span className="bg-gradient-to-r from-[#7c6cf0] to-[#38bdf8] bg-clip-text text-transparent">Social</span>
              </span>
              <span className="hidden sm:inline-flex text-[10px] font-mono text-[#38bdf8] bg-[#38bdf8]/10 border border-[#38bdf8]/20 rounded-md px-2 py-0.5 font-semibold">
                Soroban
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">Permissionless On-Chain Feed</p>
          </div>
        </div>

        {/* Right side Wallet & Status */}
        <div className="flex items-center gap-3">
          {/* Network Badge */}
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span>{NETWORK}</span>
          </div>

          {walletAddress ? (
            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); setShowDropdown(!showDropdown); }}
                className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-slate-900/60 px-3.5 py-2 text-sm transition-all hover:border-[#7c6cf0]/40 hover:bg-slate-900/90 shadow-md backdrop-blur-xl"
              >
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-[#7c6cf0] to-[#38bdf8] p-[1px]">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-[#070913] text-[9px] font-bold text-white">
                    {walletAddress.slice(0, 2)}
                  </div>
                </div>
                <span className="font-mono text-xs font-medium text-slate-200">
                  {truncate(walletAddress)}
                </span>
                <svg
                  width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  className={`text-slate-400 transition-transform duration-200 ${showDropdown ? "rotate-180" : ""}`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {/* Wallet Dropdown */}
              {showDropdown && (
                <div
                  className="absolute right-0 top-full mt-2.5 w-72 overflow-hidden rounded-2xl border border-white/10 bg-[#0d111d]/95 backdrop-blur-2xl shadow-2xl animate-fade-in-up z-50 glow-accent"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-4 border-b border-white/[0.08] bg-slate-950/40">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
                      <span>Connected Wallet</span>
                      <span className="text-emerald-400 font-mono text-[9px]">ACTIVE</span>
                    </p>
                    <p className="font-mono text-xs text-slate-300 break-all leading-relaxed bg-white/[0.03] p-2 rounded-lg border border-white/[0.05]">
                      {walletAddress}
                    </p>
                  </div>
                  <div className="p-2 space-y-1">
                    <button
                      onClick={() => { handleCopy(); setShowDropdown(false); }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                    >
                      {copied ? <CheckSmallIcon /> : <CopyIcon />}
                      <span>{copied ? "Address Copied!" : "Copy Public Key"}</span>
                    </button>
                    <a
                      href={`https://stellar.expert/explorer/testnet/account/${walletAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                      <span>View on Stellar Expert</span>
                    </a>
                    <button
                      onClick={() => { onDisconnect(); setShowDropdown(false); }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
                    >
                      <PowerIcon />
                      <span>Disconnect Wallet</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onConnect}
              disabled={isConnecting}
              className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#7c6cf0] via-[#38bdf8] to-[#10b981] p-[1px] transition-all duration-300 hover:shadow-[0_0_25px_rgba(124,108,240,0.5)] hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-2 rounded-[11px] bg-[#070913]/90 px-4 py-2 text-xs sm:text-sm font-semibold text-white backdrop-blur-md">
                {isConnecting ? (
                  <>
                    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <WalletIcon size={15} />
                    <span>Connect Wallet</span>
                  </>
                )}
              </div>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

