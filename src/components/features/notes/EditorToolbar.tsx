"use client";

import { type Editor } from "@tiptap/react";
import {
    Bold,
    Italic,
    List,
    Heading1,
    Heading2,
    Quote,
    Undo,
    Redo
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
    editor: Editor | null;
}

export function EditorToolbar({ editor }: Props) {
    if (!editor) return null;

    const ToggleButton = ({
        isActive,
        onClick,
        children
    }: { isActive?: boolean; onClick: () => void; children: React.ReactNode }) => (
        <button
            onClick={onClick}
            className={cn(
                "p-2 rounded-md transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-700",
                isActive
                    ? "bg-zinc-200 dark:bg-zinc-700 text-black dark:text-white"
                    : "text-zinc-500 dark:text-zinc-400"
            )}
        >
            {children}
        </button>
    );

    return (
        <div className="border-b border-zinc-200 dark:border-zinc-800 p-2 flex gap-1 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-10">

            <ToggleButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                isActive={editor.isActive("heading", { level: 1 })}
            >
                <Heading1 className="w-4 h-4" />
            </ToggleButton>

            <ToggleButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                isActive={editor.isActive("heading", { level: 2 })}
            >
                <Heading2 className="w-4 h-4" />
            </ToggleButton>

            <div className="w-px h-6 bg-zinc-300 dark:bg-zinc-700 mx-2 self-center" />

            <ToggleButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={editor.isActive("bold")}
            >
                <Bold className="w-4 h-4" />
            </ToggleButton>

            <ToggleButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={editor.isActive("italic")}
            >
                <Italic className="w-4 h-4" />
            </ToggleButton>

            <div className="w-px h-6 bg-zinc-300 dark:bg-zinc-700 mx-2 self-center" />

            <ToggleButton
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                isActive={editor.isActive("bulletList")}
            >
                <List className="w-4 h-4" />
            </ToggleButton>

            <ToggleButton
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                isActive={editor.isActive("blockquote")}
            >
                <Quote className="w-4 h-4" />
            </ToggleButton>

            <div className="flex-1" />

            <ToggleButton onClick={() => editor.chain().focus().undo().run()}>
                <Undo className="w-4 h-4" />
            </ToggleButton>

            <ToggleButton onClick={() => editor.chain().focus().redo().run()}>
                <Redo className="w-4 h-4" />
            </ToggleButton>

        </div>
    );
}