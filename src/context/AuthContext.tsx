import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { DatabaseService } from '../db/dbService';

// Fast SHA-256 hash helper for secure client-side storage
export async function hashString(str: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (e) {
    // Fallback pseudo-hash for non-crypto environments
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(16);
  }
}

interface AuthContextType {
  currentUser: User | null;
  isAdmin: boolean;
  isCashier: boolean;
  login: (username: string, passwordOrPin: string) => Promise<{ success: boolean; message: string }>;
  loginWithPin: (pin: string) => Promise<{ success: boolean; message: string }>;
  registerUser: (data: {
    name: string;
    username: string;
    password?: string;
    pin: string;
    role: UserRole;
  }) => Promise<{ success: boolean; message: string; user?: User }>;
  logout: () => void;
  switchRoleQuick: (role: UserRole) => void;
  setCurrentUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const db = DatabaseService.getInstance();
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('supermarket_active_user');
      if (saved) return JSON.parse(saved);
    } catch {}
    // Default to admin for immediate ease of testing and usage
    const users = db.getUsers();
    return users.find(u => u.role === 'admin') || users[0] || null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('supermarket_active_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('supermarket_active_user');
    }
  }, [currentUser]);

  const login = async (username: string, passwordOrPin: string): Promise<{ success: boolean; message: string }> => {
    const users = db.getUsers();
    const user = users.find(u => u.username.toLowerCase() === username.trim().toLowerCase());
    if (!user) {
      return { success: false, message: 'اسم المستخدم غير مسجل بالنظام.' };
    }

    const hashedInput = await hashString(passwordOrPin);
    const isPasswordMatch = user.passwordHash === hashedInput || user.passwordHash === passwordOrPin;
    const isPinMatch = user.pin === passwordOrPin.trim();

    if (isPasswordMatch || isPinMatch) {
      setCurrentUser(user);
      db.logAudit(user.id, user.name, 'LOGIN', 'users', user.id, '', '', 'تسجيل دخول ناجح للمستخدم');
      return { success: true, message: `مرحباً بك يا ${user.name}` };
    }

    return { success: false, message: 'كلمة المرور أو رقم PIN غير صحيح.' };
  };

  const loginWithPin = async (pin: string): Promise<{ success: boolean; message: string }> => {
    const users = db.getUsers();
    const user = users.find(u => u.pin === pin.trim());
    if (user) {
      setCurrentUser(user);
      db.logAudit(user.id, user.name, 'PIN_LOGIN', 'users', user.id, '', '', 'دخول سريع برمز PIN');
      return { success: true, message: `تم الدخول: ${user.name}` };
    }
    return { success: false, message: 'رمز PIN غير صالح.' };
  };

  const logout = () => {
    if (currentUser) {
      db.logAudit(currentUser.id, currentUser.name, 'LOGOUT', 'users', currentUser.id, '', '', 'تسجيل خروج');
    }
    setCurrentUser(null);
  };

  const switchRoleQuick = (role: UserRole) => {
    const users = db.getUsers();
    const target = users.find(u => u.role === role);
    if (target) {
      setCurrentUser(target);
    }
  };

  const registerUser = async (data: {
    name: string;
    username: string;
    password?: string;
    pin: string;
    role: UserRole;
  }): Promise<{ success: boolean; message: string; user?: User }> => {
    if (!data.name.trim() || !data.username.trim() || !data.pin.trim()) {
      return { success: false, message: 'من فضلك املأ جميع الحقول المطلوبة (الاسم، اسم المستخدم، ورمز PIN).' };
    }

    const users = db.getUsers();
    const existing = users.find(u => u.username.toLowerCase() === data.username.trim().toLowerCase());
    if (existing) {
      return { success: false, message: 'اسم المستخدم مسجل مسبقاً، يرجى اختيار اسم مستخدم آخر.' };
    }

    const passwordHash = await hashString(data.password || '123456');
    const newUser: User = {
      id: 'usr-' + Date.now(),
      name: data.name.trim(),
      username: data.username.trim(),
      passwordHash,
      pin: data.pin.trim(),
      role: data.role,
      active: true,
      createdAt: new Date().toISOString(),
    };

    db.saveUser(newUser, currentUser || { id: newUser.id, name: newUser.name });
    setCurrentUser(newUser);
    db.logAudit(newUser.id, newUser.name, 'REGISTER', 'users', newUser.id, '', '', 'إنشاء حساب مستخدم جديد');
    return { success: true, message: `تم إنشاء الحساب بنجاح! أهلاً بك يا ${newUser.name}`, user: newUser };
  };

  const isAdmin = currentUser?.role === 'admin';
  const isCashier = currentUser?.role === 'cashier';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin,
        isCashier,
        login,
        loginWithPin,
        registerUser,
        logout,
        switchRoleQuick,
        setCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
