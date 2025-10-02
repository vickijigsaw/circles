import React, { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../ui/card";
import { Stage, Layer, Rect, Circle, Text } from 'react-konva';

type Props = {};

interface CircleData {
    id: number;
    x: number;
    y: number;
    radius: number;
    fill: string;
}

const CircleGenerator = (props: Props) => {
    const [circles, setCircles] = useState<CircleData[]>([]);
    const stageWidth = 800;
    const stageHeight = 600;
    const circleSizes = [10, 30, 60];

    const checkCollision = (newCircle: CircleData, existingCircles: CircleData[]): boolean => {
        for (const circle of existingCircles) {
            const dx = newCircle.x - circle.x;
            const dy = newCircle.y - circle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const minDistance = newCircle.radius + circle.radius + 5; // 5px buffer

            if (distance < minDistance) {
                return true;
            }
        }
        return false;
    };

    const generateCircles = () => {
        const newCircles: CircleData[] = [];
        let attempts = 0;
        const maxAttempts = 5000;

        while (attempts < maxAttempts && newCircles.length < 1000) {
            const radius = circleSizes[Math.floor(Math.random() * circleSizes.length)];
            const x = Math.random() * (stageWidth - 2 * radius) + radius;
            const y = Math.random() * (stageHeight - 2 * radius) + radius;
            const fill = '#000';

            const newCircle: CircleData = {
                id: newCircles.length,
                x,
                y,
                radius,
                fill
            };

            if (!checkCollision(newCircle, newCircles)) {
                newCircles.push(newCircle);
            }

            attempts++;
        }

        setCircles(newCircles);
    };

    useEffect(() => {
        generateCircles();
    }, []);

    return (
        <Card className="w-full min-w-xs">
            <CardHeader>
                <CardTitle>Generator</CardTitle>
            </CardHeader>
            <CardContent>
                <Stage width={stageWidth} height={stageHeight}>
                    <Layer>
                        <Text text={`Generated ${circles.length} circles`} fontSize={15} />
                        {circles.map((circle) => (
                            <Circle
                                key={circle.id}
                                x={circle.x}
                                y={circle.y}
                                radius={circle.radius}
                                fill={circle.fill}
                                draggable
                            />
                        ))}
                    </Layer>
                </Stage>
            </CardContent>
        </Card>
    );
};

export default CircleGenerator;
