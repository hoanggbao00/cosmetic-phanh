"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import {
  Bold,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Redo,
  Strikethrough,
  Undo,
} from "lucide-react"

interface TiptapEditorProps {
  content: string
  onChange: (content: string) => void
  className?: string
}

const TiptapEditor = ({ content, onChange, className }: TiptapEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Image,
      Placeholder.configure({
        placeholder: "Write something...",
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4 w-full !max-w-full max-h-[500px] overflow-y-auto border rounded-md",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  if (!editor) {
    return null
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex max-h-[500px] flex-wrap gap-2 overflow-y-auto rounded-md border bg-muted/50 p-2">
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "bg-muted" : ""}
        >
          <Bold className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "bg-muted" : ""}
        >
          <Italic className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive("strike") ? "bg-muted" : ""}
        >
          <Strikethrough className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "bg-muted" : ""}
        >
          <List className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "bg-muted" : ""}
        >
          <ListOrdered className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive("blockquote") ? "bg-muted" : ""}
        >
          <Quote className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={() => {
            const url = window.prompt("Enter URL")
            if (url) {
              editor.chain().focus().setLink({ href: url }).run()
            }
          }}
          className={editor.isActive("link") ? "bg-muted" : ""}
        >
          <LinkIcon className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={() => {
            const url = window.prompt("Enter image URL")
            if (url) {
              editor.chain().focus().setImage({ src: url }).run()
            }
          }}
        >
          <ImageIcon className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo className="size-4" />
        </Button>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}

export default TiptapEditor
