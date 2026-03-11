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
    const DEFAULT_MIN_DISTANCE = 20;


    const [placedCircles, setPlacedCircles] = useState<PlacedCircle[]>([]);
    const [hasGenerated, setHasGenerated] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [appliedWidth, setAppliedWidth] = useState(canvasWidth);
    const [appliedHeight, setAppliedHeight] = useState(canvasHeight);

    // Only generate pattern when explicitly requested
    const generatePattern = () => {
        setError(null);
        
        const MIN_WIDTH = 50;
        const MIN_HEIGHT = 50;
        const availableWidth = canvasWidth - (EDGE_MARGIN * 2);
        const availableHeight = canvasHeight - (EDGE_MARGIN * 2);

        if (canvasWidth < MIN_WIDTH || canvasHeight < MIN_HEIGHT) {
            setError(`Canvas size is too small. Minimum size is ${MIN_WIDTH}x${MIN_HEIGHT}px.`);
            setPlacedCircles([]);
            onPlacedCirclesChange?.([], canvasWidth, canvasHeight);
            return;
        }

        // Determine dynamic minimum distance based on requested circles
        // We use the smallest diameter among active circle types, capped at the default 20px
        const activeCircles = circles.filter(c => c.count > 0);
        const minDiameter = activeCircles.length > 0 
            ? Math.min(...activeCircles.map(c => c.diameter))
            : DEFAULT_MIN_DISTANCE;
        
        const effectiveMinDistance = Math.min(DEFAULT_MIN_DISTANCE, minDiameter);

        // Check for circles that are physically too large
        const tooLargeCircle = circles.find(c => c.count > 0 && (c.diameter > availableWidth || c.diameter > availableHeight));
        if (tooLargeCircle) {
            setError(`Circle type #${tooLargeCircle.index} is too large (${tooLargeCircle.diameter}px) to fit in the available canvas area (${availableWidth}x${availableHeight}px).`);
            setPlacedCircles([]);
            onPlacedCirclesChange?.([], canvasWidth, canvasHeight);
            return;
        }

        // Density check: Sum of circle areas + buffer for distance
        const totalRequested = circles.reduce((sum, c) => sum + c.count, 0);
        
        const totalAreaNeeded = circles.reduce((sum, c) => {
            // Base area of the circle (as a square for conservative placement)
            const circleArea = c.diameter * c.diameter;
            
            // Add buffer for the distance between circles, but only if we have multiple circles
            // This buffer is simplified: it accounts for the extra space needed to avoid overlaps
            const distanceBuffer = totalRequested > 1 ? (effectiveMinDistance * c.diameter * 2) + (effectiveMinDistance * effectiveMinDistance) : 0;
            
            return sum + (circleArea + distanceBuffer) * c.count;
        }, 0);
        
        const totalAvailableArea = availableWidth * availableHeight;
        
        // If the area needed is significantly more than available, block it
        // We use a factor of 1.2 to allow for some inefficiency in random placement
        if (totalAreaNeeded > totalAvailableArea * 1.2 && totalRequested > 0) {
            setError("The requested number/size of circles is too high for this canvas. Try a larger canvas or fewer circles.");
            setPlacedCircles([]);
            onPlacedCirclesChange?.([], canvasWidth, canvasHeight);
            return;
        }

        setAppliedWidth(canvasWidth);
        setAppliedHeight(canvasHeight);

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
            effectiveMinDistance
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
                <div className="border-2 rounded-lg overflow-hidden bg-white shadow-inner relative group">
                    <svg
                        width={appliedWidth}
                        height={appliedHeight}
                        className="w-full h-auto block"
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
                    </svg>

                    {/* Centered Overlay Messages (CSS-based to keep size consistent) */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-4 text-center">
                        {placedCircles.length === 0 && circles.length > 0 && !error && (
                            <span className="text-sm text-muted-foreground animate-pulse">
                                Generating pattern...
                            </span>
                        )}

                        {error && (
                            <span className="text-sm text-red-500 font-medium bg-white/80 px-2 py-1 rounded shadow-sm">
                                {error}
                            </span>
                        )}

                        {circles.length === 0 && (
                            <span className="text-sm text-muted-foreground">
                                Add circle parameters to generate pattern
                            </span>
                        )}
                    </div>
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
                    <div className="text-xs text-amber-700 bg-amber-50 p-3 rounded-md border border-amber-200">
                        ℹ️ High density reached: {totalPlaced} of {totalRequested} circles placed. 
                        The pattern may appear crowded; consider a larger canvas or smaller parameters for a more balanced layout.
                    </div>
                )}

                {totalPlaced === totalRequested && totalPlaced > 0 && (
                    <div className="text-xs text-green-700 bg-green-50 p-3 rounded-md border border-green-200">
                        ✅ Pattern generated successfully: {totalPlaced} circles placed.
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