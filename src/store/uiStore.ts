import { create } from 'zustand';

// Quitamos 'HOME', volvemos a lo esencial
type ViewType = 'GRAPH' | 'NOTES' | 'TODO';

interface UIState {
    currentView: ViewType;
    activeNoteId: string | null;

    // Estados para el Modal de Creación
    isCreationOpen: boolean;
    creationParentId: string | null;

    // NUEVO: Estado de la sesión (Simulado)
    isGuest: boolean;

    setView: (view: ViewType) => void;
    setActiveNote: (id: string) => void;
    openCreationMode: (parentId: string | null) => void;
    closeCreationMode: () => void;
    toggleGuestMode: () => void; // Para cambiar entre Invitado/Cuenta
}

export const useUIStore = create<UIState>((set) => ({
    currentView: 'GRAPH', // <--- Volvemos al Gráfico por defecto
    activeNoteId: null,
    isCreationOpen: false,
    creationParentId: null,
    isGuest: true, // Empezamos como Invitado

    setView: (view) => set({ currentView: view }),
    setActiveNote: (id) => set({ activeNoteId: id, currentView: 'NOTES' }),
    openCreationMode: (parentId) => set({ isCreationOpen: true, creationParentId: parentId }),
    closeCreationMode: () => set({ isCreationOpen: false, creationParentId: null }),
    toggleGuestMode: () => set((state) => ({ isGuest: !state.isGuest })),
}));