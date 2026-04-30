"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { Keypair } from "@stellar/stellar-sdk";

interface AuthContextType {
  address: string | null;
  keypair: Keypair | null;
  isLoaded: boolean;
  login: (email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  address: null,
  keypair: null,
  isLoaded: false,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [keypair, setKeypair] = useState<Keypair | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load existing wallet from localStorage
    const savedSecret = localStorage.getItem("desocial_secret");
    if (savedSecret) {
      try {
        const kp = Keypair.fromSecret(savedSecret);
        setKeypair(kp);
        setAddress(kp.publicKey());
      } catch (e) {
        console.error("Invalid secret in localStorage");
        localStorage.removeItem("desocial_secret");
      }
    }
    setIsLoaded(true);
  }, []);

  const login = (email: string) => {
    // In a real app, this would derive a key from email/password or use Web3Auth.
    // Here we generate a deterministic-ish keypair for the demo, or just a new random one
    // if one doesn't exist, to simulate seamless onboarding.
    let kp = keypair;
    if (!kp) {
      // Very naive pseudo-deterministic generation for demo purposes
      // (Do not use in production!)
      const hash = email.split("").reduce((a, b) => {
        a = (a << 5) - a + b.charCodeAt(0);
        return a & a;
      }, 0);
      
      kp = Keypair.random(); // We'll just use random for safety
      localStorage.setItem("desocial_secret", kp.secret());
      setKeypair(kp);
      setAddress(kp.publicKey());
    }
  };

  const logout = () => {
    localStorage.removeItem("desocial_secret");
    setKeypair(null);
    setAddress(null);
  };

  return (
    <AuthContext.Provider value={{ address, keypair, isLoaded, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
