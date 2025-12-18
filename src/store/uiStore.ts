import { create } from 'zustand';

type ViewType = 'GRAPH' | 'NOTES' | 'TODO';

interface UIState {
    currentView: ViewType;
    activeNoteId: string | null; // <--- NUEVO: Guardamos el ID de la nota activa
    setView: (view: ViewType) => void;
    setActiveNote: (id: string) => void; // <--- NUEVO: Acción para cambiar de nota
}

export const useUIStore = create<UIState>((set) => ({
    currentView: 'GRAPH',
    activeNoteId: null,
    setView: (view) => set({ currentView: view }),
    setActiveNote: (id) => set({ activeNoteId: id, currentView: 'NOTES' }), // Al elegir nota, cambiamos la vista automáticamente
}));