"use client";

import { supabase } from "@/lib/config/supabase";
import type { Database } from "@/types/supabase";
import { useEffect, useState } from "react";

export const useProducts = (options?: {
  category?: string;
  brand?: string;
  limit?: number;
}) => {
  const [products, setProducts] = useState<Database["public"]["Tables"]["products"]["Row"][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
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

        const { data, error } = await query;

        if (error) throw error;
        setProducts(data);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [options?.category, options?.brand, options?.limit]);

  return { products, loading, error };
};

// Hook for user profile
export const useProfile = () => {
  const [profile, setProfile] = useState<Database["public"]["Tables"]["profiles"]["Row"] | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) throw new Error("No user found");

        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return { profile, loading, error };
};
