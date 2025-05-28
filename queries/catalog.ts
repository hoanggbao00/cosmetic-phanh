import { supabase } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const useGetCatalog = () => {
  return useQuery({
    queryKey: ["catalog"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
};
