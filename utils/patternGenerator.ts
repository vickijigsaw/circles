import { tryPlaceCircle, PlacedCircle } from "./circleUtils";

interface CircleInput {
    diameter: number;
    count: number;
    color: string;
}

export function generateCirclePattern(
    canvasWidth: number,
    canvasHeight: number,
    circles: CircleInput[],
    edgeMargin: number,
    minDistance: number
): PlacedCircle[] {
    const placed: PlacedCircle[] = [];

    // Flatten all circle definitions into one array
    const allCircles = circles.flatMap((c) =>
        Array.from({ length: c.count }, () => ({
            radius: c.diameter / 2,
            color: c.color,
        }))
    );

    // Shuffle for randomness
    const shuffled = [...allCircles].sort(() => Math.random() - 0.5);

    // Try to place each circle
    for (const circle of shuffled) {
        const newCircle = tryPlaceCircle({
            radius: circle.radius,
            color: circle.color,
            existingCircles: placed,
            canvasWidth,
            canvasHeight,
            edgeMargin,
            minDistance,
            maxAttempts: 50,
        });
        if (newCircle) placed.push(newCircle);
    }

    return placed;
}
