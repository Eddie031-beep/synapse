"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { useTheme } from "next-themes";
import { useFileStore } from "@/store/fileStore";
import { FileSystemItem } from "@/types/fileSystem";
import { ShieldCheck, ShieldAlert, ScanLine } from "lucide-react";
import * as d3 from 'd3';

// Paletas de colores
const COLORS = {
    dark: {
        background: "#09090b", // zinc-950
        folder: "#71717a", // zinc-500
        file: "#3b82f6", // blue-500
        binary: "#a855f7", // purple-500 (para exes, etc)
        danger: "#ef4444", // red-500
        scanning: "#eab308", // yellow-500
        link: "#27272a", // zinc-800
        text: "#fafafa" // zinc-50
    },
    light: {
        background: "#fafafa", // zinc-50
        folder: "#a1a1aa", // zinc-400
        file: "#60a5fa", // blue-400
        binary: "#c084fc", // purple-400
        danger: "#f87171", // red-400
        scanning: "#facc15", // yellow-400
        link: "#e4e4e7", // zinc-200 (muy sutil)
        text: "#18181b" // zinc-900
    }
};

// Función transformadora
const generateGraphFromTree = (items: FileSystemItem[], isDark: boolean) => {
    const nodes: any[] = [];
    const links: any[] = [];
    const theme = isDark ? COLORS.dark : COLORS.light;

    const getColor = (item: FileSystemItem) => {
        if (item.status === 'danger') return theme.danger;
        if (item.status === 'scanning') return theme.scanning;
        if (item.type === 'folder') return theme.folder;
        if (item.type === 'binary') return theme.binary;
        return theme.file;
    };

    const traverse = (itemList: FileSystemItem[], parentId: string | null = null) => {
        itemList.forEach(item => {
            nodes.push({
                id: item.id,
                name: item.name,
                type: item.type,
                val: item.type === 'folder' ? 12 : 6,
                color: getColor(item)
            });
            if (parentId) links.push({ source: parentId, target: item.id });
            if (item.children) traverse(item.children, item.id);
        });
    };

    // Nodo Raíz Invisible para centrar
    nodes.push({ id: 'root', name: 'SYSTEM', val: 1, color: 'transparent', type: 'root' });
    items.forEach(item => links.push({ source: 'root', target: item.id }));

    return { nodes, links };
};

const ForceGraph = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const graphRef = useRef<any>();
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
    const { fileSystem, isScanning, startSecurityScan } = useFileStore();
    const { theme: currentTheme } = useTheme();
    const isDark = currentTheme === 'dark';
    const themeColors = isDark ? COLORS.dark : COLORS.light;

    const graphData = useMemo(() => generateGraphFromTree(fileSystem, isDark), [fileSystem, isScanning, isDark]);
    const threats = graphData.nodes.filter(n => n.color === themeColors.danger).length;

    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                setDimensions({ width: containerRef.current.offsetWidth, height: containerRef.current.offsetHeight });
            }
        };
        window.addEventListener("resize", updateDimensions);
        updateDimensions();
        return () => window.removeEventListener("resize", updateDimensions);
    }, []);

    // AJUSTE DE FÍSICAS
    useEffect(() => {
        if (graphRef.current) {
            graphRef.current.d3Force('charge').strength(-300);
            graphRef.current.d3Force('link').distance(70);
            graphRef.current.d3Force('center', d3.forceCenter(0, 0).strength(0.05));
            graphRef.current.d3ReheatSimulation();
        }
    }, [graphRef, graphData]);

    return (
        <div ref={containerRef} className="w-full h-full relative transition-colors duration-300" style={{ backgroundColor: themeColors.background }}>

            {/* HUD DE SEGURIDAD */}
            <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2 pointer-events-none">
                <div className={`backdrop-blur-md border p-4 rounded-xl text-right pointer-events-auto transition-colors duration-300 ${isDark ? 'bg-black/60 border-zinc-800/50' : 'bg-white/80 border-zinc-200/50 shadow-sm'}`}>
                    <div className="flex items-center gap-2 justify-end mb-1">
                        <span className={`text-xs uppercase tracking-wider font-bold ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Estado del Sistema</span>
                        {isScanning ? <ScanLine className="text-yellow-500 animate-pulse" size={16} /> : threats > 0 ? <ShieldAlert className="text-red-500" size={16} /> : <ShieldCheck className="text-emerald-500" size={16} />}
                    </div>

                    <div className={`text-2xl font-mono font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                        {isScanning ? "ANALIZANDO..." : threats > 0 ? `${threats} AMENAZAS` : "SEGURO"}
                    </div>

                    <div className={`text-xs mt-1 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                        {graphData.nodes.length - 1} Archivos en estructura
                    </div>

                    <button
                        onClick={startSecurityScan}
                        disabled={isScanning}
                        className={`mt-3 w-full py-2 px-3 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-2 ${isScanning
                                ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 cursor-wait"
                                : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md hover:shadow-lg"
                            }`}
                    >
                        {isScanning ? <>Escaneando <ScanLine size={12} className="animate-spin" /></> : <>Iniciar Escaneo de Red <ShieldCheck size={12} /></>}
                    </button>
                </div>
            </div>

            <ForceGraph2D
                ref={graphRef}
                width={dimensions.width}
                height={dimensions.height}
                graphData={graphData}
                nodeLabel="name"
                nodeColor={(node: any) => node.color}
                nodeRelSize={5}
                nodeCanvasObjectMode={() => 'after'}
                nodeCanvasObject={(node: any, ctx, globalScale) => {
                    if (globalScale < 2.5 || node.type === 'root') return;
                    const label = node.name;
                    const fontSize = 12 / globalScale;
                    ctx.font = `${fontSize}px Sans-Serif`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'top';
                    ctx.fillStyle = themeColors.text;
                    ctx.fillText(label, node.x, node.y + node.val + 2);
                }}
                linkColor={() => isScanning ? themeColors.scanning : themeColors.link}
                linkWidth={isScanning ? 1.5 : 1}
                linkDirectionalParticles={isScanning ? 3 : 0}
                linkDirectionalParticleSpeed={0.005}
                backgroundColor="rgba(0,0,0,0)"
                d3VelocityDecay={0.4}
            />
        </div>
    );
};

export default ForceGraph;