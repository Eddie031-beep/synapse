"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { EditorToolbar } from "./EditorToolbar";
import { useUIStore } from "@/store/uiStore";
import { initialFileSystem } from "@/data/mockFileSystem";
import { FileSystemItem } from "@/types/fileSystem";

// Función auxiliar recursiva para encontrar una nota en el árbol
const findNoteById = (items: FileSystemItem[], id: string): FileSystemItem | null => {
    for (const item of items) {
        if (item.id === id) return item;
        if (item.children) {
            const found = findNoteById(item.children, id);
            if (found) return found;
        }
    }
    return null;
};

export default function NotesView() {
    const { activeNoteId } = useUIStore();

    // Buscar la nota activa en nuestros datos
    const activeNote = activeNoteId ? findNoteById(initialFileSystem, activeNoteId) : null;

    const editor = useEditor({
        extensions: [StarterKit],
        editorProps: {
            attributes: {
                class: "prose prose-zinc dark:prose-invert max-w-none focus:outline-none min-h-[500px] px-8 py-6",
            },
        },
        // Contenido inicial por defecto
        immediatelyRender: false,
        content: `<h1>Selecciona una nota 👋</h1><p>Haz clic en el sidebar para empezar a editar.</p>`,
    });

    // EFECTO: Cuando cambia la nota seleccionada, actualizamos el editor
    useEffect(() => {
        if (editor && activeNote) {
            // Simulamos cargar contenido diferente para cada nota
            editor.commands.setContent(`
        <h1>${activeNote.name}</h1>
        <p>Estás editando el archivo con ID: <code>${activeNote.id}</code></p>
        <p>Aquí iría el contenido real guardado en la base de datos...</p>
        <ul>
          <li>Concepto clave 1</li>
          <li>Concepto clave 2</li>
        </ul>
      `);
        }
    }, [activeNoteId, editor, activeNote]);

    return (
        <div className="flex flex-col h-full bg-white dark:bg-zinc-950">
            <EditorToolbar editor={editor} />
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-3xl mx-auto py-8">
                    <EditorContent editor={editor} />
                </div>
            </div>
        </div>
    );
}