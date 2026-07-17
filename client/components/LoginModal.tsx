"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export function LoginModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { login, connectFreighterWallet } = useAuth();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConnectingFreighter, setIsConnectingFreighter] = useState(false);
  const [freighterError, setFreighterError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFreighterConnect = async () => {
    setFreighterError(null);
    setIsConnectingFreighter(true);
    try {
      await connectFreighterWallet();
      setIsConnectingFreighter(false);
      onClose();
    } catch (err: unknown) {
      setIsConnectingFreighter(false);
      const msg = err instanceof Error ? err.message : "Failed to connect Freighter wallet.";
      setFreighterError(msg);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    setTimeout(() => {
      login(email);
      setIsSubmitting(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#0d111d]/95 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl animate-fade-in-up glow-accent">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-all"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7c6cf0]/20 to-[#38bdf8]/20 border border-[#7c6cf0]/30 shadow-[0_0_20px_rgba(124,108,240,0.25)] mb-4">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#38bdf8]">
              <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
              <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
              <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
            </svg>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight mb-1">Connect Stellar Wallet</h2>
          <p className="text-xs sm:text-sm text-slate-400">Connect using your browser extension or create a guest account.</p>
        </div>

        {/* Error Banner */}
        {freighterError && (
          <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300 flex items-center justify-between">
            <span>{freighterError}</span>
            <button onClick={() => setFreighterError(null)} className="text-rose-400 hover:text-rose-200 ml-2">&times;</button>
          </div>
        )}

        {/* Option 1: Freighter Browser Extension */}
        <button
          onClick={handleFreighterConnect}
          disabled={isConnectingFreighter}
          className="relative w-full mb-5 overflow-hidden rounded-2xl bg-gradient-to-r from-[#7c6cf0] via-[#38bdf8] to-[#10b981] p-[1px] transition-all hover:shadow-[0_0_30px_rgba(124,108,240,0.4)] active:scale-[0.98] disabled:opacity-50"
        >
          <div className="flex w-full items-center justify-center gap-3 rounded-[15px] bg-[#070913]/90 px-4 py-3.5 text-sm font-semibold text-white backdrop-blur-md">
            {isConnectingFreighter ? (
              <>
                <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                <span>Opening Freighter...</span>
              </>
            ) : (
              <>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#7c6cf0]/20 text-[#38bdf8] font-bold text-xs">🚀</span>
                <span>Connect Freighter Extension</span>
              </>
            )}
          </div>
        </button>

        <div className="relative flex items-center my-5">
          <div className="flex-grow border-t border-white/10" />
          <span className="flex-shrink mx-3 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Or Guest Email Login</span>
          <div className="flex-grow border-t border-white/10" />
        </div>

        {/* Option 2: Email / Web3 Account */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 ml-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-500 outline-none transition-all focus:border-[#7c6cf0] focus:ring-2 focus:ring-[#7c6cf0]/20"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !email}
            className="w-full rounded-xl border border-white/10 bg-slate-900/80 hover:bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-200 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Initializing Account..." : "Continue with Email Key"}
          </button>
        </form>

        <div className="mt-5 border-t border-white/10 pt-4 text-center">
          <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
            Supports Stellar Testnet & Freighter Browser Extension.
          </p>
        </div>
      </div>
    </div>
  );
}


