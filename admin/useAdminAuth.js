import { useEffect, useState } from "react";
import { supabase } from "../supabase_client";
import { useAuth } from "../src/hooks/useAuth";

export function useAdminAuth() {
  const { user, isLoggedIn, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    if (authLoading) return;

    if (!isLoggedIn || !user?.id) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()
      .then(({ data, error }) => {
        console.log("[useAdminAuth] user.id:", user.id);
        console.log("[useAdminAuth] profiles row:", data);
        console.log("[useAdminAuth] error:", error);

        if (!cancelled) {
          setIsAdmin(data?.role === "admin");
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isLoggedIn, user?.id, authLoading]);

  return { isAdmin, loading: authLoading || loading };
}