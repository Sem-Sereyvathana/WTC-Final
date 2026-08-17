import { useEffect, useState } from "react";
import { supabase } from "../../supabase_client";

// Shared auth-state hook — call this from any component that needs to
// know whether someone is logged in (e.g. Header, WebsiteHome). Each
// call subscribes independently to Supabase's auth listener, so no
// context/provider wiring is required.
export function useAuth() {
  const [session, setSession] = useState(undefined); // undefined = still loading
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    let cancelled = false;

    supabase.auth.getSession().then(({ data }) => {
      if (!cancelled) setSession(data.session ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!cancelled) setSession(newSession);
    });

    return () => {
      cancelled = true;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    if (!session?.user?.id) {
      setProfile(null);
      return;
    }

    supabase
      .from("profiles")
      .select("username")
      .eq("id", session.user.id)
      .single()
      .then(({ data }) => {
        if (!cancelled) setProfile(data ?? null);
      });

    return () => {
      cancelled = true;
    };
  }, [session?.user?.id]);

  async function signOut() {
    await supabase.auth.signOut();
  }

  return {
    session,
    user: session?.user ?? null,
    username: profile?.username ?? null,
    isLoggedIn: !!session,
    loading: session === undefined,
    signOut,
  };
}