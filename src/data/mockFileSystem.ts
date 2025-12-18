import { FileSystemItem } from "@/types/fileSystem";

export const initialFileSystem: FileSystemItem[] = [
    {
        id: "root-1",
        name: "Universidad",
        type: "folder",
        parentId: null,
        isOpen: true,
        children: [
            {
                id: "sem-1",
                name: "Semestre 1",
                type: "folder",
                parentId: "root-1",
                isOpen: false,
                children: [
                    { id: "note-1", name: "Apuntes de Matemáticas", type: "note", parentId: "sem-1" },
                    { id: "note-2", name: "Física Básica", type: "note", parentId: "sem-1" },
                ]
            },
            {
                id: "sem-2",
                name: "Semestre 2",
                type: "folder",
                parentId: "root-1",
                isOpen: true, // Probemos una carpeta abierta por defecto
                children: [
                    {
                        id: "progra",
                        name: "Programación II",
                        type: "folder",
                        parentId: "sem-2",
                        children: [
                            { id: "note-3", name: "Proyecto Final (Java)", type: "note", parentId: "progra" }
                        ]
                    },
                ]
            }
        ]
    },
    {
        id: "root-2",
        name: "Ideas Startup",
        type: "folder",
        parentId: null,
        isOpen: false,
        children: [
            { id: "note-4", name: "Business Plan", type: "note", parentId: "root-2" }
        ]
    },
    {
        id: "note-root",
        name: "Lista de Compras",
        type: "note",
        parentId: null
    }
];