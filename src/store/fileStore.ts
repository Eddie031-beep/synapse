import { create } from 'zustand';
import { FileSystemItem, SecurityStatus, FileType } from '@/types/fileSystem';
import { initialFileSystem } from '@/data/mockFileSystem';
import { v4 as uuidv4 } from 'uuid';

interface FileState {
    fileSystem: FileSystemItem[];
    trash: FileSystemItem[];
    isScanning: boolean;

    addFolder: (parentId: string | null, name: string) => void;
    addNote: (parentId: string | null, name: string) => string;
    moveToTrash: (id: string) => void;
    restoreFromTrash: (id: string) => void;
    deletePermanently: (id: string) => void;
    moveItem: (itemId: string, newParentId: string | null) => void;
    startSecurityScan: () => void;
    uploadFile: (file: File) => void; // NUEVA ACCIÓN
}

// Auxiliar para eliminar del árbol
const removeItemFromTree = (items: FileSystemItem[], id: string): { remaining: FileSystemItem[], removed: FileSystemItem | null } => {
    let removedItem: FileSystemItem | null = null;
    const filterRecursive = (currentItems: FileSystemItem[]): FileSystemItem[] => {
        return currentItems.filter(item => {
            if (item.id === id) {
                removedItem = item;
                return false;
            }
            if (item.children) {
                item.children = filterRecursive(item.children);
            }
            return true;
        });
    };
    const remaining = filterRecursive(items);
    return { remaining, removed: removedItem };
};

// Auxiliar para añadir al árbol
const addItemToTree = (items: FileSystemItem[], parentId: string | null, newItem: FileSystemItem): FileSystemItem[] => {
    if (parentId === null) return [...items, newItem];
    return items.map((item) => {
        if (item.id === parentId) {
            return { ...item, children: [...(item.children || []), newItem], isOpen: true };
        }
        if (item.children) {
            return { ...item, children: addItemToTree(item.children, parentId, newItem) };
        }
        return item;
    });
};

// Helper para recorrer y actualizar estado
const traverseAndUpdateStatus = (items: FileSystemItem[], status: SecurityStatus, randomInfection = false): FileSystemItem[] => {
    return items.map(item => ({
        ...item,
        // Si activamos infección random, hay un 10% de probabilidad de que sea 'danger'
        status: randomInfection && Math.random() > 0.9 ? 'danger' : status,
        children: item.children ? traverseAndUpdateStatus(item.children, status, randomInfection) : undefined
    }));
};

// Helper simple para adivinar tipo basado en extensión
const getFileType = (fileName: string): FileType => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (['exe', 'dll', 'bat', 'sh'].includes(ext || '')) return 'binary';
    if (['zip', 'rar', '7z'].includes(ext || '')) return 'folder';
    return 'note';
};

// Helper para formatear tamaño
const formatSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    const k = 1024;
    const sizes = ['KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const useFileStore = create<FileState>((set) => ({
    fileSystem: initialFileSystem as FileSystemItem[],
    trash: [],
    isScanning: false,

    addFolder: (parentId, name) => set((state) => ({
        fileSystem: addItemToTree(state.fileSystem, parentId, {
            id: uuidv4(),
            name,
            type: 'folder',
            parentId,
            children: [],
            isOpen: true
        })
    })),

    addNote: (parentId, name) => {
        const newId = uuidv4();
        set((state) => ({
            fileSystem: addItemToTree(state.fileSystem, parentId, {
                id: newId,
                name,
                type: 'note',
                parentId
            })
        }));
        return newId;
    },

    moveToTrash: (id) => set((state) => {
        const { remaining, removed } = removeItemFromTree(state.fileSystem, id);
        if (!removed) return state;
        return {
            fileSystem: remaining,
            trash: [removed, ...state.trash]
        };
    }),

    restoreFromTrash: (id) => set((state) => {
        const item = state.trash.find(i => i.id === id);
        if (!item) return state;
        return {
            trash: state.trash.filter(i => i.id !== id),
            fileSystem: addItemToTree(state.fileSystem, item.parentId, item)
        };
    }),

    deletePermanently: (id) => set((state) => ({
        trash: state.trash.filter(i => i.id !== id)
    })),

    moveItem: (itemId, newParentId) => set((state) => {
        const { remaining, removed } = removeItemFromTree(state.fileSystem, itemId);
        if (!removed) return state;
        const updated = { ...removed, parentId: newParentId };
        return {
            fileSystem: addItemToTree(remaining, newParentId, updated)
        };
    }),

    startSecurityScan: () => {
        set({ isScanning: true });
        set(state => ({
            fileSystem: traverseAndUpdateStatus(state.fileSystem, 'scanning')
        }));
        setTimeout(() => {
            set(state => ({
                isScanning: false,
                fileSystem: traverseAndUpdateStatus(state.fileSystem, 'safe', true)
            }));
        }, 3000);
    },

    uploadFile: (file: File) => {
        const newFileItem: FileSystemItem = {
            id: uuidv4(),
            name: file.name,
            type: getFileType(file.name),
            parentId: null,
            status: 'unknown',
            size: formatSize(file.size)
        };

        set((state) => ({
            fileSystem: [...state.fileSystem, newFileItem]
        }));
    }
}));