import { FileText } from "lucide-react";

export default function NotesView() {
    return (
        <div className="flex flex-col items-center justify-center h-full text-zinc-400">
            <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-full mb-4">
                <FileText size={48} className="text-zinc-500" />
            </div>
            <h2 className="text-xl font-semibold text-zinc-700 dark:text-zinc-200">Panel de Notas</h2>
            <p>Aquí irá el editor de texto enriquecido y el sistema de carpetas.</p>
        </div>
    );
}