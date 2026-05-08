"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export function LoginModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    // Simulate network delay for DB user creation / key derivation
    setTimeout(() => {
      login(email);
      setIsSubmitting(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#0c0c1d] p-6 shadow-2xl animate-fade-in-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-white/40 hover:text-white/80 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#7c6cf0]/20 to-[#4fc3f7]/20 border border-white/[0.06] mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#4fc3f7]">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Welcome to SocialMedia</h2>
          <p className="text-sm text-white/50">Enter your email to sign in or create an account instantly.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5 ml-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none transition-colors focus:border-[#7c6cf0]/50 focus:bg-white/[0.05]"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !email}
            className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-[#7c6cf0] to-[#5b8cf0] p-[1px] transition-all hover:shadow-[0_0_25px_rgba(124,108,240,0.25)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex w-full items-center justify-center gap-2 rounded-[11px] bg-[#0c0c1d]/40 px-4 py-3 text-sm font-medium text-white backdrop-blur-sm">
              {isSubmitting ? (
                <>
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Authenticating...
                </>
              ) : (
                "Continue with Email"
              )}
            </div>
          </button>
        </form>

        <div className="mt-6 border-t border-white/[0.06] pt-5 text-center">
          <p className="text-xs text-white/30">
            A secure non-custodial wallet will be created for you automatically.
          </p>
        </div>
      </div>
    </div>
  );
}
