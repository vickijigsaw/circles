export interface PlacedCircle {
    x: number;
    y: number;
    radius: number;
    diameter?: number;
    color?: string;
}

// Check overlap between circles
export function doCirclesOverlap(
    x1: number,
    y1: number,
    r1: number,
    x2: number,
    y2: number,
    r2: number,
    minDistance = 0
): boolean {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.hypot(dx, dy) < r1 + r2 + minDistance;
}

// Check if within canvas bounds
export function isWithinBounds(
    x: number,
    y: number,
    r: number,
    width: number,
    height: number,
    margin = 0
): boolean {
    return (
        x - r >= margin &&
        x + r <= width - margin &&
        y - r >= margin &&
        y + r <= height - margin
    );
}

// Attempt to place a circle randomly
export function tryPlaceCircle({
    radius,
    color,
    existingCircles,
    canvasWidth,
    canvasHeight,
    edgeMargin,
    minDistance,
    maxAttempts = 100,
}: {
    radius: number;
    color: string;
    existingCircles: PlacedCircle[];
    canvasWidth: number;
    canvasHeight: number;
    edgeMargin: number;
    minDistance: number;
    maxAttempts?: number;
}): PlacedCircle | null {
    for (let i = 0; i < maxAttempts; i++) {
        const x =
            edgeMargin +
            radius +
            Math.random() * (canvasWidth - 2 * (edgeMargin + radius));
        const y =
            edgeMargin +
            radius +
            Math.random() * (canvasHeight - 2 * (edgeMargin + radius));

        if (!isWithinBounds(x, y, radius, canvasWidth, canvasHeight, edgeMargin))
            continue;

        const overlaps = existingCircles.some((c) =>
            doCirclesOverlap(x, y, radius, c.x, c.y, c.radius, minDistance)
        );

        if (!overlaps) return { x, y, radius, color };
    }
    return null;
}
