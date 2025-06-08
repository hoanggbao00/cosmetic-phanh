"use server"

import type { Image, ImageInsert, ImageUpdate } from "@/types/tables/images"
import { createSupabaseServerClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function getImages() {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from("images")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) throw error
  return data as Image[]
}

export async function getImageById(id: string) {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase.from("images").select("*").eq("id", id).single()

  if (error) throw error
  return data as Image
}

export async function createImage(image: ImageInsert) {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase.from("images").insert(image).select().single()

  if (error) throw error

  revalidatePath("/admin/images")
  return data as Image
}

export async function updateImage(id: string, image: ImageUpdate) {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase.from("images").update(image).eq("id", id).select().single()

  if (error) throw error

  revalidatePath("/admin/images")
  return data as Image
}

export async function deleteImage(id: string) {
  const supabase = await createSupabaseServerClient()

  const { error } = await supabase.from("images").delete().eq("id", id)

  if (error) throw error

  revalidatePath("/admin/images")
  return true
}

export async function uploadImage(file: File) {
  const supabase = await createSupabaseServerClient()

  // Upload to storage
  const { data: storageData, error: storageError } = await supabase.storage
    .from("images")
    .upload(`${Date.now()}-${file.name}`, file)

  if (storageError) throw storageError

  // Get public URL
  const { data: publicUrl } = supabase.storage.from("images").getPublicUrl(storageData.path)

  // Create image record
  const { data: imageData, error: imageError } = await supabase
    .from("images")
    .insert({
      url: publicUrl.publicUrl,
      storage_path: storageData.path,
      name: file.name,
      size: file.size,
      type: file.type,
    })
    .select()
    .single()

  if (imageError) throw imageError

  revalidatePath("/admin/images")
  return imageData as Image
}

export async function deleteImageFromStorage(storagePath: string) {
  const supabase = await createSupabaseServerClient()

  const { error } = await supabase.storage.from("images").remove([storagePath])

  if (error) throw error

  return true
}
