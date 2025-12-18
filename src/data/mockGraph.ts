// src/data/mockGraph.ts

export const initialGraphData = {
    nodes: [
        { id: "id1", name: "Synapse (Inicio)", val: 20, color: "#a1a1aa" }, // Nodo central (Zinc-400)
        { id: "id2", name: "React 19", val: 10, color: "#3b82f6" }, // Azul
        { id: "id3", name: "Next.js 15", val: 10, color: "#000000" }, // Negro
        { id: "id4", name: "Ciberseguridad", val: 15, color: "#ef4444" }, // Rojo
        { id: "id5", name: "Vuln. RCE", val: 5, color: "#f87171" }, // Rojo claro
        { id: "id6", name: "Tailwind CSS", val: 8, color: "#0ea5e9" }, // Celeste
        { id: "id7", name: "Diseño UI/UX", val: 12, color: "#a855f7" }, // Morado
        { id: "id8", name: "Zustand", val: 7, color: "#f59e0b" }, // Amarillo
    ],
    links: [
        { source: "id1", target: "id2" },
        { source: "id1", target: "id3" },
        { source: "id1", target: "id7" },
        { source: "id2", target: "id3" },
        { source: "id3", target: "id4" },
        { source: "id4", target: "id5" },
        { source: "id7", target: "id6" },
        { source: "id2", target: "id8" },
    ]
};
