import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";

interface Circle {
    diameter: number;
    index: number;
}

interface CircleGeneratorProps {
    canvasWidth: number;
    canvasHeight: number;
    circles: Circle[];
}

interface PlacedCircle {
    x: number;
    y: number;
    radius: number;
    color: string;
}

export default function CircleGenerator({
    canvasWidth,
    canvasHeight,
    circles
}: CircleGeneratorProps) {
    const [placedCircles, setPlacedCircles] = useState<PlacedCircle[]>([]);
    const [regenerateKey, setRegenerateKey] = useState(0);

    // Minimum distance from canvas edges (in pixels)
    const EDGE_MARGIN = 10;

    // Minimum distance between circles (in pixels)
    const MIN_DISTANCE = 5;

    // Color palette for different circle sizes
    const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
        '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'
    ];

    // Check if two circles overlap
    const doCirclesOverlap = (
        x1: number,
        y1: number,
        r1: number,
        x2: number,
        y2: number,
        r2: number
    ): boolean => {
        const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        return distance < (r1 + r2 + MIN_DISTANCE);
    };

    // Check if circle is within canvas bounds
    const isWithinBounds = (x: number, y: number, radius: number): boolean => {
        return (
            x - radius >= EDGE_MARGIN &&
            x + radius <= canvasWidth - EDGE_MARGIN &&
            y - radius >= EDGE_MARGIN &&
            y + radius <= canvasHeight - EDGE_MARGIN
        );
    };

    // Try to place a circle randomly
    const tryPlaceCircle = (
        radius: number,
        existingCircles: PlacedCircle[],
        maxAttempts: number = 100
    ): PlacedCircle | null => {
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            // Random position within bounds
            const x = EDGE_MARGIN + radius + Math.random() * (canvasWidth - 2 * EDGE_MARGIN - 2 * radius);
            const y = EDGE_MARGIN + radius + Math.random() * (canvasHeight - 2 * EDGE_MARGIN - 2 * radius);

            // Check if within bounds
            if (!isWithinBounds(x, y, radius)) {
                continue;
            }

            // Check if overlaps with existing circles
            let overlaps = false;
            for (const existing of existingCircles) {
                if (doCirclesOverlap(x, y, radius, existing.x, existing.y, existing.radius)) {
                    overlaps = true;
                    break;
                }
            }

            if (!overlaps) {
                return { x, y, radius, color: colors[existingCircles.length % colors.length] };
            }
        }

        return null; // Could not place circle after max attempts
    };

    // Generate pattern
    const generatePattern = () => {
        const placed: PlacedCircle[] = [];

        // Sort circles by diameter (largest first) for better packing
        const sortedCircles = [...circles].sort((a, b) => b.diameter - a.diameter);

        // Try to place each circle size multiple times
        for (const circleType of sortedCircles) {
            const radius = circleType.diameter / 2;
            const color = colors[(circleType.index - 1) % colors.length];

            // Try to place multiple circles of this size
            // Number of attempts depends on canvas size and circle size
            const maxCircles = Math.floor((canvasWidth * canvasHeight) / (circleType.diameter * circleType.diameter * 2));
            const attemptCount = Math.min(maxCircles, 50); // Cap at 50 circles per size

            for (let i = 0; i < attemptCount; i++) {
                const newCircle = tryPlaceCircle(radius, placed);
                if (newCircle) {
                    placed.push({ ...newCircle, color });
                } else {
                    // If we can't place anymore, stop trying this size
                    break;
                }
            }
        }

        return placed;
    };

    // Regenerate pattern when parameters change
    useEffect(() => {
        if (circles.length > 0 && canvasWidth > 0 && canvasHeight > 0) {
            const pattern = generatePattern();
            setPlacedCircles(pattern);
        } else {
            setPlacedCircles([]);
        }
    }, [canvasWidth, canvasHeight, circles, regenerateKey]);

    // Function to manually regenerate
    const handleRegenerate = () => {
        setRegenerateKey(prev => prev + 1);
    };

    return (
        <Card className="w-full">
            <CardContent className="p-6 space-y-4">
                {/* Canvas with pattern */}
                <div className="border-2 rounded-lg overflow-hidden bg-white shadow-inner">
                    <svg
                        width={canvasWidth}
                        height={canvasHeight}
                        className="w-full h-auto"
                        viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
                    >
                        {/* Background */}
                        <rect
                            width={canvasWidth}
                            height={canvasHeight}
                            fill="#f8f9fa"
                        />

                        {/* Margin guide (optional - can remove) */}
                        <rect
                            x={EDGE_MARGIN}
                            y={EDGE_MARGIN}
                            width={canvasWidth - 2 * EDGE_MARGIN}
                            height={canvasHeight - 2 * EDGE_MARGIN}
                            fill="none"
                            stroke="#e0e0e0"
                            strokeWidth="1"
                            strokeDasharray="5,5"
                        />

                        {/* Generated circles */}
                        {placedCircles.map((circle, idx) => (
                            <circle
                                key={idx}
                                cx={circle.x}
                                cy={circle.y}
                                r={circle.radius}
                                fill={circle.color}
                                fillOpacity="0.7"
                                stroke="#333"
                                strokeWidth="1.5"
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

                {/* Pattern info and controls */}
                <div className="flex items-center justify-between pt-2">
                    <div className="text-sm text-muted-foreground space-y-1">
                        <p>Canvas: {canvasWidth} × {canvasHeight}px</p>
                        <p>Circles generated: {placedCircles.length}</p>
                        <p>Circle types: {circles.length}</p>
                    </div>

                    <button
                        onClick={handleRegenerate}
                        className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                    >
                        🔄 Regenerate
                    </button>
                </div>

                {/* Warning if too few circles */}
                {placedCircles.length < 5 && circles.length > 0 && (
                    <div className="text-xs text-amber-600 bg-amber-50 p-3 rounded-md border border-amber-200">
                        ⚠️ Few circles were placed. Try: smaller circle sizes, larger canvas, or click Regenerate
                    </div>
                )}
            </CardContent>
        </Card>
    );
}