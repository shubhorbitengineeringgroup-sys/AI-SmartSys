import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
    email: string;
    name?: string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    login: (email: string, name?: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

import { supabase } from "@/integrations/supabase/client";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // Initial session check
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                setUser({ email: session.user.email || '', name: session.user.user_metadata?.name || session.user.email?.split("@")[0] });
                setIsAuthenticated(true);
            } else {
                setUser(null);
                setIsAuthenticated(false);
            }
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setUser({ email: session.user.email || '', name: session.user.user_metadata?.name || session.user.email?.split("@")[0] });
                setIsAuthenticated(true);
            } else {
                setUser(null);
                setIsAuthenticated(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = (email: string, name?: string) => {
        // Kept for signature compatibility, but actual login process is handled in the modal calling supabase directly 
        const newUser = { email, name: name || email.split("@")[0] };
        setUser(newUser);
        setIsAuthenticated(true);
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
