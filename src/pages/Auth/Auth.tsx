import React, { useContext, useState, useEffect, createContext, ReactNode, useLayoutEffect } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabaseClient } from "../../supabase-client";


const AuthContext = createContext<{
  session: Session | null;
  user: User | null;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}>({
  session: null,
  user: null,
  signOut: async () => {},
  isAdmin: false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session }, error } = await supabaseClient.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error.message);
        setLoading(false);
        return;
      }
  
      setSession(session);
  
      if (session?.user) {
        const { data: userDetails, error: userDetailsError } = await supabaseClient
          .from('users')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
          console.log(session.user.id)
  
        if (!userDetailsError && userDetails) {
          setUser(userDetails);
          console.log(userDetails.is_admin);
          setIsAdmin(userDetails.is_admin);
        } else {
          console.error('Error fetching user details:', userDetailsError?.message);
        }
      }
  
      setLoading(false);
    };
  
    fetchData();
  
    const { data: listener } = supabaseClient.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user || null);
        setLoading(false);
      }
    );
  
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabaseClient.auth.signOut();
  };

  if (loading) {
    // Render a loading indicator or skeleton UI while fetching data
    return <div>Loading...</div>;
  }

  const value = { session, user, signOut, isAdmin };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
