"use client";

import { useState } from "react";
import { FileSystemItem } from "@/types/fileSystem";
import {
    ChevronRight,
    ChevronDown,
    Folder,
    FileText,
    FolderOpen,
    FilePlus,
    FolderPlus,
    Trash2,
    ArrowRightToLine
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStore } from "@/store/uiStore";
import { useFileStore } from "@/store/fileStore";

interface Props {
    item: FileSystemItem;
    level?: number;
    onMoveRequest: (item: FileSystemItem) => void; // <--- Nueva prop
}

export function FileTreeItem({ item, level = 0, onMoveRequest }: Props) {
    const [isOpen, setIsOpen] = useState(item.isOpen || false);

    const { activeNoteId, setActiveNote, openCreationMode } = useUIStore();
    const { addNote, addFolder, moveToTrash } = useFileStore();

    const isFolder = item.type === 'folder';
    const hasChildren = item.children && item.children.length > 0;
    const isActive = activeNoteId === item.id;

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isFolder) {
            setIsOpen(!isOpen);
        } else {
            setActiveNote(item.id);
        }
    };

    const handleCreate = (e: React.MouseEvent, type: 'note' | 'folder') => {
        e.stopPropagation();
        if (!isOpen) setIsOpen(true);

        if (type === 'note') {
            openCreationMode(item.id);
        } else {
            addFolder(item.id, "Nueva Carpeta");
        }
    };

    return (
        <div className="select-none"> {/* select-none para evitar resaltar texto al hacer clic rápido */}
            <div
                onClick={handleClick}
                className={cn(
                    "flex items-center gap-2 py-1.5 px-2 rounded-md cursor-pointer transition-colors text-sm pr-2 relative group",
                    isActive
                        ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-300 font-medium"
                        : "hover:bg-zinc-100 dark:hover:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400"
                )}
                style={{ paddingLeft: `${level * 12 + 8}px` }}
            >
                {/* Flecha de expansión */}
                <span className="w-4 h-4 flex items-center justify-center shrink-0 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors">
                    {isFolder && hasChildren && (
                        isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />
                    )}
                </span>

                {/* Icono de Tipo */}
                <span className={cn("shrink-0 transition-colors", isFolder ? "text-indigo-500/80" : isActive ? "text-indigo-500" : "text-zinc-400")}>
                    {isFolder ? (
                        isOpen ? <FolderOpen size={16} /> : <Folder size={16} />
                    ) : (
                        <FileText size={16} />
                    )}
                </span>

                {/* Nombre */}
                <span className="truncate flex-1">{item.name}</span>

                {/* --- BOTONES DE ACCIÓN FLOTANTES --- */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">

                    {/* 1. CREAR (Solo carpetas) */}
                    {isFolder && (
                        <>
                            {/* Botón Nota */}
                            <motion.button
                                whileHover={{ scale: 1.2, color: "#4f46e5" }} // Crece y cambia a índigo
                                whileTap={{ scale: 0.8 }} // Efecto de "presionar"
                                onClick={(e) => handleCreate(e, 'note')}
                                className="p-1 rounded-md text-zinc-400 transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-700"
                                title="Añadir Nota"
                            >
                                <FilePlus size={13} />
                            </motion.button>

                            {/* Botón Carpeta */}
                            <motion.button
                                whileHover={{ scale: 1.2, color: "#4f46e5" }}
                                whileTap={{ scale: 0.8 }}
                                onClick={(e) => handleCreate(e, 'folder')}
                                className="p-1 rounded-md text-zinc-400 transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-700"
                                title="Añadir Carpeta"
                            >
                                <FolderPlus size={13} />
                            </motion.button>
                        </>
                    )}

                    {/* 2. MOVER (Flecha) */}
                    <motion.button
                        whileHover={{ scale: 1.1, color: "#3b82f6" }}
                        onClick={(e) => { e.stopPropagation(); onMoveRequest(item); }}
                        className="p-1 text-zinc-400 hover:bg-zinc-200 rounded"
                        title="Mover a..."
                    >
                        <ArrowRightToLine size={13} />
                    </motion.button>

                    {/* 3. BORRAR (Basura) */}
                    <motion.button
                        whileHover={{ scale: 1.1, color: "#ef4444" }}
                        onClick={(e) => { e.stopPropagation(); moveToTrash(item.id); }}
                        className="p-1 text-zinc-400 hover:bg-red-100 hover:text-red-500 rounded"
                        title="Mover a papelera"
                    >
                        <Trash2 size={13} />
                    </motion.button>
                </div>
            </div>

            {/* Hijos Recursivos */}
            <AnimatePresence>
                {isFolder && isOpen && item.children && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        {item.children.map((child) => (
                            <FileTreeItem
                                key={child.id}
                                item={child}
                                level={level + 1}
                                onMoveRequest={onMoveRequest}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
