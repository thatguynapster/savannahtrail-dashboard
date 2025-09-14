'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { User, UserRole } from '@/types/auth';
import { authApi } from '@/lib/api/auth';

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
    hasRole: (role: UserRole) => boolean;
    hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = Cookies.get('auth-token');
        if (token) {
            // Validate token and get user info
            authApi.getProfile()
                .then(setUser)
                .catch(() => {
                    Cookies.remove('auth-token');
                })
                .finally(() => setIsLoading(false));
        } else {
            setIsLoading(false);
        }
    }, []);

    const login = async (email: string, password: string) => {
        const { user: userData, token } = await authApi.login(email, password);
        Cookies.set('auth-token', token, { expires: 7 });
        setUser(userData);
        router.push('/dashboard');
    };

    const logout = () => {
        Cookies.remove('auth-token');
        setUser(null);
        router.push('/auth/login');
    };

    const hasRole = (role: UserRole) => {
        return user?.role === role || user?.role === 'admin';
    };

    const hasPermission = (permission: string) => {
        return user?.permissions?.includes(permission) || user?.role === 'admin';
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            isLoading,
            hasRole,
            hasPermission,
        }}>
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