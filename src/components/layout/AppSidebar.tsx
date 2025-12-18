"use client";

import { FileTreeItem } from "./FileTreeItem";
import { initialFileSystem } from "@/data/mockFileSystem";

import {
    BrainCircuit,
    ListTodo,
    Settings,
    Search,
    Plus
} from "lucide-react";
import { useUIStore } from "@/store/uiStore"; // Importamos nuestro cerebro
import { cn } from "@/lib/utils"; // Utilidad de Shadcn para clases condicionales

export function AppSidebar() {
    // Conectamos con el estado global
    const { currentView, setView } = useUIStore();

    return (
        <aside className="w-64 h-screen border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex flex-col transition-all duration-300">

            {/* HEADER */}
            <div className="p-6 pb-2">
                <div className="flex items-center gap-2 mb-6 text-zinc-800 dark:text-zinc-100">
                    <div className="p-2 bg-black dark:bg-white rounded-lg">
                        <BrainCircuit className="w-5 h-5 text-white dark:text-black" />
                    </div>
                    <span className="font-bold text-lg tracking-tight">Synapse</span>
                </div>

                <div className="relative group">
                    <Search className="absolute left-2 top-2.5 w-4 h-4 text-zinc-400 group-hover:text-zinc-600 transition-colors" />
                    <input
                        type="text"
                        placeholder="Buscar..."
                        className="w-full bg-zinc-200/50 dark:bg-zinc-900 border border-transparent focus:bg-white dark:focus:bg-black focus:border-zinc-300 dark:focus:border-zinc-700 rounded-md py-2 pl-8 pr-3 text-sm outline-none transition-all"
                    />
                </div>
            </div>

            {/* NAVEGACIÓN */}
            <nav className="flex-1 px-4 space-y-1 mt-4">
                <p className="px-2 text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">
                    Espacio de Trabajo
                </p>

                {/* Botón 1: VISTA NEURONAL */}
                <button
                    onClick={() => setView('GRAPH')}
                    className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                        currentView === 'GRAPH'
                            ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm border border-zinc-200 dark:border-zinc-800"
                            : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50"
                    )}
                >
                    <BrainCircuit className={cn("w-4 h-4", currentView === 'GRAPH' ? "text-indigo-500" : "")} />
                    Vista Neuronal
                </button>

                {/* SECCIÓN DE ARCHIVOS */}
                <div className="pt-4 pb-2">
                    <p className="px-2 text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2 flex justify-between items-center group cursor-pointer hover:text-zinc-600 dark:hover:text-zinc-300">
                        Mis Carpetas
                        <Plus className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </p>

                    {/* Renderizamos la raíz del sistema de archivos */}
                    <div className="space-y-0.5">
                        {initialFileSystem.map((item) => (
                            <FileTreeItem key={item.id} item={item} />
                        ))}
                    </div>
                </div>

                {/* Botón 3: TABLERO */}
                <button
                    onClick={() => setView('TODO')}
                    className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                        currentView === 'TODO'
                            ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm border border-zinc-200 dark:border-zinc-800"
                            : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50"
                    )}
                >
                    <ListTodo className="w-4 h-4" />
                    Tablero de Tareas
                </button>
            </nav>

            {/* FOOTER */}
            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
                <button className="flex items-center gap-2 w-full justify-center bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity mb-3">
                    <Plus className="w-4 h-4" />
                    Nueva Nota
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                    <Settings className="w-4 h-4" />
                    Configuración
                </button>
            </div>
        </aside>
    );
}