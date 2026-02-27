"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Plus, X, Save, MoreHorizontal } from "lucide-react";
import { useFileStore } from "@/store/fileStore";
import { useUIStore } from "@/store/uiStore";

export function QuickNoteWidget() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);

    const { addNote } = useFileStore();
    const { setActiveNote } = useUIStore();

    const handleSave = () => {
        if (!title.trim()) return;
        const newId = addNote(null, title); // Crea en la raíz
        setActiveNote(newId); // Te lleva a la nota creada

        // Limpiar y cerrar
        setTitle("");
        setContent("");
        setIsExpanded(false);
    };

    return (
        <motion.div
            layout
            ref={containerRef}
            className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden"
            initial={{ borderRadius: 12 }}
        >
            {!isExpanded ? (
                // ESTADO CONTRAÍDO (Botón pequeño)
                <motion.button
                    layout="position"
                    onClick={() => setIsExpanded(true)}
                    className="w-full p-3 flex items-center gap-3 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors group"
                >
                    <div className="bg-zinc-100 dark:bg-zinc-800 p-1.5 rounded-md group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700 transition-colors">
                        <Plus size={16} />
                    </div>
                    <span className="text-sm font-medium">Crear nota rápida...</span>
                </motion.button>
            ) : (
                // ESTADO EXPANDIDO (Formulario)
                <motion.div layout="position" className="p-4 flex flex-col gap-3">

                    <div className="flex justify-between items-start">
                        <input
                            autoFocus
                            className="bg-transparent border-none outline-none font-bold text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 w-full"
                            placeholder="Título..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <button onClick={() => setIsExpanded(false)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
                            <X size={16} />
                        </button>
                    </div>

                    <textarea
                        className="w-full bg-transparent border-none outline-none text-sm text-zinc-600 dark:text-zinc-300 placeholder:text-zinc-500 resize-none min-h-[80px]"
                        placeholder="Escribe algo breve..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />

                    <div className="flex justify-between items-center pt-2 border-t border-zinc-100 dark:border-zinc-800">
                        {/* Botón de Opciones Extra (•••) */}
                        <button className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors" title="Más opciones">
                            <MoreHorizontal size={16} />
                        </button>

                        <button
                            onClick={handleSave}
                            disabled={!title.trim()}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-md text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-500/20"
                        >
                            <Save size={14} /> Guardar
                        </button>
                    </div>

                </motion.div>
            )}
        </motion.div>
    );
}
