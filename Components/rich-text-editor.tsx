"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  ImageIcon,
  Video,
  Sparkles,
} from "lucide-react";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = "Add a description...",
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({
        placeholder,
        emptyEditorClass:
          "is-empty before:content-[attr(data-placeholder)] before:text-gray-400 before:float-left before:pointer-events-none text-[#99A1AF]",
      }),
    ],
    content: content || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[120px] pb-1 px-4",
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="border border-[#D1D5DC] rounded-lg overflow-hidden bg-white">
      <div className="border-b border-[#D1D5DC] p-2 flex items-center justify-between">
        <div className="flex items-center gap-1 sm:gap-2 w-1/2 overflow-x-auto text-[#99A1AF]">
          {[
            {
              icon: Bold,
              action: () => editor.chain().focus().toggleBold().run(),
              active: editor.isActive("bold"),
            },
            {
              icon: Italic,
              action: () => editor.chain().focus().toggleItalic().run(),
              active: editor.isActive("italic"),
            },
            {
              icon: UnderlineIcon,
              action: () => editor.chain().focus().toggleUnderline().run(),
              active: editor.isActive("underline"),
            },
            {
              icon: Strikethrough,
              action: () => editor.chain().focus().toggleStrike().run(),
              active: editor.isActive("strike"),
            },
            {
              icon: List,
              action: () => editor.chain().focus().toggleBulletList().run(),
              active: editor.isActive("bulletList"),
            },
            {
              icon: ListOrdered,
              action: () => editor.chain().focus().toggleOrderedList().run(),
              active: editor.isActive("orderedList"),
            },
            { icon: ImageIcon, action: () => {} },
            { icon: Video, action: () => {} },
          ].map(({ icon: Icon, action, active }, i) => (
            <button
              key={i}
              onClick={action}
              type="button"
              className={`w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 ${
                active ? "bg-gray-200" : ""
              }`}
            >
              <Icon className="w-4 h-4" />
            </button>
          ))}
        </div>

        <div className="ml-auto">
          <button
            type="button"
            className="text-[13px] font-semibold px-3 py-1.5 shadow-lg rounded-lg text-black flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="h-4 w-4" /> Generate with AI
          </button>
        </div>
      </div>

      <div className="min-h-[120px] bg-white">
        <EditorContent
          editor={editor}
          className="prose prose-sm max-w-none [&_.ProseMirror]:min-h-[120px] [&_.ProseMirror]:outline-none [&_.ProseMirror_p]:my-2 [&_.ProseMirror_ul]:my-2 [&_.ProseMirror_ol]:my-2"
        />
      </div>
    </div>
  );
}
