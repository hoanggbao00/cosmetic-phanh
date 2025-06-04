"use client"

import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { DataTable } from "@/components/shared/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useBlogCategories, useCreateBlogCategory, useDeleteBlogCategory } from "@/queries/blog-categories"
import { BlogCategory } from "@/types/tables/blog_categories"
import { EditIcon, MoreHorizontalIcon, PlusIcon, TrashIcon } from "lucide-react"
import { toast } from "sonner"
import { BlogCategoryDialog } from "./blog-category-dialog"
export default function BlogCategoriesTable() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory | null>(null)

  const { data: categories, isLoading } = useBlogCategories()
  const { mutate: createCategory } = useCreateBlogCategory()
  const { mutate: deleteCategory } = useDeleteBlogCategory()

  const columns: ColumnDef<BlogCategory>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "slug",
      header: "Slug",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "is_active",
      header: "Status",
      cell: ({ row }) => {
        const isActive = row.original.is_active
        return (
          <Badge variant={isActive ? "default" : "secondary"}>
            {isActive ? "Active" : "Inactive"}
          </Badge>
        )
      },
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ row }) => format(new Date(row.original.created_at), "PPP"),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const category = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setSelectedCategory(category)
                  setOpen(true)
                }}
              >
                <EditIcon className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  if (window.confirm("Are you sure you want to delete this category?")) {
                    deleteCategory(category.id, {
                      onSuccess: () => {
                        toast.success("Category deleted successfully")
                        router.refresh()
                      },
                      onError: () => {
                        toast.error("Failed to delete category")
                      },
                    })
                  }
                }}
                className="text-destructive"
              >
                <TrashIcon className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => {
          setSelectedCategory(null)
          setOpen(true)
        }}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={categories || []}
      />
      <BlogCategoryDialog
        open={open}
        setOpen={setOpen}
        category={selectedCategory}
      />
    </div>
  )
} 