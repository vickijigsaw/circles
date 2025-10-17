"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useMemo, useState, useEffect } from "react";
import { generateCirclePattern } from "@/components/utils/patternGenerator";
import { PlacedCircle } from "@/components/utils/circleUtils";

interface Circle {
    diameter: number;
    count: number;
    color: string;
    index: number;
}

interface CircleGeneratorProps {
    canvasWidth: number;
    canvasHeight: number;
    circles: Circle[];
    onPlacedCirclesChange?: (placedCircles: PlacedCircle[]) => void;
}

export default function CircleGenerator({
    canvasWidth,
    canvasHeight,
    circles,
    onPlacedCirclesChange,
}: CircleGeneratorProps) {
    const EDGE_MARGIN = 20;
    const MIN_DISTANCE = 20;

    const [placedCircles, setPlacedCircles] = useState<PlacedCircle[]>([]);
    const [hasGenerated, setHasGenerated] = useState(false);

    // Only generate pattern when explicitly requested
    const generatePattern = () => {
        if (!canvasWidth || !canvasHeight || circles.length === 0) {
            setPlacedCircles([]);
            onPlacedCirclesChange?.([]);
            return;
        }

        const result = generateCirclePattern(canvasWidth, canvasHeight, circles, EDGE_MARGIN, MIN_DISTANCE);
        setPlacedCircles(result);
        setHasGenerated(true);

        // Notify parent component of the placed circles
        onPlacedCirclesChange?.(result);
    };

    // Generate initial pattern when component mounts or when circles array changes from empty to having items
    useEffect(() => {
        if (circles.length > 0 && !hasGenerated) {
            generatePattern();
        } else if (circles.length === 0) {
            setPlacedCircles([]);
            setHasGenerated(false);
            onPlacedCirclesChange?.([]);
        }
    }, [circles.length > 0]);

    const totalRequested = circles.reduce((sum, c) => sum + c.count, 0);
    const totalPlaced = placedCircles.length;

    return (
        <Card className="w-full">
            <CardContent className="p-6 space-y-4">
                {/* Canvas */}
                <div className="border-2 rounded-lg overflow-hidden bg-white shadow-inner">
                    <svg
                        width={canvasWidth}
                        height={canvasHeight}
                        className="w-full h-auto"
                        viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
                    >
                        {/* Background */}
                        <rect width={canvasWidth} height={canvasHeight} fill="#fff" />

                        {/* Margin guide */}
                        <rect
                            x={EDGE_MARGIN}
                            y={EDGE_MARGIN}
                            width={canvasWidth - 2 * EDGE_MARGIN}
                            height={canvasHeight - 2 * EDGE_MARGIN}
                            fill="none"
                            stroke="#e0e0e0"
                            strokeWidth="1"
                            strokeDasharray="5,5"
                            opacity="0.3"
                        />

                        {/* Circles */}
                        {placedCircles.map((circle, idx) => (
                            <circle
                                key={idx}
                                cx={circle.x}
                                cy={circle.y}
                                r={circle.radius}
                                fill={circle.color}
                                stroke={circle.color}
                                strokeWidth="2"
                            />
                        ))}

                        {/* No circles message */}
                        {placedCircles.length === 0 && circles.length > 0 && (
                            <text
                                x={canvasWidth / 2}
                                y={canvasHeight / 2}
                                textAnchor="middle"
                                fill="#999"
                                fontSize="16"
                            >
                                Generating pattern...
                            </text>
                        )}

                        {/* No parameters message */}
                        {circles.length === 0 && (
                            <text
                                x={canvasWidth / 2}
                                y={canvasHeight / 2}
                                textAnchor="middle"
                                fill="#999"
                                fontSize="16"
                            >
                                Add circle parameters to generate pattern
                            </text>
                        )}
                    </svg>
                </div>

                {/* Info & Controls */}
                <div className="flex items-center justify-between pt-2">
                    <div className="text-sm text-muted-foreground space-y-1">
                        <p>Canvas: {canvasWidth} × {canvasHeight}px</p>
                        <p>Circles placed: {totalPlaced} / {totalRequested}</p>
                        <p>Circle types: {circles.length}</p>
                    </div>

                    <button
                        onClick={generatePattern}
                        disabled={circles.length === 0}
                        className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        🔄 {hasGenerated ? 'Regenerate' : 'Generate Pattern'}
                    </button>
                </div>

                {/* Status messages */}
                {totalRequested > 0 && totalPlaced < totalRequested && (
                    <div className="text-xs text-amber-600 bg-amber-50 p-3 rounded-md border border-amber-200">
                        ⚠️ Only {totalPlaced} of {totalRequested} circles could fit. Try smaller circles,
                        fewer circles, a larger canvas, or click Regenerate.
                    </div>
                )}

                {totalPlaced === totalRequested && totalPlaced > 0 && (
                    <div className="text-xs text-green-600 bg-green-50 p-3 rounded-md border border-green-200">
                        ✅ All circles placed successfully!
                    </div>
                )}
            </CardContent>
        </Card>
    );
}