import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  phone?: string;
  age?: string;
  addresses: {
    id: string;
    label: string;
    fullAddress: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefault: boolean;
  }[];
  provider: 'email' | 'google';
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  sessionTimeRemaining: number;
  login: (emailOrUsername: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  refreshSession: () => void;
}

interface RegisterData {
  email: string;
  username: string;
  password: string;
  fullName: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_USERNAME = 'Admin2025';
const ADMIN_PASSWORD = 'MappleMofu0711';

// Session timeout constants (in minutes)
const INACTIVITY_TIMEOUT = 45; // 45 minutes of inactivity
const ABSOLUTE_TIMEOUT = 180; // 3 hours absolute timeout
const SESSION_WARNING_TIME = 3; // Show warning 3 minutes before expiry

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('isAdmin') === 'true';
  });

  const [sessionTimeRemaining, setSessionTimeRemaining] = useState(INACTIVITY_TIMEOUT * 60); // in seconds
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [sessionStart, setSessionStart] = useState(Date.now());
  const [warningShown, setWarningShown] = useState(false);

  // Hash password (simple implementation - in production use bcrypt)
  const hashPassword = (password: string): string => {
    // This is a mock implementation. In production, use proper bcrypt/Argon2
    return btoa(password + 'SALT_KEY_BOBBY_HOBBY');
  };

  const refreshSession = useCallback(() => {
    setLastActivity(Date.now());
    setWarningShown(false);
  }, []);

  // Monitor user activity
  useEffect(() => {
    if (!user && !isAdmin) return;

    const handleActivity = () => {
      refreshSession();
    };

    // Track user activity
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keypress', handleActivity);
    window.addEventListener('click', handleActivity);
    window.addEventListener('scroll', handleActivity);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keypress', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('scroll', handleActivity);
    };
  }, [user, isAdmin, refreshSession]);

  // Session timeout checker
  useEffect(() => {
    if (!user && !isAdmin) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const inactiveTime = (now - lastActivity) / 1000 / 60; // in minutes
      const totalTime = (now - sessionStart) / 1000 / 60; // in minutes
      
      const timeRemaining = Math.max(0, (INACTIVITY_TIMEOUT * 60) - (inactiveTime * 60));
      setSessionTimeRemaining(Math.floor(timeRemaining));

      // Check absolute timeout
      if (totalTime >= ABSOLUTE_TIMEOUT) {
        toast.error('Session Expired', {
          description: 'Your session has expired. Please login again.',
        });
        logout();
        return;
      }

      // Check inactivity timeout
      if (inactiveTime >= INACTIVITY_TIMEOUT) {
        toast.error('Session Expired', {
          description: 'Your session has expired due to inactivity.',
        });
        logout();
        return;
      }

      // Show warning before expiry
      if (inactiveTime >= (INACTIVITY_TIMEOUT - SESSION_WARNING_TIME) && !warningShown) {
        setWarningShown(true);
        const minutesLeft = Math.ceil(INACTIVITY_TIMEOUT - inactiveTime);
        toast.warning('Session Expiring Soon', {
          description: `Your session will expire in ${minutesLeft} minute${minutesLeft !== 1 ? 's' : ''} due to inactivity.`,
          duration: 10000,
        });
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [user, isAdmin, lastActivity, sessionStart, warningShown]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [user]);

  const login = async (emailOrUsername: string, password: string): Promise<boolean> => {
    // Check admin credentials
    if (emailOrUsername === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setUser(null);
      setIsAdmin(true);
      localStorage.setItem('isAdmin', 'true');
      localStorage.removeItem('currentUser');
      setSessionStart(Date.now());
      setLastActivity(Date.now());
      return true;
    }

    // Check regular users
    const users = JSON.parse(localStorage.getItem('users') || '[]') as User[];
    const hashedPassword = hashPassword(password);
    const foundUser = users.find(
      (u) => (u.email === emailOrUsername || u.username === emailOrUsername) && 
      localStorage.getItem(`password_${u.id}`) === hashedPassword
    );

    if (foundUser) {
      setUser(foundUser);
      setIsAdmin(false);
      localStorage.setItem('isAdmin', 'false');
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      setSessionStart(Date.now());
      setLastActivity(Date.now());
      return true;
    }

    return false;
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    // Mock Google OAuth - in production, this would use real Google OAuth
    const mockGoogleUser: User = {
      id: `google-${Date.now()}`,
      email: 'user@gmail.com',
      username: 'googleuser',
      fullName: 'Google User',
      phone: '',
      addresses: [],
      provider: 'google',
      createdAt: new Date().toISOString(),
    };

    const users = JSON.parse(localStorage.getItem('users') || '[]') as User[];
    
    const existingUser = users.find(u => u.email === mockGoogleUser.email);
    if (existingUser) {
      setUser(existingUser);
    } else {
      users.push(mockGoogleUser);
      localStorage.setItem('users', JSON.stringify(users));
      setUser(mockGoogleUser);
    }

    setIsAdmin(false);
    localStorage.setItem('isAdmin', 'false');
    setSessionStart(Date.now());
    setLastActivity(Date.now());
    return true;
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('users') || '[]') as User[];

    if (users.some(u => u.email === data.email || u.username === data.username)) {
      return false;
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      email: data.email,
      username: data.username,
      fullName: data.fullName,
      phone: '',
      addresses: [],
      provider: 'email',
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem(`password_${newUser.id}`, hashPassword(data.password));

    setUser(newUser);
    setIsAdmin(false);
    localStorage.setItem('isAdmin', 'false');
    setSessionStart(Date.now());
    setLastActivity(Date.now());
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAdmin');
    setSessionTimeRemaining(0);
    setWarningShown(false);
  };

  const updateUser = (data: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...data };
    setUser(updatedUser);

    const users = JSON.parse(localStorage.getItem('users') || '[]') as User[];
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      users[index] = updatedUser;
      localStorage.setItem('users', JSON.stringify(users));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        sessionTimeRemaining,
        login,
        loginWithGoogle,
        register,
        logout,
        updateUser,
        refreshSession,
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