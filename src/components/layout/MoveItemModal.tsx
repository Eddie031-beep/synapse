"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Folder, X } from "lucide-react";
import { useFileStore } from "@/store/fileStore";
import { FileSystemItem } from "@/types/fileSystem";
import { cn } from "@/lib/utils";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    itemToMove: FileSystemItem | null;
}

export function MoveItemModal({ isOpen, onClose, itemToMove }: Props) {
    const { fileSystem, moveItem } = useFileStore();

    const handleMove = (targetFolderId: string | null) => {
        if (itemToMove) {
            moveItem(itemToMove.id, targetFolderId);
            onClose();
        }
    };

    // Renderizado recursivo simple solo de carpetas para el selector
    const renderFolderOptions = (items: FileSystemItem[], level = 0) => {
        return items.map((item) => {
            if (item.type !== 'folder' || item.id === itemToMove?.id) return null; // No mover dentro de sí mismo

            return (
                <div key={item.id}>
                    <button
                        onClick={() => handleMove(item.id)}
                        className="flex items-center gap-2 w-full p-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-md transition-colors text-sm text-left"
                        style={{ paddingLeft: `${level * 16 + 8}px` }}
                    >
                        <Folder size={16} className="text-indigo-500" />
                        <span className="text-zinc-700 dark:text-zinc-200">{item.name}</span>
                    </button>
                    {item.children && renderFolderOptions(item.children, level + 1)}
                </div>
            );
        });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="bg-white dark:bg-zinc-900 w-96 max-h-[80vh] rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col overflow-hidden"
                    >
                        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
                            <h3 className="font-semibold text-zinc-800 dark:text-zinc-100">
                                Mover "{itemToMove?.name}" a...
                            </h3>
                            <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
                            {/* Opción Raíz */}
                            <button
                                onClick={() => handleMove(null)}
                                className="flex items-center gap-2 w-full p-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-md transition-colors text-sm text-left mb-1"
                            >
                                <Folder size={16} className="text-zinc-400" />
                                <span className="text-zinc-500 italic">Carpeta Raíz (Inicio)</span>
                            </button>

                            {/* Árbol de carpetas */}
                            {renderFolderOptions(fileSystem)}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}