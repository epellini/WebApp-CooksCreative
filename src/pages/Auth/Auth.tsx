import React from "react";
import { Session, User } from "@supabase/supabase-js";
import { useContext, useState, useEffect, createContext } from "react";
import { supabaseClient } from "../../supabase-client";

import { User as SupabaseUser } from "@supabase/supabase-js";

interface ExtendedUser extends SupabaseUser {
  is_admin?: boolean; // Assuming is_admin is optional
}

const AuthContext = createContext<{
  session: Session | null | undefined;
  user: ExtendedUser | null | undefined; // Use ExtendedUser here
  signOut: () => void;
}>({ session: null, user: null, signOut: () => {} });

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<ExtendedUser | undefined>(undefined);
  const [session, setSession] = useState<Session | null>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const setData = async () => {
      const {
        data: { session },
        error,
      } = await supabaseClient.auth.getSession();
      if (error) throw error;
      setSession(session);
      setUser(session?.user);
      setLoading(false);

      const { data: userDetails, error: userDetailsError } = await supabaseClient
        .from('users')
        .select('is_admin')
        .eq('id', session?.user.id)
        .single(); 

        if (!userDetailsError && userDetails) {
          setUser((prevUser) => ({ ...prevUser, ...userDetails }));
        } else {
          console.error('Error fetching user details:', userDetailsError);
        } 
      }
      setLoading(false);

    const { data: listener } = supabaseClient.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user);
        setLoading(false);
      }
    );

    setData();

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const value = {
    session,
    user,
    signOut: () => supabaseClient.auth.signOut(),
  };

  // use a provider to pass down the value
  return (
    <AuthContext.Provider value={value}>
        {!loading && children}
    </AuthContext.Provider>
  );
};

// export the useAuth hook
export const useAuth = () => {
  return useContext(AuthContext);
};