import { BoardData } from "@/types/kanban";

export const initialBoardData: BoardData = {
    tasks: {
        'task-1': { id: 'task-1', content: 'Configurar Next.js 15' },
        'task-2': { id: 'task-2', content: 'Diseñar el Sidebar en Figma' },
        'task-3': { id: 'task-3', content: 'Implementar Drag & Drop' },
        'task-4': { id: 'task-4', content: 'Arreglar bug de Z-Index' },
        'task-5': { id: 'task-5', content: 'Comprar teclado mecánico' },
    },
    columns: {
        'col-1': {
            id: 'col-1',
            title: 'Pendientes',
            taskIds: ['task-1', 'task-2', 'task-5'],
        },
        'col-2': {
            id: 'col-2',
            title: 'En Progreso',
            taskIds: ['task-3'],
        },
        'col-3': {
            id: 'col-3',
            title: 'Terminado',
            taskIds: ['task-4'],
        },
    },
    columnOrder: ['col-1', 'col-2', 'col-3'],
};