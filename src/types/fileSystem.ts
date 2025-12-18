export type FileType = 'note' | 'folder';

export interface FileSystemItem {
    id: string;
    name: string;
    type: FileType;
    parentId: string | null;
    children?: FileSystemItem[]; // Aquí está la magia recursiva
    isOpen?: boolean; // Solo para carpetas: ¿está expandida?
}