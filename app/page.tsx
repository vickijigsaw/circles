"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import CircleParameters from "@/components/circle/CircleParameters";
import CircleGenerator from "@/components/circle/CircleGenerator";
import { useSession } from "next-auth/react";


type CircleObject = {
  diameter: number;
  count: number;
  color: string;
  index: number;
};

export default function Home() {
  // State for circles - starts with empty array
  const [circleObjects, setCircleObjects] = useState<CircleObject[]>([]);

  // State for first circle (index 1)
  const [firstCircleDiameter, setFirstCircleDiameter] = useState<number>(50);
  const [firstCircleCount, setFirstCircleCount] = useState<number>(10);
  const [firstCircleColor, setFirstCircleColor] = useState<string>("#000000");

  // State for canvas dimensions - with initial values
  const [canvasWidth, setCanvasWidth] = useState<number>(1000);
  const [canvasHeight, setCanvasHeight] = useState<number>(500);

  // Auth
  const { data: session } = useSession();
  console.log(session?.user);

  // Function to add a new circle
  const handleAddCircle = () => {
    const newCircle: CircleObject = {
      diameter: 30,
      count: 15,
      color: "#000000",
      index: circleObjects.length + 2, // +2 because first circle is index 1
    };
    setCircleObjects(prev => [...prev, newCircle]);
  };

  // Function to remove a circle
  const handleRemoveCircle = (indexToRemove: number) => {
    setCircleObjects(prev =>
      prev
        .filter(circle => circle.index !== indexToRemove)
        .map(circle =>
          circle.index > indexToRemove
            ? { ...circle, index: circle.index - 1 }
            : circle
        )
    );
  };

  // Function to update a circle's diameter
  const handleUpdateDiameter = (indexToUpdate: number, newDiameter: number) => {
    if (indexToUpdate === 1) {
      setFirstCircleDiameter(newDiameter);
    } else {
      setCircleObjects(prev =>
        prev.map(circle =>
          circle.index === indexToUpdate
            ? { ...circle, diameter: newDiameter }
            : circle
        )
      );
    }
  };

  // Function to update a circle's count
  const handleUpdateCount = (indexToUpdate: number, newCount: number) => {
    if (indexToUpdate === 1) {
      setFirstCircleCount(newCount);
    } else {
      setCircleObjects(prev =>
        prev.map(circle =>
          circle.index === indexToUpdate
            ? { ...circle, count: newCount }
            : circle
        )
      );
    }
  };

  // Function to update a circle's color
  const handleUpdateColor = (indexToUpdate: number, newColor: string) => {
    if (indexToUpdate === 1) {
      setFirstCircleColor(newColor);
    } else {
      setCircleObjects(prev =>
        prev.map(circle =>
          circle.index === indexToUpdate
            ? { ...circle, color: newColor }
            : circle
        )
      );
    }
  };

  // Function to save pattern to gallery
  const handleSavePattern = async () => {
    if (!session?.user) {
      alert("Please log in to save patterns!");
      // e.g., router.push("/login");
      return;
    }

    const now = new Date();
    const name = `Pattern_${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`;

    const patternData = {
      name,
      canvasWidth,
      canvasHeight,
      circles: [
        { diameter: firstCircleDiameter, count: firstCircleCount, color: firstCircleColor, index: 1 },
        ...circleObjects
      ]
    };


    const response = await fetch('/api/patterns', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(patternData),
    });

    if (response.ok) {
      alert("Pattern saved to gallery!");
    } else {
      alert("Failed to save pattern.");
    }

  };

  // Function to export as SVG
  const handleExportSVG = () => {
    alert("Exporting as SVG... (feature coming soon)");
    // TODO: Implement SVG export
  };

  return (
    <div className="min-h-screen w-full flex flex-col">
      {/* Header with greeting */}
      <header className="w-full py-8 px-8 border-b">
        <h1 className="text-4xl font-bold text-center">
          👋 Hello, I'm a Circle Pattern Generator
        </h1>
        <p className="text-center text-muted-foreground mt-2">
          Create beautiful geometric patterns with custom parameters
        </p>
      </header>

      {/* Main content */}
      <main className="flex-1 w-full px-8 py-8">
        <div className="flex gap-6 items-start flex-col md:flex-row">
          {/* Left side - Parameters Card */}
          <Card className="w-full md:flex-1">
            <CardHeader>
              <CardTitle>Parameters</CardTitle>
              <CardDescription>Create Your Dream Pattern!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Canvas dimensions section */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="canvasWidth">Canvas Width (px)</Label>
                  <Input
                    type="number"
                    id="canvasWidth"
                    min={100}
                    max={2000}
                    value={canvasWidth}
                    onChange={(e) => setCanvasWidth(Number(e.target.value))}
                    placeholder="Enter canvas width"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="canvasHeight">Canvas Height (px)</Label>
                  <Input
                    type="number"
                    id="canvasHeight"
                    min={100}
                    max={2000}
                    value={canvasHeight}
                    onChange={(e) => setCanvasHeight(Number(e.target.value))}
                    placeholder="Enter canvas height"
                  />
                </div>
              </div>

              {/* Circle parameters section */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm">Circle Types</h3>

                {/* First circle - cannot be deleted */}
                <CircleParameters
                  index={1}
                  diameter={firstCircleDiameter}
                  count={firstCircleCount}
                  color={firstCircleColor}
                  onDiameterChange={newVal => handleUpdateDiameter(1, newVal)}
                  onCountChange={newVal => handleUpdateCount(1, newVal)}
                  onColorChange={newVal => handleUpdateColor(1, newVal)}
                />

                {/* Additional circles - can be deleted */}
                {circleObjects.map(circle => (
                  <CircleParameters
                    key={circle.index}
                    index={circle.index}
                    diameter={circle.diameter}
                    count={circle.count}
                    color={circle.color}
                    deletable
                    onDiameterChange={newVal => handleUpdateDiameter(circle.index, newVal)}
                    onCountChange={newVal => handleUpdateCount(circle.index, newVal)}
                    onColorChange={newVal => handleUpdateColor(circle.index, newVal)}
                    handleRemoveCircle={() => handleRemoveCircle(circle.index)}
                  />
                ))}
              </div>

              {/* Add circle button */}
              <Button
                variant="outline"
                onClick={handleAddCircle}
                className="w-full"
                disabled={circleObjects.length >= 4}
              >
                + Add a Circle Type
              </Button>
              {circleObjects.length >= 4 && (
                <p className="text-xs text-muted-foreground text-center">
                  Maximum 5 circle types reached
                </p>
              )}

              {/* Action buttons for saving and exporting */}
              <div className="space-y-2 pt-4 border-t">
                <Button
                  onClick={handleSavePattern}
                  className="w-full"
                  variant="default"
                >
                  💾 Save to Gallery
                </Button>
                <Button
                  onClick={handleExportSVG}
                  className="w-full"
                  variant="secondary"
                >
                  📥 Export as SVG
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Right side - Pattern Generator Display */}
          <div className="flex-1">
            <CircleGenerator
              canvasWidth={canvasWidth}
              canvasHeight={canvasHeight}
              circles={[
                { diameter: firstCircleDiameter, count: firstCircleCount, color: firstCircleColor, index: 1 },
                ...circleObjects
              ]}
            />
          </div>
        </div>
      </main>
    </div>
  );
}