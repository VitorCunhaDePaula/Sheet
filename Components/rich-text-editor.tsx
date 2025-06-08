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
          "is-empty before:content-[attr(data-placeholder)] before:text-gray-400 before:float-left before:pointer-events-none font-[14px] placeholder:text-[#99A1AF] placeholder:text-[16px]  text-normal text-[#101828]",
      }),
    ],
    content: content || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[120px] pb-1 px-4 placeholder:text-[#99A1AF] placeholder:text-[14px]  text-normal text-[#101828]",
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="border border-[#D1D5DC] rounded-lg overflow-hidden bg-white">
      <div className="border-b border-[#D1D5DC] p-2 flex items-center justify-between h-10">
        <div className="flex items-center gap-1 sm:gap-2 w-1/2 overflow-x-auto text-[#101828] ">
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
            className="text-[13px] font-medium px-3 py-1.5 border border-[#E6E6E8] rounded-lg text-black flex items-center gap-1 cursor-pointer hover:bg-[#F9FAFB]"
          >
            <svg
              className="h-4 w-4"
              width="12"
              height="14"
              viewBox="0 0 12 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.70381 5.46923C6.79995 5.18083 7.20789 5.18083 7.30403 5.46924L7.86913 7.16456C8.12102 7.92025 8.71401 8.51324 9.46971 8.76514L11.165 9.33025C11.4534 9.42638 11.4534 9.83433 11.165 9.93047L9.46971 10.4956C8.71402 10.7475 8.12102 11.3405 7.86913 12.0962L7.30403 13.7915C7.20789 14.0799 6.79995 14.0799 6.70381 13.7915L6.13869 12.0961C5.88679 11.3405 5.2938 10.7475 4.53812 10.4956L2.84277 9.93047C2.55436 9.83433 2.55436 9.42638 2.84277 9.33025L4.53812 8.76513C5.2938 8.51324 5.88679 7.92026 6.13869 7.16457L6.70381 5.46923Z"
                fill="#101828"
              />
              <path
                d="M3.3219 1.00527C3.37958 0.832227 3.62435 0.832228 3.68203 1.00527L4.02109 2.02247C4.17223 2.47588 4.52802 2.83168 4.98144 2.98282L5.99864 3.32188C6.17169 3.37957 6.17169 3.62433 5.99864 3.68201L4.98144 4.02108C4.52803 4.17222 4.17223 4.52802 4.02109 4.98143L3.68203 5.99863C3.62435 6.17168 3.37958 6.17168 3.3219 5.99864L2.98283 4.98142C2.83169 4.52801 2.47589 4.17222 2.02248 4.02108L1.00527 3.68201C0.832227 3.62433 0.832227 3.37957 1.00527 3.32188L2.02248 2.98281C2.47589 2.83168 2.83169 2.47589 2.98283 2.02248L3.3219 1.00527Z"
                fill="#101828"
              />
              <path
                d="M9.51034 0.0865214C9.5488 -0.0288412 9.71197 -0.0288402 9.75043 0.0865227L9.97647 0.764652C10.0772 1.06693 10.3144 1.30413 10.6167 1.40489L11.2948 1.63093C11.4102 1.66939 11.4102 1.83256 11.2948 1.87102L10.6167 2.09706C10.3144 2.19782 10.0772 2.43502 9.97647 2.7373L9.75043 3.41543C9.71197 3.53079 9.54879 3.53079 9.51034 3.41543L9.28429 2.73729C9.18353 2.43502 8.94634 2.19782 8.64406 2.09706L7.96592 1.87102C7.85056 1.83256 7.85056 1.66939 7.96592 1.63093L8.64406 1.40488C8.94634 1.30413 9.18353 1.06693 9.28429 0.764659L9.51034 0.0865214Z"
                fill="#101828"
              />
            </svg>{" "}
            <span className="mr-1 text-[#101828] text-[13px]">
              Generate with AI
            </span>
          </button>
        </div>
      </div>

      <div className="min-h-[120px] bg-white">
        <EditorContent
          editor={editor}
          className="prose prose-sm max-w-none [&_.ProseMirror]:min-h-[120px] [&_.ProseMirror]:outline-none [&_.ProseMirror_p]:my-2 [&_.ProseMirror_ul]:my-2 [&_.ProseMirror_ol]:my-2 placeholder:text-[12px]"
        />
      </div>
    </div>
  );
}
