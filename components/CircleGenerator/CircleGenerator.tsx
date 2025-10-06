
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";

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
    const EDGE_MARGIN = 20;

    // Minimum distance between circles (in pixels)
    const MIN_DISTANCE = 20;

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
        color: string,
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
                return { x, y, radius, color };
            }
        }

        return null; // Could not place circle after max attempts
    };

    // Generate pattern
    const generatePattern = () => {
        const placed: PlacedCircle[] = [];

        // Create one big array of all circles to place
        const allCircles: { radius: number; color: string }[] = [];
        circles.forEach(circleType => {
            const radius = circleType.diameter / 2;
            for (let i = 0; i < circleType.count; i++) {
                allCircles.push({ radius, color: circleType.color });
            }
        });

        // Shuffle for randomness
        const shuffled = [...allCircles].sort(() => Math.random() - 0.5);

        // Try to place each circle
        for (const circle of shuffled) {
            const newCircle = tryPlaceCircle(circle.radius, circle.color, placed, 50);
            if (newCircle) {
                placed.push(newCircle);
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

    // Calculate total requested vs placed circles
    const totalRequested = circles.reduce((sum, c) => sum + c.count, 0);
    const totalPlaced = placedCircles.length;

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
                            fill="#ffffff"
                        />

                        {/* Margin guide (subtle, optional) */}
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

                        {/* Generated circles */}
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

                {/* Pattern info and controls */}
                <div className="flex items-center justify-between pt-2">
                    <div className="text-sm text-muted-foreground space-y-1">
                        <p>Canvas: {canvasWidth} × {canvasHeight}px</p>
                        <p>Circles placed: {totalPlaced} / {totalRequested} requested</p>
                        <p>Circle types: {circles.length}</p>
                    </div>

                    <button
                        onClick={handleRegenerate}
                        className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                    >
                        🔄 Regenerate
                    </button>
                </div>

                {/* Warning if not all circles could be placed */}
                {totalPlaced < totalRequested && circles.length > 0 && (
                    <div className="text-xs text-amber-600 bg-amber-50 p-3 rounded-md border border-amber-200">
                        ⚠️ Only {totalPlaced} of {totalRequested} circles could fit. Try: smaller circles, fewer circles, larger canvas, or click Regenerate
                    </div>
                )}

                {/* Success message */}
                {totalPlaced === totalRequested && totalPlaced > 0 && (
                    <div className="text-xs text-green-600 bg-green-50 p-3 rounded-md border border-green-200">
                        ✅ All circles placed successfully!
                    </div>
                )}
            </CardContent>
        </Card>
    );
}