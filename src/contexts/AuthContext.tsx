import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Firm, AuthContextType } from '../types';
import { authService } from '../services/authService';
import { firmService } from '../services/firmService';
import { duoService } from '../services/duoService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firm, setFirm] = useState<Firm | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingDuoVerification, setPendingDuoVerification] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = authService.getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
      // Load firm data
      if (storedUser.firmId) {
        const firmData = firmService.getFirm(storedUser.firmId);
        if (firmData) {
          setFirm(firmData);
        }
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const user = await authService.login(email, password);
      if (user) {
        // Load firm data
        if (user.firmId) {
          const firmData = firmService.getFirm(user.firmId);
          if (firmData) {
            setFirm(firmData);
            // Check if Duo is required
            if (firmData.duoEnabled && user.duoEnabled && !user.duoRegistered) {
              setPendingDuoVerification(true);
              setUser(user);
              return false; // Require Duo verification
            }
          }
        }
        setUser(user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signup = async (email: string, password: string, name: string, firmId?: string): Promise<boolean> => {
    try {
      const user = await authService.signup(email, password, name, firmId);
      if (user) {
        if (user.firmId) {
          const firmData = firmService.getFirm(user.firmId);
          if (firmData) {
            setFirm(firmData);
          }
        }
        setUser(user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setFirm(null);
    setPendingDuoVerification(false);
  };

  const requestDuoAuth = async (): Promise<string | null> => {
    if (!firm || !user || !firm.duoIntegrationKey || !firm.duoSecretKey || !firm.duoApiHostname) {
      return null;
    }

    const authResponse = await duoService.initiateAuth(
      user.email,
      firm.duoIntegrationKey,
      firm.duoSecretKey,
      firm.duoApiHostname
    );

    return authResponse?.authUrl || null;
  };

  const verifyDuo = async (sigResponse: string): Promise<boolean> => {
    if (!firm || !firm.duoIntegrationKey || !firm.duoSecretKey || !firm.duoApiHostname) {
      return false;
    }

    const verified = await duoService.verifyAuth(
      sigResponse,
      firm.duoIntegrationKey,
      firm.duoSecretKey,
      firm.duoApiHostname
    );

    if (verified && user) {
      // Update user to mark Duo as verified
      const updatedUser = { ...user, duoRegistered: true };
      setUser(updatedUser);
      authService.updateUser(updatedUser);
      setPendingDuoVerification(false);
    }

    return verified;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firm,
        login,
        signup,
        logout,
        isAuthenticated: !!user && !pendingDuoVerification,
        isLoading,
        needsDuoVerification: pendingDuoVerification,
        verifyDuo,
        requestDuoAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

