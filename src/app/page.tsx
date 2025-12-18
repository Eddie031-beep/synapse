"use client";

import dynamic from "next/dynamic";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { useUIStore } from "@/store/uiStore"; // Importar el store

// Importar los componentes estáticos
import NotesView from "@/components/features/notes/NotesView";
import TodoBoard from "@/components/features/todo/TodoBoard";

// Importación dinámica del Gráfico (para evitar error SSR)
const NeuralGraph = dynamic(
  () => import("@/components/features/graph/ForceGraph"),
  { ssr: false }
);

export default function Home() {
  // Leemos qué vista está activa
  const { currentView } = useUIStore();

  return (
    <div className="flex h-screen bg-white dark:bg-black overflow-hidden">

      <AppSidebar />

      <main className="flex-1 relative flex flex-col h-full overflow-hidden bg-zinc-50/50 dark:bg-zinc-900/50">

        {/* Renderizado Condicional: "Si es X, muestra Y" */}

        {currentView === 'GRAPH' && (
          <>
            {/* Header flotante solo para el gráfico */}
            <header className="absolute top-0 left-0 right-0 p-6 z-10 pointer-events-none">
              <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 pointer-events-auto inline-block">
                Vista Neuronal
              </h2>
            </header>
            <div className="flex-1 w-full h-full">
              <NeuralGraph />
            </div>
          </>
        )}

        {currentView === 'NOTES' && <NotesView />}

        {currentView === 'TODO' && <TodoBoard />}

      </main>
    </div>
  );
}