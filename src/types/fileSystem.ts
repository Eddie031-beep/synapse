export type FileType = 'note' | 'folder' | 'binary' | 'malware';
export type SecurityStatus = 'safe' | 'scanning' | 'danger' | 'unknown';

export interface FileSystemItem {
    id: string;
    name: string;
    type: FileType;
    parentId: string | null;
    children?: FileSystemItem[];
    isOpen?: boolean;

    // --- NUEVO: Propiedades de Seguridad ---
    status?: SecurityStatus;
    size?: string; // Ej: "1.2 MB"
}