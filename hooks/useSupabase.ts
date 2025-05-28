import type { Database } from "@/types/supabase";
import { supabase } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

// Hook for products
export function useProducts(options?: {
  category?: string;
  brand?: string;
  limit?: number;
  offset?: number;
}) {
  const [products, setProducts] = useState<Database["public"]["Tables"]["products"]["Row"][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchProducts() {
      setLoading(true);
      setError(null);
      try {
        let query = supabase
          .from("products")
          .select("*, category:categories(*), brand:brands(*)")
          .eq("is_active", true);

        if (options?.category) {
          query = query.eq("category.slug", options.category);
        }
        if (options?.brand) {
          query = query.eq("brand.slug", options.brand);
        }
        if (options?.limit) {
          query = query.limit(options.limit);
        }
        if (options?.offset) {
          query = query.range(options.offset, (options.offset || 0) + (options?.limit || 20) - 1);
        }

        const { data, error } = await query;
        if (error) throw error;
        if (isMounted) setProducts(data || []);
      } catch (e) {
        if (isMounted) setError(e as Error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchProducts();
    return () => {
      isMounted = false;
    };
  }, [options?.category, options?.brand, options?.limit, options?.offset]);

  return { products, loading, error };
}

// Hook for user profile
export function useProfile() {
  const [profile, setProfile] = useState<Database["public"]["Tables"]["profiles"]["Row"] | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchProfile() {
      setLoading(true);
      setError(null);
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (!user) throw new Error("No user found");
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        if (error) throw error;
        if (isMounted) setProfile(data);
      } catch (e) {
        if (isMounted) setError(e as Error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  return { profile, loading, error };
}
