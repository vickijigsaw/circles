"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import CircleParameters from "@/components/CircleParameters/CircleParameters";
import CircleGenerator from "@/components/CircleGenerator/CircleGenerator";

type CircleObject = {
  diameter: number;
  index: number;
};

export default function Home() {
  // State for circles - starts with empty array
  const [circleObjects, setCircleObjects] = useState<CircleObject[]>([]);

  // State for canvas dimensions - with initial values
  const [canvasWidth, setCanvasWidth] = useState<number>(800);
  const [canvasHeight, setCanvasHeight] = useState<number>(600);

  // Mock auth state (to replace with real auth later)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Function to add a new circle
  const handleAddCircle = () => {
    const newCircle: CircleObject = {
      diameter: 20,
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
    setCircleObjects(prev =>
      prev.map(circle =>
        circle.index === indexToUpdate
          ? { ...circle, diameter: newDiameter }
          : circle
      )
    );
  };

  // Function to save pattern to gallery
  const handleSavePattern = () => {
    if (!isLoggedIn) {
      // If not logged in, redirect to login
      alert("Please log in to save patterns!");
      // TODO: router.push('/login')
    } else {
      // If logged in, save to backend
      const patternData = {
        canvasWidth,
        canvasHeight,
        circles: [
          { diameter: 20, index: 1 },
          ...circleObjects
        ]
      };
      console.log("Saving pattern:", patternData);
      // TODO: API call to save pattern
      alert("Pattern saved to gallery!");
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
        <h1 className="text-5xl font-bold text-center">
          👋 Hello, I'm a Circle Pattern Generator
        </h1>
        <p className="text-center text-muted-foreground mt-2">
          Create beautiful geometric patterns with custom parameters
        </p>
      </header>

      {/* Main content */}
      <main className="flex-1 w-full px-8 py-8">
        <div className="flex gap-6 items-start">
          {/* Left side - Parameters Card */}
          <Card className="w-full max-w-sm flex-shrink-0">
            <CardHeader>
              <CardTitle>Parameters</CardTitle>
              <CardDescription>Create Your Custom Pattern!</CardDescription>
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
                <h3 className="font-semibold text-sm">Circle Sizes</h3>

                {/* First circle - cannot be deleted */}
                <CircleParameters
                  index={1}
                  diameter={20}
                  onDiameterChange={newVal => handleUpdateDiameter(1, newVal)}
                />

                {/* Additional circles - can be deleted */}
                {circleObjects.map(circle => (
                  <CircleParameters
                    key={circle.index}
                    index={circle.index}
                    diameter={circle.diameter}
                    deletable
                    onDiameterChange={newVal => handleUpdateDiameter(circle.index, newVal)}
                    handleRemoveCircle={() => handleRemoveCircle(circle.index)}
                  />
                ))}
              </div>

              {/* Add circle button */}
              <Button
                variant="outline"
                onClick={handleAddCircle}
                className="w-full"
              >
                + Add a Circle
              </Button>

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
                { diameter: 20, index: 1 },
                ...circleObjects
              ]}
            />
          </div>
        </div>
      </main>
    </div>
  );
}