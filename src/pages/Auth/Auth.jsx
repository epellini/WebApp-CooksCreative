import React, {
  useContext,
  useState,
  useEffect,
  createContext,
  ReactNode,
  useLayoutEffect,
} from "react";

import { supabaseClient } from "../../supabase-client";
//import { Session, User } from "@supabase/supabase-js";


const AuthContext = createContext({
  session: null,
  user: null,
  signOut: async () => {},
  isAdmin: false,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading to true when fetching data
      
      try {
        const { data, error } = await supabaseClient.auth.getSession();
        if (error) {
          console.error("Error fetching session:", error.message);
          return;
        }

        setSession(data.session);

        if (data.session?.user) {
          const { data: userDetails, error: userDetailsError } =
            await supabaseClient
              .from("users")
              .select("*")
              .eq("user_id", data.session.user.id)
              .single();
          console.log("User details:", userDetails);

          if (!userDetailsError && userDetails) {
            setUser(userDetails);
            setIsAdmin(userDetails.is_admin);
          } else {
            console.error("Error fetching user details:", userDetailsError?.message);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };

    fetchData();

    const { data: listener } = supabaseClient.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user || null);
      setIsAdmin(session?.user?.is_admin || false);

      if (session?.user) {
        fetchData();
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabaseClient.auth.signOut();
  };

  const value = { session, user, signOut, isAdmin, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};