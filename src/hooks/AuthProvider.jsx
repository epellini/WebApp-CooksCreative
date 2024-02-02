import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSupabase } from './useSupabase'; // Adjust based on your actual import

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const { supabase } = useSupabase();
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      console.log('Checking session...');
      supabase.auth.getSession().then(({ data: { session } }) => {
        console.log('Session:', session);
        setSession(session);
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        console.log('Auth state changed:', session);
        setSession(session);
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    }, []);


    return (
        <AuthContext.Provider value={{ session, setSession, loading, supabase }}>
            {children}
        </AuthContext.Provider>
    );
};
