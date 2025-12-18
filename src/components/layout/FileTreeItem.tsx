"use client";

import { useState } from "react";
import { FileSystemItem } from "@/types/fileSystem";
import {
    ChevronRight,
    ChevronDown,
    Folder,
    FileText,
    FolderOpen
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStore } from "@/store/uiStore"; // <--- 1. Importar el store

interface Props {
    item: FileSystemItem;
    level?: number;
}

export function FileTreeItem({ item, level = 0 }: Props) {
    const [isOpen, setIsOpen] = useState(item.isOpen || false);
    // 2. Conectamos con el estado global para saber cuál está activa
    const { activeNoteId, setActiveNote } = useUIStore();

    const isFolder = item.type === 'folder';
    const hasChildren = item.children && item.children.length > 0;
    // 3. Verificamos si este ítem es el activo
    const isActive = activeNoteId === item.id;

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Evitar que el click cierre carpetas padres

        if (isFolder) {
            setIsOpen(!isOpen);
        } else {
            // 4. Si es archivo, lo activamos
            setActiveNote(item.id);
        }
    };

    return (
        <div>
            <div
                onClick={handleClick}
                className={cn(
                    "flex items-center gap-2 py-1.5 px-2 rounded-md cursor-pointer transition-colors select-none text-sm group",
                    // 5. Estilo condicional: Si está activo, fondo azul/gris más oscuro
                    isActive
                        ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-300 font-medium"
                        : "hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400"
                )}
                style={{ paddingLeft: `${level * 12 + 8}px` }}
            >
                <span className="w-4 h-4 flex items-center justify-center shrink-0">
                    {isFolder && hasChildren && (
                        isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />
                    )}
                </span>

                <span className={cn("shrink-0", isFolder ? "text-indigo-500/80" : isActive ? "text-indigo-500" : "text-zinc-400")}>
                    {isFolder ? (
                        isOpen ? <FolderOpen size={16} /> : <Folder size={16} />
                    ) : (
                        <FileText size={16} />
                    )}
                </span>

                <span className="truncate">{item.name}</span>
            </div>

            <AnimatePresence>
                {isFolder && isOpen && hasChildren && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        {item.children!.map((child) => (
                            <FileTreeItem key={child.id} item={child} level={level + 1} />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}