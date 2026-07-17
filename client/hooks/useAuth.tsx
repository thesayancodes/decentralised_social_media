"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { Keypair } from "@stellar/stellar-sdk";
import { connectWallet, getWalletAddress } from "@/hooks/contract";

interface AuthContextType {
  address: string | null;
  keypair: Keypair | null;
  isLoaded: boolean;
  login: (email: string) => void;
  connectFreighterWallet: () => Promise<string>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  address: null,
  keypair: null,
  isLoaded: false,
  login: () => {},
  connectFreighterWallet: async () => "",
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [keypair, setKeypair] = useState<Keypair | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedSecret = localStorage.getItem("desocial_secret");
    const savedFreighter = localStorage.getItem("freighter_address");

    if (savedSecret) {
      try {
        const kp = Keypair.fromSecret(savedSecret);
        setKeypair(kp);
        setAddress(kp.publicKey());
      } catch (e) {
        console.error("Invalid secret in localStorage", e);
        localStorage.removeItem("desocial_secret");
      }
    } else if (savedFreighter) {
      getWalletAddress().then((addr) => {
        if (addr) {
          setAddress(addr);
        } else {
          localStorage.removeItem("freighter_address");
        }
      });
    }
    setIsLoaded(true);
  }, []);

  const connectFreighterWallet = async (): Promise<string> => {
    const addr = await connectWallet();
    localStorage.removeItem("desocial_secret");
    localStorage.setItem("freighter_address", addr);
    setKeypair(null);
    setAddress(addr);
    return addr;
  };

  const login = (email: string) => {
    let kp = keypair;
    if (!kp) {
      kp = Keypair.random();
      localStorage.removeItem("freighter_address");
      localStorage.setItem("desocial_secret", kp.secret());
      setKeypair(kp);
      setAddress(kp.publicKey());

      fetch(`https://friendbot.stellar.org/?addr=${kp.publicKey()}`)
        .then(() => console.log("Guest account funded on Testnet!"))
        .catch((e) => console.error("Failed to fund guest account:", e));
    }
  };

  const logout = () => {
    localStorage.removeItem("desocial_secret");
    localStorage.removeItem("freighter_address");
    setKeypair(null);
    setAddress(null);
  };

  return (
    <AuthContext.Provider value={{ address, keypair, isLoaded, login, connectFreighterWallet, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

