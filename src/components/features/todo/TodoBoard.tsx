"use client";

import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { GripVertical, Plus } from "lucide-react";
import { initialBoardData } from "@/data/mockKanban";
import { BoardData } from "@/types/kanban";

export default function TodoBoard() {
    const [data, setData] = useState<BoardData>(initialBoardData);

    // Función que se ejecuta cuando sueltas una tarjeta
    const onDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result;

        // Si no se soltó en un destino válido, no hacer nada
        if (!destination) return;

        // Si se soltó en el mismo lugar, no hacer nada
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const startColumn = data.columns[source.droppableId];
        const finishColumn = data.columns[destination.droppableId];

        // CASO 1: Movimiento dentro de la misma columna
        if (startColumn === finishColumn) {
            const newTaskIds = Array.from(startColumn.taskIds);
            newTaskIds.splice(source.index, 1); // Sacar de la posición vieja
            newTaskIds.splice(destination.index, 0, draggableId); // Meter en la nueva

            const newColumn = { ...startColumn, taskIds: newTaskIds };

            setData((prev) => ({
                ...prev,
                columns: { ...prev.columns, [newColumn.id]: newColumn },
            }));
            return;
        }

        // CASO 2: Movimiento de una columna a otra
        const startTaskIds = Array.from(startColumn.taskIds);
        startTaskIds.splice(source.index, 1);
        const newStart = { ...startColumn, taskIds: startTaskIds };

        const finishTaskIds = Array.from(finishColumn.taskIds);
        finishTaskIds.splice(destination.index, 0, draggableId);
        const newFinish = { ...finishColumn, taskIds: finishTaskIds };

        setData((prev) => ({
            ...prev,
            columns: {
                ...prev.columns,
                [newStart.id]: newStart,
                [newFinish.id]: newFinish,
            },
        }));
    };

    return (
        <div className="h-full flex flex-col">
            <header className="px-8 py-6">
                <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">Tablero de Tareas</h2>
                <p className="text-zinc-500 text-sm">Gestiona tus pendientes con estilo.</p>
            </header>

            {/* Contenedor del Drag & Drop */}
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex-1 flex gap-6 px-8 pb-8 overflow-x-auto">

                    {data.columnOrder.map((columnId) => {
                        const column = data.columns[columnId];
                        const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);

                        return (
                            <div key={column.id} className="w-80 flex-shrink-0 flex flex-col bg-zinc-100/50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800 h-full max-h-[calc(100vh-12rem)]">

                                {/* Título de la Columna */}
                                <div className="p-4 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800">
                                    <h3 className="font-semibold text-zinc-700 dark:text-zinc-200">{column.title}</h3>
                                    <span className="text-xs bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-2 py-1 rounded-full">
                                        {tasks.length}
                                    </span>
                                </div>

                                {/* Zona donde se sueltan las tareas */}
                                <Droppable droppableId={column.id}>
                                    {(provided, snapshot) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className={`flex-1 p-3 overflow-y-auto transition-colors ${snapshot.isDraggingOver ? "bg-zinc-200/50 dark:bg-zinc-800/50" : ""
                                                }`}
                                        >
                                            {tasks.map((task, index) => (
                                                <Draggable key={task.id} draggableId={task.id} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className={`bg-white dark:bg-zinc-800 p-4 mb-3 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 group hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors ${snapshot.isDragging ? "shadow-lg rotate-2 scale-105 z-50" : ""
                                                                }`}
                                                            style={provided.draggableProps.style}
                                                        >
                                                            <div className="flex items-start gap-3">
                                                                <GripVertical className="w-4 h-4 text-zinc-300 mt-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" />
                                                                <p className="text-sm text-zinc-700 dark:text-zinc-200 font-medium">
                                                                    {task.content}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}

                                            {/* Botón fantasma para añadir tarea */}
                                            <button className="w-full py-2 mt-2 flex items-center justify-center gap-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50 rounded-md transition-all text-sm dashed border border-transparent hover:border-zinc-300 dark:hover:border-zinc-600">
                                                <Plus className="w-4 h-4" /> Añadir tarea
                                            </button>
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        );
                    })}
                </div>
            </DragDropContext>
        </div>
    );
}