"use client";

import { useTheme } from "next-themes";
import { User, Sun, Moon, Laptop, Bell, ShieldCheck, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { QuickNoteWidget } from "@/components/features/notes/QuickNoteWidget";
import { useUIStore } from "@/store/uiStore";

export function RightSidebar() {
    const { setTheme, theme } = useTheme();
    const { isGuest } = useUIStore();

    return (
        <aside className="w-80 h-screen border-l border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 flex flex-col p-4 gap-6 transition-all hidden xl:flex">

            {/* 1. HEADER: PERFIL Y AJUSTES */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md", isGuest ? "bg-zinc-400" : "bg-indigo-500")}>
                        <User size={18} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                            {isGuest ? "Invitado" : "Eddie Man"}
                        </p>
                        <p className="text-xs text-zinc-500">
                            {isGuest ? "Local" : "Pro"}
                        </p>
                    </div>
                </div>

                {/* Botones de Ajustes y Notificaciones */}
                <div className="flex gap-1">
                    <button className="p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition-colors" title="Configuración">
                        <Settings size={18} />
                    </button>
                    <button className="p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition-colors relative" title="Notificaciones">
                        <Bell size={18} />
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-zinc-50 dark:border-zinc-950"></span>
                    </button>
                </div>
            </div>

            {/* 2. WIDGET DE CREACIÓN RÁPIDA (El del paso 1) */}
            <QuickNoteWidget />

            {/* 3. SELECTOR DE TEMA (Claro/Oscuro) */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-1 flex gap-1">
                <button onClick={() => setTheme("light")} className={cn("flex-1 py-1.5 rounded-lg flex items-center justify-center gap-2 text-xs font-medium transition-all", theme === 'light' ? "bg-zinc-100 text-zinc-900 shadow-sm" : "text-zinc-400 hover:text-zinc-600")}>
                    <Sun size={14} /> Claro
                </button>
                <button onClick={() => setTheme("dark")} className={cn("flex-1 py-1.5 rounded-lg flex items-center justify-center gap-2 text-xs font-medium transition-all", theme === 'dark' ? "bg-zinc-800 text-zinc-100 shadow-sm" : "text-zinc-400 hover:text-zinc-300")}>
                    <Moon size={14} /> Oscuro
                </button>
                <button onClick={() => setTheme("system")} className={cn("flex-1 py-1.5 rounded-lg flex items-center justify-center gap-2 text-xs font-medium transition-all", theme === 'system' ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm" : "text-zinc-400")}>
                    <Laptop size={14} /> Auto
                </button>
            </div>

            {/* 4. ESTADO DE SEGURIDAD */}
            <div className="mt-auto bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-2">
                    <ShieldCheck size={18} />
                    <span className="text-xs font-bold uppercase tracking-wider">Sistema Protegido</span>
                </div>
                <div className="w-full bg-emerald-500/20 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[95%] rounded-full" />
                </div>
                <p className="text-[10px] text-emerald-600/70 dark:text-emerald-400/70 mt-2 font-mono">
                    Último escaneo: Hace 2 min
                </p>
            </div>

        </aside>
    );
}
