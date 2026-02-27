"use client";

import dynamic from "next/dynamic";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { RightSidebar } from "@/components/layout/RightSidebar"; // <--- Importamos la nueva barra derecha
import { useUIStore } from "@/store/uiStore";

import NotesView from "@/components/features/notes/NotesView";
import TodoBoard from "@/components/features/todo/TodoBoard";

// Importar el gráfico sin SSR
const NeuralGraph = dynamic(
  () => import("@/components/features/graph/ForceGraph"),
  { ssr: false }
);

export default function Home() {
  const { currentView } = useUIStore();

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-black overflow-hidden font-sans">

      {/* 1. IZQUIERDA */}
      <AppSidebar />

      {/* 2. CENTRO (Contenido Flexible) */}
      <main className="flex-1 relative flex flex-col h-full overflow-hidden bg-white dark:bg-zinc-950/50 rounded-tl-3xl rounded-bl-3xl shadow-2xl z-10 border-l border-zinc-200 dark:border-zinc-800 my-2 ml-[-10px] mr-2 lg:mr-0 lg:ml-0 lg:my-0 lg:rounded-none lg:shadow-none lg:border-none">

        {currentView === 'GRAPH' && (
          <div className="flex-1 w-full h-full relative">
            <div className="absolute top-6 left-8 z-10 pointer-events-none">
              <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Vista Neuronal</h2>
              <p className="text-zinc-500">Mapa de integridad del sistema</p>
            </div>
            <NeuralGraph />
          </div>
        )}

        {currentView === 'NOTES' && <NotesView />}
        {currentView === 'TODO' && <TodoBoard />}

      </main>

      {/* 3. DERECHA */}
      <RightSidebar />

    </div>
  );
}