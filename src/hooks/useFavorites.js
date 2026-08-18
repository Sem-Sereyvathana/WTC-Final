import { useCallback, useEffect, useState } from "react";
import { supabase } from "../../supabase_client";
import { useAuth } from "./useAuth";

export function useFavorites() {
  const { user, isLoggedIn } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    if (!isLoggedIn || !user?.id) {
      setFavoriteIds(new Set());
      setLoading(false);
      return;
    }

    setLoading(true);
    supabase
      .from("favorites")
      .select("product_id")
      .eq("user_id", user.id)
      .then(({ data, error }) => {
        if (cancelled) return;
        if (!error && data) {
          setFavoriteIds(new Set(data.map((row) => row.product_id)));
        }
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isLoggedIn, user?.id]);

  const isFavorite = useCallback(
    (productId) => favoriteIds.has(productId),
    [favoriteIds]
  );

  const toggleFavorite = useCallback(
    async (productId) => {
      if (!isLoggedIn || !user?.id) {
        return { error: "not-logged-in" };
      }

      const alreadyFavorite = favoriteIds.has(productId);

      setFavoriteIds((prev) => {
        const next = new Set(prev);
        if (alreadyFavorite) next.delete(productId);
        else next.add(productId);
        return next;
      });

      if (alreadyFavorite) {
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("product_id", productId);

        if (error) {
          setFavoriteIds((prev) => new Set(prev).add(productId));
          return { error };
        }
      } else {
        const { error } = await supabase
          .from("favorites")
          .insert({ user_id: user.id, product_id: productId });

        if (error) {
          setFavoriteIds((prev) => {
            const next = new Set(prev);
            next.delete(productId);
            return next;
          });
          return { error };
        }
      }

      return { error: null };
    },
    [favoriteIds, isLoggedIn, user?.id]
  );

  return { favoriteIds, isFavorite, toggleFavorite, loading };
}
