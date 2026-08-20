import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router";
import { clearAllChatState } from "@/lib/chat-threads";
import { isLocalAuthMode, localAuthUser } from "@/lib/auth-config";
import {
  type AuthUser,
  clearStoredToken,
  getStoredToken,
  setStoredToken,
  userFromIdToken,
} from "@/lib/google-auth";

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signInWithGoogleCredential: (credential: string) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const localAuth = isLocalAuthMode();

  useEffect(() => {
    if (localAuth) {
      setUser(localAuthUser());
      setLoading(false);
      return;
    }

    const token = getStoredToken();
    if (token) {
      const parsed = userFromIdToken(token);
      if (parsed) {
        setUser(parsed);
      } else {
        clearStoredToken();
      }
    }
    setLoading(false);
  }, [localAuth]);

  const signInWithGoogleCredential = useCallback((credential: string) => {
    const parsed = userFromIdToken(credential);
    if (!parsed) {
      throw new Error("Invalid Google credential");
    }
    setStoredToken(credential);
    setUser(parsed);
  }, []);

  const signOut = useCallback(() => {
    if (localAuth) {
      return;
    }
    clearAllChatState();
    clearStoredToken();
    setUser(null);
    navigate("/login");
  }, [localAuth, navigate]);

  const value = useMemo(
    () => ({
      user,
      loading,
      signInWithGoogleCredential,
      signOut,
    }),
    [user, loading, signInWithGoogleCredential, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
