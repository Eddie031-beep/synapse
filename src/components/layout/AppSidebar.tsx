"use client";

import { useState, useRef } from "react";
import {
    BrainCircuit, Search, Trash2, X, Recycle,
    UploadCloud, FolderPlus, ListTodo
} from "lucide-react";
import { useUIStore } from "@/store/uiStore";
import { useFileStore } from "@/store/fileStore";
import { cn } from "@/lib/utils";
import { FileTreeItem } from "./FileTreeItem";
import { MoveItemModal } from "./MoveItemModal";
import { FileSystemItem } from "@/types/fileSystem";

export function AppSidebar() {
    const { currentView, setView } = useUIStore();
    const { fileSystem, addFolder, trash, restoreFromTrash, deletePermanently, uploadFile } = useFileStore();

    const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
    const [itemToMove, setItemToMove] = useState<FileSystemItem | null>(null);
    const [showTrash, setShowTrash] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const openMoveModal = (item: FileSystemItem) => {
        setItemToMove(item);
        setIsMoveModalOpen(true);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            uploadFile(file);
            e.target.value = '';
        }
    };

    // Función para activar el click del input oculto
    const triggerFileUpload = () => {
        fileInputRef.current?.click();
    };

    return (
        <>
            <aside className="w-60 h-screen border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black flex flex-col transition-all duration-300 z-20">

                {/* HEADER */}
                <div className="p-5 pb-2">
                    <div className="flex items-center gap-2 mb-6 text-zinc-900 dark:text-zinc-100 cursor-pointer" onClick={() => setView('GRAPH')}>
                        <BrainCircuit className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                        <span className="font-bold text-lg tracking-tight">Synapse</span>
                    </div>

                    {/* Buscador */}
                    <div className="relative group mb-4">
                        <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-zinc-400" />
                        <input type="text" placeholder="Buscar..." className="w-full bg-zinc-100 dark:bg-zinc-900 border-none rounded-lg py-2 pl-9 pr-3 text-sm outline-none focus:ring-1 focus:ring-indigo-500 transition-all" />
                    </div>
                </div>

                {/* NAVEGACIÓN */}
                <div className="px-3 space-y-1">
                    <button onClick={() => setView('GRAPH')} className={cn("w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors", currentView === 'GRAPH' ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-300" : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900")}>
                        <BrainCircuit size={18} /> Red Neuronal
                    </button>
                    <button onClick={() => setView('TODO')} className={cn("w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors", currentView === 'TODO' ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-300" : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900")}>
                        <ListTodo size={18} /> Tareas
                    </button>
                </div>

                {/* ÁRBOL DE ARCHIVOS */}
                <nav className="flex-1 px-3 mt-6 overflow-y-auto scrollbar-thin">
                    {!showTrash && (
                        <>
                            <div className="flex items-center justify-between px-2 mb-2">
                                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Archivos</span>
                                <button onClick={(e) => { e.stopPropagation(); addFolder(null, "Carpeta"); }} className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100">
                                    <FolderPlus size={14} />
                                </button>
                            </div>
                            <div className="space-y-0.5">
                                {fileSystem.map((item) => (
                                    <FileTreeItem key={item.id} item={item} onMoveRequest={openMoveModal} />
                                ))}
                            </div>
                        </>
                    )}

                    {/* LISTA DE PAPELERA */}
                    {showTrash && (
                        <div className="px-2 space-y-1">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">Eliminados</span>
                                <button onClick={() => setShowTrash(false)} className="text-xs text-zinc-400 hover:underline">Volver</button>
                            </div>
                            {trash.length === 0 ? <p className="text-xs text-zinc-400 italic text-center">Vacía</p> : trash.map(item => (
                                <div key={item.id} className="flex justify-between items-center bg-red-50/50 dark:bg-red-900/10 p-2 rounded text-xs group">
                                    <span className="truncate flex-1 text-zinc-600 dark:text-zinc-400">{item.name}</span>
                                    <div className="flex gap-2">
                                        <button onClick={() => restoreFromTrash(item.id)}><Recycle size={12} className="text-green-500" /></button>
                                        <button onClick={() => deletePermanently(item.id)}><X size={12} className="text-red-500" /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </nav>

                {/* FOOTER: SUBIR Y PAPELERA */}
                <div className="p-3 border-t border-zinc-200 dark:border-zinc-800">
                    <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />

                    <div className="grid grid-cols-2 gap-2">
                        <button onClick={triggerFileUpload} className="flex flex-col items-center justify-center p-3 rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors text-zinc-600 dark:text-zinc-400">
                            <UploadCloud size={20} className="mb-1" />
                            <span className="text-[10px] font-medium">Subir</span>
                        </button>
                        <button onClick={() => setShowTrash(!showTrash)} className={cn("flex flex-col items-center justify-center p-3 rounded-xl transition-colors", showTrash ? "bg-red-100 text-red-600" : "bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-red-50 hover:text-red-500")}>
                            <Trash2 size={20} className="mb-1" />
                            <span className="text-[10px] font-medium">Papelera</span>
                        </button>
                    </div>
                </div>
            </aside>

            <MoveItemModal isOpen={isMoveModalOpen} onClose={() => setIsMoveModalOpen(false)} itemToMove={itemToMove} />
        </>
    );
}