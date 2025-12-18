"use client";

import { useEffect, useState, useRef } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { initialGraphData } from "@/data/mockGraph";
import { useTheme } from "next-themes";

const ForceGraph = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
    const [isMounted, setIsMounted] = useState(false);

    // Detectar tema oscuro/claro (opcional, por ahora forzamos colores neutros)
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    useEffect(() => {
        setIsMounted(true);

        // Función para ajustar el gráfico al tamaño de la pantalla
        const updateDimensions = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.offsetWidth,
                    height: containerRef.current.offsetHeight
                });
            }
        };

        window.addEventListener("resize", updateDimensions);
        // Pequeño delay para asegurar que el contenedor ya tiene tamaño
        setTimeout(updateDimensions, 100);

        return () => window.removeEventListener("resize", updateDimensions);
    }, []);

    if (!isMounted) return null;

    return (
        <div ref={containerRef} className="w-full h-full flex items-center justify-center cursor-move">
            <ForceGraph2D
                width={dimensions.width}
                height={dimensions.height}
                graphData={initialGraphData}

                // --- Estilo de Nodos ---
                nodeLabel="name"
                nodeColor={(node: any) => node.color}
                nodeRelSize={6}

                // --- Estilo de Enlaces ---
                linkColor={() => isDark ? "#52525b" : "#e4e4e7"} // Ajuste sutil de color
                linkWidth={1.5}
                linkDirectionalParticles={2}
                linkDirectionalParticleSpeed={0.005}

                // Fondo transparente
                backgroundColor="rgba(0,0,0,0)"

                // Configuración de física (opcional, para que no bailen tanto)
                d3VelocityDecay={0.1}
            />
        </div>
    );
};

export default ForceGraph;