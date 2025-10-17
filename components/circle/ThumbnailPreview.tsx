import { SavedPattern } from "@/app/gallery/page";
import { PlacedCircle } from "@/components/utils/circleUtils";

const ThumbnailPreview = ({ pattern }: { pattern: SavedPattern }) => {
    const { canvasWidth, canvasHeight, placedCircles } = pattern;

    const EDGE_MARGIN = 20;

    // Use stored placed circles if available, otherwise fall back to empty array
    const circlesData = (placedCircles as PlacedCircle[]) || [];

    return (
        <svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
            className="w-full h-full"
        >
            {/* Background */}
            <rect width={canvasWidth} height={canvasHeight} fill="#ffffff" />

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
            {circlesData.map((circle, idx) => (
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
            {circlesData.length === 0 && (
                <text
                    x={canvasWidth / 2}
                    y={canvasHeight / 2}
                    textAnchor="middle"
                    fill="#999"
                    fontSize="16"
                >
                    No circles
                </text>
            )}
        </svg>
    );
};

export default ThumbnailPreview;