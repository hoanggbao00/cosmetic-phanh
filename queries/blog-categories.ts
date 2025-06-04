import type {
  BlogCategory,
  BlogCategoryInsert,
  BlogCategoryUpdate,
} from "@/types/tables/blog_categories"
import { supabase } from "@/utils/supabase/client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useBlogCategories = () => {
  return useQuery({
    queryKey: ["blog-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_categories")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      return data as BlogCategory[]
    },
  })
}

export const useCreateBlogCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (category: BlogCategoryInsert) => {
      const { data, error } = await supabase
        .from("blog_categories")
        .insert(category)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-categories"] })
    },
  })
}

export const useUpdateBlogCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (category: BlogCategoryUpdate) => {
      const { id, ...rest } = category
      const { data, error } = await supabase
        .from("blog_categories")
        .update(rest)
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-categories"] })
    },
  })
}

export const useDeleteBlogCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blog_categories").delete().eq("id", id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-categories"] })
    },
  })
}
