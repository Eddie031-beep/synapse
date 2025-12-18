import { create } from 'zustand';

// Definimos los tipos de vista posibles
type ViewType = 'GRAPH' | 'NOTES' | 'TODO';

interface UIState {
    currentView: ViewType;
    setView: (view: ViewType) => void;
}

export const useUIStore = create<UIState>((set) => ({
    currentView: 'GRAPH', // La vista inicial será el Cerebro
    setView: (view) => set({ currentView: view }),
}));