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
    onPlacedCirclesChange?: (placedCircles: PlacedCircle[], width: number, height: number) => void;
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
    const [error, setError] = useState<string | null>(null);
    const [appliedWidth, setAppliedWidth] = useState(canvasWidth);
    const [appliedHeight, setAppliedHeight] = useState(canvasHeight);

    // Only generate pattern when explicitly requested
    const generatePattern = () => {
        setError(null);
        setAppliedWidth(canvasWidth);
        setAppliedHeight(canvasHeight);
        
        const totalRequested = circles.reduce((sum, c) => sum + c.count, 0);

        if (!canvasWidth || !canvasHeight || circles.length === 0) {
            setPlacedCircles([]);
            onPlacedCirclesChange?.([], canvasWidth, canvasHeight);
            return;
        }

        if (totalRequested === 0) {
            setPlacedCircles([]);
            setError("Please set a quantity greater than 0 for at least one circle type.");
            setHasGenerated(true); // Still set this so we show the "Regenerate" button style if they had something before
            onPlacedCirclesChange?.([], canvasWidth, canvasHeight);
            return;
        }

        // Generate raw circles from your utility
        const result: PlacedCircle[] = generateCirclePattern(
            canvasWidth,
            canvasHeight,
            circles,
            EDGE_MARGIN,
            MIN_DISTANCE
        );

        // Normalize them to include diameter + color
        const normalized: PlacedCircle[] = result.map((c, i) => ({
            ...c,
            diameter: c.diameter || c.radius * 2,
            color: c.color || circles[i % circles.length]?.color || "#000",
        }));

        // Store and notify
        setPlacedCircles(normalized);
        setHasGenerated(true);
        onPlacedCirclesChange?.(normalized, canvasWidth, canvasHeight);
    };

    // Generate initial pattern when component mounts or when circles array changes from empty to having items
    useEffect(() => {
        if (circles.length > 0 && !hasGenerated) {
            const totalRequested = circles.reduce((sum, c) => sum + c.count, 0);
            if (totalRequested > 0) {
                generatePattern();
            }
        } else if (circles.length === 0) {
            setPlacedCircles([]);
            setHasGenerated(false);
            setError(null);
            onPlacedCirclesChange?.([], canvasWidth, canvasHeight);
            // Sync dimensions when no pattern exists
            setAppliedWidth(canvasWidth);
            setAppliedHeight(canvasHeight);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [circles, canvasWidth, canvasHeight]);

    const totalRequested = circles.reduce((sum, c) => sum + c.count, 0);
    const totalPlaced = placedCircles.length;

    return (
        <Card className="w-full">
            <CardContent className="p-6 space-y-4">
                {/* Canvas */}
                <div className="border-2 rounded-lg overflow-hidden bg-white shadow-inner">
                    <svg
                        width={appliedWidth}
                        height={appliedHeight}
                        className="w-full h-auto"
                        viewBox={`0 0 ${appliedWidth} ${appliedHeight}`}
                    >
                        {/* Background */}
                        <rect width={appliedWidth} height={appliedHeight} fill="#fff" />

                        {/* Margin guide */}
                        <rect
                            x={EDGE_MARGIN}
                            y={EDGE_MARGIN}
                            width={appliedWidth - 2 * EDGE_MARGIN}
                            height={appliedHeight - 2 * EDGE_MARGIN}
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
                                r={circle.diameter ? circle.diameter / 2 : circle.radius}
                                fill={circle.color}
                                stroke={circle.color}
                                strokeWidth="2"
                            />
                        ))}

                        {/* No circles message */}
                        {placedCircles.length === 0 && circles.length > 0 && !error && (
                            <text
                                x={appliedWidth / 2}
                                y={appliedHeight / 2}
                                textAnchor="middle"
                                fill="#999"
                                fontSize="16"
                            >
                                Generating pattern...
                            </text>
                        )}

                        {/* Error message in SVG */}
                        {error && (
                            <text
                                x={appliedWidth / 2}
                                y={appliedHeight / 2}
                                textAnchor="middle"
                                fill="#ef4444"
                                fontSize="16"
                                className="font-medium"
                            >
                                {error}
                            </text>
                        )}

                        {/* No parameters message */}
                        {circles.length === 0 && (
                            <text
                                x={appliedWidth / 2}
                                y={appliedHeight / 2}
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
                        <p>Canvas: {appliedWidth} × {appliedHeight}px</p>
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

                {error && (
                    <div className="text-xs text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
                        ❌ {error}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}