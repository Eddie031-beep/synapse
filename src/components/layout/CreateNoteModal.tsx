"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Sparkles } from "lucide-react";
import { useUIStore } from "@/store/uiStore";
import { useFileStore } from "@/store/fileStore";

export function CreateNoteModal() {
    const { isCreationOpen, creationParentId, closeCreationMode, setActiveNote } = useUIStore();
    const { addNote } = useFileStore();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    // Limpiar inputs cuando se abre
    useEffect(() => {
        if (isCreationOpen) {
            setTitle("");
            setContent("");
        }
    }, [isCreationOpen]);

    const handleSave = () => {
        if (!title.trim()) return; // No guardar si no hay título

        // 1. Crear la nota real
        const newId = addNote(creationParentId, title);

        // 2. Activarla y cerrar modal
        setActiveNote(newId);
        closeCreationMode();
    };

    return (
        <AnimatePresence>
            {isCreationOpen && (
                <motion.div
                    initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                    animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
                    exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 dark:bg-black/80"
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="w-full max-w-2xl h-[80vh] md:h-auto bg-white dark:bg-zinc-900 md:rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col relative"
                    >
                        <div className="absolute top-0 right-0 p-32 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                        <div className="flex justify-between items-center p-6 border-b border-zinc-100 dark:border-zinc-800">
                            <div className="flex items-center gap-2 text-indigo-500">
                                <Sparkles size={18} />
                                <span className="text-xs font-bold tracking-widest uppercase">Nueva Idea</span>
                            </div>
                            <button
                                onClick={closeCreationMode}
                                className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                            >
                                <X size={20} className="text-zinc-400 hover:text-zinc-600" />
                            </button>
                        </div>

                        <div className="flex-1 p-8 md:p-12 flex flex-col gap-6 overflow-y-auto">
                            <input
                                autoFocus
                                type="text"
                                placeholder="Título brillante..."
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="text-4xl md:text-5xl font-bold bg-transparent border-none outline-none placeholder:text-zinc-300 dark:placeholder:text-zinc-700 text-zinc-900 dark:text-zinc-100 w-full"
                            />

                            <textarea
                                placeholder="Escribe lo que desees... (opcional)"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="flex-1 resize-none bg-transparent border-none outline-none text-lg md:text-xl text-zinc-600 dark:text-zinc-400 placeholder:text-zinc-300 dark:placeholder:text-zinc-800 leading-relaxed"
                            />
                        </div>

                        <div className="p-6 bg-zinc-50 dark:bg-zinc-950/50 flex justify-end gap-3 border-t border-zinc-100 dark:border-zinc-800">
                            <button
                                onClick={closeCreationMode}
                                className="px-6 py-3 rounded-xl text-sm font-medium text-zinc-500 hover:text-zinc-800 hover:bg-zinc-200/50 transition-colors"
                            >
                                Cancelar
                            </button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleSave}
                                disabled={!title.trim()}
                                className="px-8 py-3 rounded-xl text-sm font-bold bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Check size={18} />
                                Guardar Nota
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
