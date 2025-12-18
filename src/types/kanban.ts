export type TaskId = string;
export type ColumnId = string;

export interface Task {
    id: TaskId;
    content: string;
}

export interface Column {
    id: ColumnId;
    title: string;
    taskIds: TaskId[];
}

export interface BoardData {
    tasks: Record<TaskId, Task>;
    columns: Record<ColumnId, Column>;
    columnOrder: ColumnId[];
}